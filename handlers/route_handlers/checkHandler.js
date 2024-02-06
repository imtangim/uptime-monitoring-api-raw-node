const data = require("../../lib/data");
const { hash, createToken } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const tokenHandler = require("../../handlers/route_handlers/tokenHandler");
const enviroment = require("../../helpers/enviroments");
//scafolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._check = {};
handler._check.post = (requestProperties, callback) => {
  //validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url.trim()
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(
      requestProperties.body.method.toLowerCase()
    ) > -1
      ? requestProperties.body.method.trim()
      : false;
  const successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;
  const timeoutSecond =
    typeof requestProperties.body.timeoutSecond === "number" &&
    requestProperties.body.timeoutSecond % 1 === 0 &&
    requestProperties.body.timeoutSecond >= 1 &&
    requestProperties.body.timeoutSecond <= 5
      ? requestProperties.body.timeoutSecond
      : false;

  if (protocol && url && method && successCode && timeoutSecond) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    //lookup userphone using token
    data.read("token", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        let userPhone = parseJson(tokenData).phone;
        //lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = { ...parseJson(userData) };
                let userChecks =
                  typeof userObject.checks == "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length <= enviroment.maxChecks) {
                  let checkId = createToken(20);
                  let checkObject = {
                    id: checkId,
                    phone: userPhone,
                    protocol: protocol,
                    url: url,
                    method: method,
                    successCode: successCode,
                    timeoutSecond: timeoutSecond,
                  };
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "Server unresponsive",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "Server unresponsive",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "user has reached max check",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication Failure",
                });
              }
            });
          } else {
            callback(403, {
              error: "user not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication problem",
        });
      }
    });
  } else {
    callback(404, {
      error: "Invalid Request",
    });
  }
};
handler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJson(checkData).phone,
          (isValid) => {
            if (isValid) {
              callback(200, parseJson(checkData));
            } else {
              callback(403, {
                error: "Authentication Error",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "Server unresponsive",
        });
      }
    });
  } else {
    callback(400, {
      error: "invalid token id",
    });
  }
};
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 19
      ? requestProperties.body.id
      : false;
  //validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url.trim()
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(
      requestProperties.body.method.toLowerCase()
    ) > -1
      ? requestProperties.body.method.trim()
      : false;
  const successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;
  const timeoutSecond =
    typeof requestProperties.body.timeoutSecond === "number" &&
    requestProperties.body.timeoutSecond % 1 === 0 &&
    requestProperties.body.timeoutSecond >= 1 &&
    requestProperties.body.timeoutSecond <= 5
      ? requestProperties.body.timeoutSecond
      : false;
  console.log(id);
  if (id) {
    if (protocol || url || method || successCode || timeoutSecond) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = parseJson(checkData);
          let token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;
          tokenHandler._token.verify(
            token,
            checkObject.phone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCode) {
                  checkObject.successCode = successCode;
                }
                if (timeoutSecond) {
                  checkObject.timeoutSecond = timeoutSecond;
                }
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200, {
                      message: "user update succesfull",
                    });
                  } else {
                    callback(500, {
                      error: "Server Side error",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "Authorization error",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: "Server unresponsive",
          });
        }
      });
    } else {
      callback(400, {
        error: "You must provide at least one field to update",
      });
    }
  } else {
    callback(404, {
      error: "Invalid Request",
    });
  }
};
handler._check.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 19
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJson(checkData).phone,
          (isValid) => {
            if (isValid) {
              data.delete("checks", id, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "Checks Deleted successfull",
                  });
                } else {
                  callback(500, {
                    messsage: "Server unavailable",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Not Authenticated",
              });
            }
          }
        );
      } else {
      }
    });
    //verify token
  } else {
    callback(400, {
      messsage: "Unable to resolve your request",
    });
  }
};
module.exports = handler;
