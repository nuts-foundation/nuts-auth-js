# nuts-auth-js
An easy to use client js library to authenticate a user with nuts-auth

## Install
```
npm i @nuts-foundation/auth
```

## Usage

This can be combined with the css from https://github.com/nuts-foundation/irma-web-frontend

```html
<section class="nuts-login-form irma-web-form">
  <header class="header">
    <p>Login with <i class="irma-web-logo">IRMA</i></p>
    <section class="helper">
      <p>Don't know what to do here? Take a look at the <a href="https://privacybydesign.foundation/irma-begin/">de
          website of IRMA</a>.</p>
    </section>
  </header>
  <section class="content">
    <section class="centered loading">
      <div class="irma-web-loading-animation"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <p>One moment please...</p>
    </section>
    <section class="centered initialized">
      <div id="qrcode"></div>
    </section>
    <section class="centered waiting-for-user">
      <div class="irma-web-waiting-for-user-animation"></div>
      <p>Follow the instructions on your phone</p>
    </section>
    <section class="centered success">
      <div class="irma-web-checkmark-animation"></div>
      <p>Success!</p>
    </section>
    <section class="centered expired">
      <p>The transaction took long</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
    <section class="centered cancelled">
      <p>The transaction got cancelled</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
    <section class="centered errored">
      <p>Something went wrong</p>
      <p><a href="#" onclick="nutsLogin.start()">Try again</a></p>
    </section>
  </section>
</section>
```

```js
nutsLogin = NutsLogin.init({
    nutsAuthUrl: "http://localhost:1323",
    qrEl: 'qrcode',
    logLevel: 'debug',
    postTokenPath: '/login'
  })
nutsLogin.start();
````
