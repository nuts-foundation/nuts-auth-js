import QRCode from 'qrcode'

export function init(config) {
  // set default config values

  // the url of the nuts-auth server
  config.nutsAuthUrl = 'nutsAuthUrl' in config ? config.nutsAuthUrl : 'http://localhost:1323';
  // which element to show the qrCode in
  config.qrEl = 'qrEl' in config ? config.qrEl : 'qrCode';
  // log login results to console.log
  config.logLevel = 'logLevel' in config ? config.logLevel : 'none';
  // on success, post token to which path?
  config.postTokenPath = 'postTokenPath' in config ? config.postTokenPath : '/login';
  // location for the browser to navigate to after success
  config.afterSuccessPath = 'afterSuccessPath' in config ? config.afterSuccessPath : '/user';

  // Check if qrCode element can be found
  if (!document.getElementById(config.qrEl)) {
    throw(`Could not load qr code: element with id ${config.qrEl} not found!`);
  }

  const fetchStatus = function (sessionId) {
    return fetch(`${config.nutsAuthUrl}/auth/contract/session/${sessionId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {"Content-Type": "application/json"},
      cache: 'reload'
    }).then((result) => result.json())
  };

  // Handy helper with information about how to use IRMA
  const showHelper = function () {
    document.querySelector('.irma-web-form .header').classList.add('show-helper');
  };

  const hideHelper = function () {
    document.querySelector('.irma-web-form .header').classList.remove('show-helper');
  };


  const setQrCode = (qrCodeInfo) => {
    const canvasEl = document.getElementById(config.qrEl);
    const qrCodeString = JSON.stringify(qrCodeInfo);
    QRCode.toCanvas(canvasEl, qrCodeString, {width: 350});
  };

  const start = function () {
    // show helper after 20 seconds
    setTimeout(showHelper, 20000);

    setState(WAIT_FOR_QR_CODE);

    // Check if there is a previous unfinished session.
    // This can happen if the page got reloaded during a session
    let existingSessionInit = JSON.parse(localStorage.getItem('session_init_info'));
    if (existingSessionInit) {
      setQrCode(existingSessionInit.qr_code_info);
      pollForStatus(existingSessionInit.session_id);
      return;
    }

    let postData = {
      type: "BehandelaarLogin",
      language: "NL",
      version: "v1"
    };

    fetch(`${config.nutsAuthUrl}/auth/contract/session`, {
      method: 'POST',
      mode: 'cors',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(postData),
      cache: 'reload'
    }).then((result) => {
      if (result.status !== 201) {
        throw "error while creating signing session";
      } else {
        return result.json(); // returns a promise
      }
    }).then((parsedResult) => {
      setQrCode(parsedResult.qr_code_info);
      localStorage.setItem('session_init_info', JSON.stringify(parsedResult));
      pollForStatus(parsedResult.session_id);

    }).catch((err) => {
        console.log("err", err);
        stateMachine("ERROR");
      }
    );
  };

  const pollForStatus = function (sessionId) {
    fetchStatus(sessionId)
      .then((status) => {
        if (config.logLevel === 'debug') {
          console.log("state:", status);
        }
        stateMachine(status);
      }).catch((err) => {
        console.log(err);
        stateMachine("ERROR");
      }
    )
  };

  // handle these cases: https://godoc.org/github.com/privacybydesign/irmago/server#Status
  // Set state, poll for status while not in final state
  // Clear local storage when in final staten (failure or success)
  const stateMachine = function (status) {
    switch (status.status) {
      case "INITIALIZED":
        setState(INITIALIZED_STATE);
        setTimeout(() => pollForStatus(status.token), 1000);
        break;
      case "CONNECTED":
        setState(WAITING_FOR_USER_STATE);
        setTimeout(() => pollForStatus(status.token), 1000);
        break;
      case "TIMEOUT":
        localStorage.clear();
        setState(EXPIRED_STATE);
        break;
      case "CANCELLED":
        localStorage.clear();
        setState(CANCELLED_STATE);
        break;
      case "DONE":
        localStorage.clear();
        if (status.proofStatus === "VALID") {
          setState(SUCCESS_STATE);
          handleSuccess(status);
        } else {
          setState(ERROR_STATE);
        }
        break;
      case "ERROR":
      default:
        localStorage.clear();
        setState(ERROR_STATE);
        break;
    }
  };

  const handleSuccess = function (status) {
    fetch(config.postTokenPath, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({nuts_auth_token: status.nuts_auth_token}),
      cache: 'reload',
      json: true
    }).then((res) => {
      if (config.logLevel === 'debug') {
        console.log("result", res);
      }
      if (res.status === 200) {
        // show success state for 2 seconds before continuing
        setTimeout(() => window.location = config.afterSuccessPath, 2000)
      } else {
        setState(ERROR_STATE);
      }
    }).catch((err) => {
      setState(ERROR_STATE);
      console.log("error while validating session", err);
    })
  };

  const WAIT_FOR_QR_CODE = 'loading';
  const INITIALIZED_STATE = 'initialized';
  const WAITING_FOR_USER_STATE = 'waiting-for-user';
  const SUCCESS_STATE = 'success';
  const EXPIRED_STATE = 'expired';
  const CANCELLED_STATE = 'cancelled';
  const ERROR_STATE = 'errored';

  // let currentState;

  const stateEl = function (state) {
    return document.querySelector(`.irma-web-form .content .${state}`)
  };

  const setState = function (state) {
    // currentState = state;
    hideAllStates();
    stateEl(state).style.display = ""
  };

  const hideAllStates = function () {
    document.querySelectorAll(`.irma-web-form .content .centered`).forEach((el) => {
      el.style.display = 'none'
    })
  };

  return {
    hideHelper,
    start,
  }
};
