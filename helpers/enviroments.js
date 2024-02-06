



//module scafolding

const enviroments ={};

enviroments.staging={
    port:3000,
    env_name :"staging",
    secretKey : "wqeurewyfgrvhsfv5ada",
    maxChecks:5,
    twilio:{
        fromPhone:'+14783758917',
        sid:'ACae8a9feecfc45642118e71f1e42ccd68',
        token:'dc07d4d94c0dea968c4e0946164bf377',
    }
}
enviroments.production={
    port:5000,
    env_name :"production",
    secretKey : "dadghasdghfdsga",
    maxChecks:5,
    twilio:{
        fromPhone:'+14783758917',
        sid:'ACae8a9feecfc45642118e71f1e42ccd68',
        token:'dc07d4d94c0dea968c4e0946164bf377',
    }
}

//determine which enviroment was passed
const currentEnviroment = typeof(process.env.NODE_ENV)=="string"? process.env.NODE_ENV:'staging';


//export corresponding env object
const enviromentToExport = typeof(enviroments[currentEnviroment])=='object'?enviroments[currentEnviroment]: enviroments.staging;


//export modules
module.exports = enviromentToExport;






