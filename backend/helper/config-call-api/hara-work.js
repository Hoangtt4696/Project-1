/**
 * @author Tran Dinh Hoang
 */

'use strict';

const getAccessToken = require('./hr-token-manager').get;

let callAPI          = {};

module.exports       = callAPI;

const BASE_HR_URL    = global.config.hr_api;
const BASE_ACCOUNT_HR = global.config.hr_account_api;

// ---------------------------  departments -------------------------
callAPI.HR_LIST_DEPARTMENT = {
  baseURL  : BASE_HR_URL,
  url      : '/departments',
  method   : 'get',
  pre_send : getAccessToken,
  default_params : {
    page      : 1,
    page_size : 20,
    isCount   : true,
  },
  params   : {
    page      : 1,
    page_size : 20,
    query     : '',
    parentId  : 1031,
    unitId    : 0,
    isGetAll  : false,
    isCount   : false,
  }
};

callAPI.HR_DEPARTMENT_DETAIL = {
  baseURL  : BASE_HR_URL,
  url      : '/department/{id}',
  method   : 'get',
  pre_send : getAccessToken,
  url_args : {
   id : 192
  }
};

callAPI.HR_LIST_CONTRACT_TYPE = {
  baseURL  : BASE_HR_URL,
  url      : '/contracttypes',
  method   : 'get',
  pre_send : getAccessToken
};

// ---------------------------  departments unit -------------------------
callAPI.HR_LIST_DEPARTMENT_UNIT = {
  baseURL  : BASE_HR_URL,
  url      : '/departmentUnits',
  method   : 'get',
  pre_send : getAccessToken
};

callAPI.HR_DEPARTMENT_UNIT_DETAIL = {
  baseURL  : BASE_HR_URL,
  url      : '/departmentUnit/{id}',
  method   : 'get',
  pre_send : getAccessToken
};

//----------------------------- Employees --------------------------
callAPI.HR_LIST_EMPLOYEES = {
  baseURL  : BASE_HR_URL,
  url      : '/employees',
  method   : 'get',
  pre_send : getAccessToken,
  params   : {
    departmentId      : 0,
    page              : 1,
    page_size         : 20,
    dateFilter        : 0,
    fromDate          : '',
    toDate            : '',
    jobtitleId        : 0,
    contractTypeId    : 0,
    query             : '',
    statusTimeKeeping : 0,
    statusactive      : 1,
    isBasic: true,
    contractDay: 0,
    contractDayQueryType: 0
  }
};

callAPI.HR_LIST_EMPLOYEES_ALL = {
  baseURL  : BASE_HR_URL,
  url      : '/employees/getall',
  method   : 'get',
  pre_send : getAccessToken,
  params   : {
    departmentId      : 0,
    page              : 1,
    page_size         : 20,
    dateFilter        : 0,
    fromDate          : '',
    toDate            : '',
    jobtitleId        : 0,
    contractTypeId    : 0,
    query             : '',
    statusTimeKeeping : 0,
    statusactive      : 0,
  }
};

callAPI.GET_EMPLOYEES_DETAIL = {
  baseURL  : BASE_HR_URL,
  url      : '/employees/{id}',
  method   : 'get',
  pre_send : getAccessToken
};

callAPI.GET_EMPLOYEE_BY_HR_ID = {
  baseURL  : BASE_HR_URL,
  url      : '/employees/getbyharaid',
  method   : 'get',
  params   : {
    haraId : 200000008811
  },
  pre_send : getAccessToken,
};

//------------------------------ salary elements ---------------------
callAPI.HR_LIST_SALARY_ELEMENTS = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryElements',
  method   : 'get',
  pre_send : getAccessToken,
  default_params : {
    page      : 1,
    page_size : 20,
  },
  params   : {
    page      : 1,
    page_size : 20,
    query     : '',
  }
};

callAPI.HR_LIST_ALL_SALARY_ELEMENTS = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryElements/getall',
  method   : 'get',
  pre_send : getAccessToken,
};

callAPI.HR_GET_SALARY_ELEMENT = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryElement/{id}',
  method   : 'get',
  pre_send : getAccessToken,
  url_args : {
    id : 68
  }
};

callAPI.HR_ADD_SALARY_DATA = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryData?elementCode={elementCode}&authenticateCode={authenticateCode}',
  method   : 'post',
  pre_send : getAccessToken,
  data     : {
    'haraId'     : 0,
    'employeeId' : 0,
    'salaryDay'  : '2018-11-29T10:24:52.658Z',
    'total'      : 0,
    'note'       : 'string'
  },
  url_args  : {
    elementCode      : 0,
    authenticateCode : 0,
  }
};

callAPI.HR_ADD_LIST_SALARY_DATA = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryData/addlist',
  method   : 'post',
  pre_send : getAccessToken,
  data     : [{
    'userId'           : 'string',
    'salaryDay'        : '2018-11-30T04:56:04.275Z',
    'total'            : 0,
    'note'             : 'string',
    'elementCode'      : 'string',
    'salaryPeriodCode' : 'string'
  }]
};

callAPI.HR_SALARY_DATA_RESET_POINT = {
  baseURL  : BASE_HR_URL,
  url      : '/salaryData/deactive',
  method   : 'put',
  pre_send : getAccessToken,
  params     : {
    employeeId  : 0,
    haraId      : 0,
    day         : '',
    elementCode : '',
    authenticationCode : ''
  }
}



//------------------------------ Jobtitle ---------------------
callAPI.HR_LIST_JOB_TITLE = {
  baseURL : BASE_HR_URL,
  url     : '/jobtitles', 
  method  : 'get',
  pre_send : getAccessToken,
  params  : {
    page:0,
    page_size:0,
    query:'',
    parentId:0,
    levelId:0,
    departmentId:0,
    isGetAll:false,
    isCount:false,
    getDeptManager:false
  }
}

//---------------------------------- USER -----------------------------------
callAPI.GET_USER = {
  baseURL  : BASE_ACCOUNT_HR,
  url      : '/users/{id}',
  method   : 'get',
  pre_send : getAccessToken,
};

callAPI.HR_ME = {
  baseURL  : BASE_ACCOUNT_HR,
  url      : '/me',
  method   : 'get',
  pre_send : getAccessToken,
};

//------------------------------- SUPERVISOR ----------------------------------
callAPI.HR_SUPERVISOR_DEPARTMENTS = {
  baseURL  : BASE_HR_URL,
  url      : '/supervisor/departments',
  method   : 'get',
  pre_send : getAccessToken,
};
