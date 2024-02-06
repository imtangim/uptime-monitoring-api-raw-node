const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const tokenHandler = require("../../handlers/route_handlers/tokenHandler");
//scafolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._user = {};
handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure that the user doesn't already exist
    data.read("users", phone, (err1, user) => {
      if (err1) {
        //main kaj
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        //store the user to db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "user was created succefully",
            });
          } else {
            callback(500, {
              error: "Could not create user",
            });
          }
        });
      } else {
        //already exist
        callback(500, {
          error: "User already exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "invalid request",
    });
  }
};
handler._user.get = (requestProperties, callback) => {
  // check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (isAuth) => {
      if (isAuth) {
        data.read("users", phone, (err, data) => {
          const user = { ...parseJson(data) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "Requested user doesn't exists",
            });
          }
        });
      } else {
        callback(403, {
          error: "Not Authenticated",
        });
      }
    });
  } else {
    callback(404, {
      error: "Phone Number is not valid",
    });
  }
};
handler._user.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (isAuth) => {
      if (isAuth) {
        if (firstName || lastName || password) {
          //look for the user
          data.read("users", phone, (err1, userData) => {
            const snapshot = { ...parseJson(userData) };
            if (!err1 && snapshot) {
              if (firstName) {
                snapshot.firstName = firstName;
              }
              if (lastName) {
                snapshot.lastName = lastName;
              }
              if (password) {
                snapshot.password = hash(password);
              }

              //update the database
              data.update("users", phone, snapshot, (err2) => {
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
              callback(400, {
                error: "Couldn't found the user",
              });
            }
          });
        } else {
          callback(400, {
            error: "Invalid request",
          });
        }
      } else {
        callback(403, {
          error: "Not Authenticated",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid phone number",
    });
  }
};
handler._user.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (isAuth) => {
      if (isAuth) {
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            data.delete("users", phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: "User delete successfull",
                });
              } else {
                callback(500, {
                  messsage: "Server unavailable",
                });
              }
            });
          } else {
            callback(500, {
              messsage: "User not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Not Authenticated",
        });
      }
    });
  } else {
    callback(400, {
      messsage: "Unable to resolve your request",
    });
  }
};
module.exports = handler;
