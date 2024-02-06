//scafolding

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  // console.log(requestProperties),
    callback(404, {
      message: "Url not found",
    });
};

module.exports = handler;
