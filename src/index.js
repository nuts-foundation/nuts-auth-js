import axios from 'axios';

const client = (serverAddress, actingPartyCN) => {

  const validateToken = async function (token) {
    // construct body to post to nuts-node
    const body = {
      contract_format: 'jwt',
      contract_string: token,
      acting_party_cn: actingPartyCN,
    };

    let validationResponse;

    try {
      validationResponse = await axios.post(`${serverAddress}/auth/contract/validate`, body)
    } catch (e) {
      throw "Something went wrong while validating the token"
    }

    return validationResponse.data;
  };

  return {
    validateToken
  }

};

export default client;
