//dependecies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const enviroment = require("../helpers/enviroments");
const data = require("./data");
const { parseJson } = require("../helpers/utilities");
const { sendTwilioSms } = require("../helpers/notification");
const url = require("url");
const https = require("https");
const { stat } = require("fs");
// app object
const worker = {};

//gather all check
worker.gatherAllChecks = () => {
  //get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        //read the check data
        data.read("checks", check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            //pass the data to the check validator
            worker.validateCheckData(parseJson(originalCheckData));
          } else {
            console.log("Error: reading one of the checks data");
          }
        });
      });
    } else {
      console.log("Error: couldnot find any checks");
    }
  });
};

//validate individual check data
worker.validateCheckData = (checkData) => {
  let originalCheckData = checkData;
  if (originalCheckData && originalCheckData.id) {
    originalCheckData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";
    originalCheckData.lastCheck =
      typeof originalCheckData.lastCheck === "number" &&
      originalCheckData.lastCheck > 0
        ? originalCheckData.lastCheck
        : false;

    //pass to the next process
    worker.performCheck(originalCheckData);
  } else {
    console.log("Error: invalid check or not properly formatted");
  }
};

//perform check
worker.performCheck = (checkData) => {
  //prepare the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };
  //mark the outcome has not been sent yet
  let outcomeSent = false;
  let originalCheckData = checkData;
  //parse the hostname and fullurl from original data
  let parsedUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const path = parsedUrl.path;

  //construct the url
  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path: path,
    timeout: originalCheckData.timeoutSecond * 1000,
  };
  const protocolToUse = originalCheckData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    //grab the status of the response
    const status = res.statusCode;
    //update the check outcome and update the database
    checkOutCome.responseCode = status;
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    } else {
    }
  });
  req.on("error", (e) => {
    let checkOutCome = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    } else {
    }
  });
  req.on("timeout", () => {
    let checkOutCome = {
      error: true,
      value: "timeout",
    };
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    } else {
    }
  });
  req.end();
};

worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
  let state =
    !checkOutCome.error &&
    originalCheckData.successCode.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  //decide wheter we should alert user or not
  let alertWanted =
    originalCheckData.lastCheck && originalCheckData.state != state
      ? true
      : false;

  //update the check data

  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastCheck = Date.now();

  //update the check to db
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      //send the check data to alert system
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there is not state change for "+newCheckData.url);
      }
    } else {
      console.log("Error: Failed to update the check data");
    }
  });
};

//alert the user
worker.alertUserToStatusChange = (newCheckData) => {
  let message = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;
  console.log(message);
  sendTwilioSms(newCheckData.phone, message, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via sms: ${message}`);
    } else {
      console.log(`There was a problem sending sms to ${newCheckData.url}`);
    }
  });
};
//timer to executre the worker process once per minute

worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 5000);
};

worker.init = () => {
  //execute all the checks

  worker.gatherAllChecks();

  //call the lopp so that checks continue

  worker.loop();
};

module.exports = worker;
