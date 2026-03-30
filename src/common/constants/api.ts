const PREFIX = "";

const API_URL = {
    LOGIN :{
        POST_LOGIN : `${PREFIX}/login`
    },
    REGISTER :{
        POST_REGISTER : `${PREFIX}/register`
    },
    PERMISSION :{
        PUT_PERMISSION : `${PREFIX}/updatePermission`
    },
    COMMON :{
        GET_USERINFORMATION_TOKEN : `${PREFIX}/getUserInformationByToken`,
        GET_USERINFORMATION_ID : `${PREFIX}/getUserInformationById`
    },
    SOURCE :{
        GET_TRACE_SOURCE_INFORMATION : `${PREFIX}/trace/get`
    }
};

export default API_URL;
