//dependecies
const {sampleHandler}=require("./handlers/route_handlers/sampleHandler")
const {userHandler}=require("./handlers/route_handlers/userHandler")
const {tokenHandler}=require("./handlers/route_handlers/tokenHandler")
const {checkHandler}=require("./handlers/route_handlers/checkHandler")


const routes = {
    sample: sampleHandler,
    user:userHandler,
    token:tokenHandler,
    check:checkHandler,
}
// console.log(routes["check"]+"78921392");
module.exports = routes;