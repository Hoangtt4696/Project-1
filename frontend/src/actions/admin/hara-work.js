import { takeLatest, call, put, throttle } from 'redux-saga/effects';
import HaraWorkModel from '../../model/hara-work';

import _get from 'lodash/get';
// import { delay } from 'redux-saga';

export const GET_DEPARTMENTS = 'GET_DEPARTMENTS';
export const GET_DEPARTMENTS_SUCCESS = 'GET_DEPARTMENTS_SUCCESS';
export const GET_DEPARTMENTS_FAILURE = 'GET_DEPARTMENTS_FAILURE';

export const GET_DEPARTMENT = 'GET_DEPARTMENT';
export const GET_DEPARTMENT_SUCCESS = 'GET_DEPARTMENT_SUCCESS';
export const GET_DEPARTMENT_FAILURE = 'GET_DEPARTMENT_FAILURE';

export const GET_ALL_DEPARTMENTS = 'GET_ALL_DEPARTMENTS';
export const GET_ALL_DEPARTMENTS_SUCCESS = 'GET_ALL_DEPARTMENTS_SUCCESS';
export const GET_ALL_DEPARTMENTS_FAILURE = 'GET_ALL_DEPARTMENTS_FAILURE';

export const GET_JOBTITLES = 'GET_JOBTITLES';
export const GET_JOBTITLES_SUCCESS = 'GET_JOBTITLES_SUCCESS';
export const GET_JOBTITLES_FAILURE = 'GET_JOBTITLES_FAILURE';

export const GET_DEPARTMENT_UNITS = 'GET_DEPARTMENT_UNITS';
export const GET_DEPARTMENT_UNITS_SUCCESS = 'GET_DEPARTMENT_UNITS_SUCCESS';
export const GET_DEPARTMENT_UNITS_FAILURE = 'GET_DEPARTMENT_UNITS_FAILURE';

export const GET_ALL_JOBTITLES = 'GET_ALL_JOBTITLES';
export const GET_ALL_JOBTITLES_SUCCESS = 'GET_ALL_JOBTITLES_SUCCESS';
export const GET_ALL_JOBTITLES_FAILURE = 'GET_ALL_JOBTITLES_FAILURE';

export const GET_EMPLOYEES_DEPARTMENT_BASED = 'GET_EMPLOYEES_DEPARTMENT_BASED';
export const GET_EMPLOYEES_DEPARTMENT_BASED_SUCCESS = 'GET_EMPLOYEES_DEPARTMENT_BASED_SUCCESS';
export const GET_EMPLOYEES_DEPARTMENT_BASED_FAILURE = 'GET_EMPLOYEES_DEPARTMENT_BASED_FAILURE';

export const GET_EMPLOYEES = 'GET_EMPLOYEES';
export const GET_EMPLOYEES_SUCCESS = 'GET_EMPLOYEES_SUCCESS';
export const GET_EMPLOYEES_FAILURE = 'GET_EMPLOYEES_FAILURE';

export const GET_ALL_SALARY_ELEMENTS = 'GET_ALL_SALARY_ELEMENTS';
export const GET_ALL_SALARY_ELEMENTS_SUCCESS = 'GET_ALL_SALARY_ELEMENTS_SUCCESS';
export const GET_ALL_SALARY_ELEMENTS_FAILURE = 'GET_ALL_SALARY_ELEMENTS_FAILURE';

export const QUERY_DEPARTMENTS = 'QUERY_DEPARTMENTS';
export const QUERY_DEPARTMENTS_SUCCESS = 'QUERY_DEPARTMENTS_SUCCESS';
export const QUERY_DEPARTMENTS_FAILURE = 'QUERY_DEPARTMENTS_FAILURE';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherGetDepartments(),
  watcherGetDepartmentUnits(),
  watcherGetJobtitles(),
  watcherGetAllDepartments(),
  watcherGetAllJobTitle(),
  watcherGetEmployeesDepartmentBased(),
  watcherGetEmployees(),
  watcherGetDepartment(),
  watcherGetAllSalaryElements(),
  watcherQueryDepartments()
];

function* watcherQueryDepartments() {
  // yield call(delay, 5000);
  // yield takeLatest(QUERY_DEPARTMENTS, workerQueryDepartments);
  yield throttle(500, QUERY_DEPARTMENTS, workerQueryDepartments);
}

function* workerQueryDepartments(data) {
  try {
    let response = yield call(HaraWorkModel.queryDepartments, data.query);
    const departments = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: QUERY_DEPARTMENTS_SUCCESS, departments });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: QUERY_DEPARTMENTS_FAILURE, error });
  }
}

