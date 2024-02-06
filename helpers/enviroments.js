



//module scafolding

const enviroments ={};

enviroments.staging={
    port:3000,
    env_name :"staging",
    secretKey : "wqeurewyfgrvhsfv5ada",
    maxChecks:5,
    twilio:{
        fromPhone:'twilio-number',
        sid:'twilio-sid',
        token:'twilio-token',
    }
}
enviroments.production={
    port:5000,
    env_name :"production",
    secretKey : "dadghasdghfdsga",
    maxChecks:5,
    twilio:{
        fromPhone:'twilio-number',
        sid:'twilio-sid',
        token:'twilio-token',
    }
}

//determine which enviroment was passed
const currentEnviroment = typeof(process.env.NODE_ENV)=="string"? process.env.NODE_ENV:'staging';


//export corresponding env object
const enviromentToExport = typeof(enviroments[currentEnviroment])=='object'?enviroments[currentEnviroment]: enviroments.staging;


//export modules
module.exports = enviromentToExport;






