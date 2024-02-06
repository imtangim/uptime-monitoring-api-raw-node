const crypto = require("crypto");
const enviroment = require("./enviroments");
//module scafolding
const utilities = {};

//parse json stream to object
utilities.parseJson = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};
//string hashing
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", enviroment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};
utilities.createToken = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;

  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvxyz1234567890";
    let output = "";
    for (let i = 1; i < length; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};
//export modules
module.exports = utilities;