function* watcherGetAllSalaryElements() {
  yield takeLatest(GET_ALL_SALARY_ELEMENTS, workerGetAllSalaryElements);
}

function* workerGetAllSalaryElements(){
  try {
    let response = yield call(HaraWorkModel.getAllSalaryElements);
    const elements = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_ALL_SALARY_ELEMENTS_SUCCESS, elements });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_ALL_SALARY_ELEMENTS_FAILURE, error });
  }
}

function* watcherGetDepartment() {
  yield takeLatest(GET_DEPARTMENT, workerGetDepartment);
}

function* workerGetDepartment(data){
  try {
    let response = yield call(HaraWorkModel.getDepartment, data.id);
    const department = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_DEPARTMENT_SUCCESS, department });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_DEPARTMENT_FAILURE, error });
  }
}

function* watcherGetEmployees() {
  yield takeLatest(GET_EMPLOYEES, workerGetEmployees);
}

function* workerGetEmployees() {
  try {
    let response = yield call(HaraWorkModel.getEmployees);
    const employees = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_EMPLOYEES_SUCCESS, employees });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_EMPLOYEES_FAILURE, error });
  }
}

function* watcherGetAllJobTitle() {
  yield takeLatest(GET_ALL_JOBTITLES, workerGetAllJobTitle);
}

function* workerGetAllJobTitle() {
  try {
    let response = yield call(HaraWorkModel.getAllJobTitle);
    const jobtitles = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_ALL_JOBTITLES_SUCCESS, jobtitles });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_ALL_JOBTITLES_FAILURE, error });
  }
}

function* watcherGetEmployeesDepartmentBased() {
  yield takeLatest(GET_EMPLOYEES_DEPARTMENT_BASED, workerGetEmployeesDepartmentBased)
}

function* workerGetEmployeesDepartmentBased(data) {
  try {
    let response = yield call(HaraWorkModel.getEmployeesDepartmentBased, data.data);
    const employees = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_EMPLOYEES_DEPARTMENT_BASED_SUCCESS, employees });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_EMPLOYEES_DEPARTMENT_BASED_FAILURE, error });
  }
}

function* watcherGetAllDepartments() {
  yield takeLatest(GET_ALL_DEPARTMENTS, workerGetAllDepartments)
}

function* workerGetAllDepartments() {
  try {
    let response = yield call(HaraWorkModel.getAllDepartments);
    const allDepartments = _get(response, 'data.items', []);

    // dispatch a success action to the store with the new product
    yield put({ type: GET_ALL_DEPARTMENTS_SUCCESS, allDepartments });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_ALL_DEPARTMENTS_FAILURE, error });
  }
}

function* watcherGetDepartments() {
  yield takeLatest(GET_DEPARTMENTS, workerGetDepartments);
}

function* workerGetDepartments(id) {
  try {
    let newDepts = yield call(HaraWorkModel.getDepartments, id.id, id.isGetAll);
    let departments = [];

    newDepts.forEach(dept => {
      departments.push(...dept);
    });

    // dispatch a success action to the store with the new product
    yield put({ type: GET_DEPARTMENTS_SUCCESS, departments });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_DEPARTMENTS_FAILURE, error });
  }
}

function* watcherGetJobtitles() {
  yield takeLatest(GET_JOBTITLES, workerGetJobtitles);
}

function* workerGetJobtitles(id) {
  try {
      let newJobtitles = yield call(HaraWorkModel.getJobtitles, id.id, id.isGetAll);
      let jobtitles = [];

      newJobtitles.forEach(job => {
        jobtitles.push(..._get(job, 'items.data'));
      });

    // dispatch a success action to the store with the new product
    yield put({ type: GET_JOBTITLES_SUCCESS, jobtitles });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_JOBTITLES_FAILURE, error });
  }
}

function* watcherGetDepartmentUnits() {
  yield takeLatest(GET_DEPARTMENT_UNITS, workerGetDepartmentUnits);
}

function* workerGetDepartmentUnits() {
  try {
    let departmentUnits = yield call(HaraWorkModel.getDepartmentUnits);

    departmentUnits = _get(departmentUnits, 'data.items', []);

    yield put({ type: GET_DEPARTMENT_UNITS_SUCCESS, departmentUnits });
  } catch (error) {
    yield put({ type: GET_DEPARTMENT_UNITS_FAILURE, error });
  }
}