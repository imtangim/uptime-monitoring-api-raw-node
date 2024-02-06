//  dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writing
  fs.open(`${lib.baseDir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert data to strng

      const stringData = JSON.stringify(data);

      //write data to file then close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Closing the new file");
            }
          });
        } else {
          callback("Error writing new file.");
        }
      });
    } else {
      callback(err.message);
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //convert data to strng
        const stringData = JSON.stringify(data);

        //truncate the file
        fs.ftruncate(fileDescriptor, (err1) => {
          if (!err1) {
            //write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
              if (!err2) {
                fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    console.log("Error closing file");
                  }
                });
              } else {
                callback("Error writing to file");
              }
            });
          } else {
            callback("Error truncating file.");
          }
        });
      } else {
        callback(err.message);
      }
    }
  );
};

lib.delete = (dir, file, callback) => {
  //unlink file

  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Errorr deleting file ${err.message}`);
    }
  });
};

lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir + dir}/`, (err, filenames) => {
    if (!err && filenames && filenames.length > 0) {
      let trimmedFileNames = [];
      filenames.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback("error reading directory");
    }
  });
};
module.exports = lib;
