const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const { createToken } = require("../../helpers/utilities");
//scafolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJson(userData).password) {
        let tokenId = createToken(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone: phone,
          id: tokenId,
          expires: expires,
        };
        //store in database
        data.create("token", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "Server unavailable",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not correct",
        });
      }
    });
  } else {
    callback(400, {
      error: "invalid request",
    });
  }
};
handler._token.get = (requestProperties, callback) => {
  const tokenID =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;
  if (tokenID) {
    // look up the token db
    data.read("token", tokenID, (err, tokenData) => {
      const tokenDetails = { ...parseJson(tokenData) };
      if (!err && tokenDetails) {
        callback(200, tokenDetails);
      } else {
        callback(404, {
          error: "Requested token doesn't exists",
        });
      }
    });
  } else {
    callback(404, {
      error: "tokenID is not valid",
    });
  }
};
handler._token.put = (requestProperties, callback) => {
  const tokenID =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 19
      ? requestProperties.body.id
      : false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (tokenID && extend) {
    data.read("token", tokenID, (err1, tokenData) => {
      const snapshot = { ...parseJson(tokenData) };
      if (!err1) {
        if (snapshot.expires >= Date.now()) {
          tokenObject = Date.now() + 60 * 60 * 1000;

          //update the database
          data.update("token", tokenID, snapshot, (err2) => {
            if (!err2) {
              callback(200, {
                message: "expiry time extended succesfull",
              });
            } else {
              callback(500, {
                error: "Server Side error",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token already expired",
          });
        }
      } else {
        callback(400, {
          error: "Couldn't found the token",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token",
    });
  }
};
handler._token.delete = (requestProperties, callback) => {
  const tokenID =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;
  if (tokenID) {
    data.read("token", tokenID, (err1, tokenData) => {
      if (!err1 && tokenData) {
        data.delete("token", tokenID, (err2) => {
          if (!err2) {
            callback(200, {
              message: "token delete successfull",
            });
          } else {
            callback(500, {
              messsage: "Server unavailable",
            });
          }
        });
      } else {
        callback(500, {
          messsage: "token not found",
        });
      }
    });
  } else {
    callback(400, {
      messsage: "Unable to resolve your request",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("token", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJson(tokenData).phone === phone &&
        parseJson(tokenData).expires >= Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
module.exports = handler;
