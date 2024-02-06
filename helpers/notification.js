const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./enviroments");

//module scafolding
const notifications = {};

//sent sms to user using twillio api

notifications.sendTwilioSms = (phone, msg, callback) => {
  //input validation

  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMessage =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;
    console.log(userPhone);
    console.log(userMessage);
  if (userPhone && userMessage) {
    // configure the request payload

    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMessage,
    };
    //stringify the payload
    const stringifyPayload = querystring.stringify(payload);
    //config https package
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.sid}/Messages.json`,
      auth: `${twilio.sid}:${twilio.token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    //instantiate the request object
    const req = https.request(requestDetails, (res) => {
      //get the status code
      const status = res.statusCode;
      //callback successfullyt if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status Code returned: ${status}`);
      }
    });
    req.on("error", (e) => {
      callback(e);
    });
    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

//export the module

module.exports = notifications;
