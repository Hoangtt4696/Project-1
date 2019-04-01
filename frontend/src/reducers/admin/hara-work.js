import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAILURE,
  GET_DEPARTMENT_UNITS,
  GET_DEPARTMENT_UNITS_SUCCESS,
  GET_DEPARTMENT_UNITS_FAILURE,
  GET_JOBTITLES,
  GET_JOBTITLES_FAILURE,
  GET_JOBTITLES_SUCCESS,
  GET_ALL_DEPARTMENTS,
  GET_ALL_DEPARTMENTS_FAILURE,
  GET_ALL_DEPARTMENTS_SUCCESS,
  GET_EMPLOYEES_DEPARTMENT_BASED,
  GET_EMPLOYEES_DEPARTMENT_BASED_SUCCESS,
  GET_EMPLOYEES_DEPARTMENT_BASED_FAILURE,
  GET_ALL_JOBTITLES,
  GET_ALL_JOBTITLES_FAILURE,
  GET_ALL_JOBTITLES_SUCCESS,
  GET_EMPLOYEES,
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAILURE,
  GET_DEPARTMENT,
  GET_DEPARTMENT_FAILURE,
  GET_DEPARTMENT_SUCCESS,
  GET_ALL_SALARY_ELEMENTS,
  GET_ALL_SALARY_ELEMENTS_FAILURE,
  GET_ALL_SALARY_ELEMENTS_SUCCESS,
  QUERY_DEPARTMENTS,
  QUERY_DEPARTMENTS_SUCCESS,
  QUERY_DEPARTMENTS_FAILURE
} from '../../actions/admin/hara-work';

export default { haraWork }
// reducer with initial state
const initialState = {
  isFetching: false,
  department: [],
  departments: [],
  allDepartments: [],
  departmentUnits: [],
  jobtitles: [],
  error: null,
  employees: [],
  allJobTitles: [],
  allEmployees: [],
  allSalaryElements: [],
  queryEmployeesFetching: false,
  queryDeptFetching: false,
  queriedDepartments: []
};

function haraWork(state = initialState, action) {
  switch (action.type) {
    case GET_DEPARTMENTS:
      return { ...state, isFetching: true };
    case GET_DEPARTMENTS_SUCCESS:
      return { ...state, isFetching: false, departments: action.departments, error: null };
    case GET_DEPARTMENTS_FAILURE:
      return { ...state, isFetching: false, departments: [], error: action.error };

    case GET_ALL_DEPARTMENTS:
      return { ...state, isFetching: true };
    case GET_ALL_DEPARTMENTS_SUCCESS:
      return { ...state, isFetching: false, allDepartments: action.allDepartments, error: null };
    case GET_ALL_DEPARTMENTS_FAILURE:
      return { ...state, isFetching: false, allDepartments: [], error: action.error };


    case GET_DEPARTMENT_UNITS:
      return { ...state, isFetching: true, error: null };
    case GET_DEPARTMENT_UNITS_SUCCESS:
      return { ...state, isFetching: false, departmentUnits: action.departmentUnits, error: null };
    case GET_DEPARTMENT_UNITS_FAILURE:
      return { ...state, isFetching: false, departmentUnits: [], error: action.error };

    case GET_JOBTITLES:
      return { ...state, isFetching: true, error: null };
    case GET_JOBTITLES_SUCCESS:
      return { ...state, isFetching: false, jobtitles: action.jobtitles, error: null };
    case GET_JOBTITLES_FAILURE:
      return { ...state, isFetching: false, jobtitles: [], error: action.error };

    case GET_ALL_JOBTITLES:
      return { ...state, isFetching: true, error: null };
    case GET_ALL_JOBTITLES_SUCCESS:
      return { ...state, isFetching: false, allJobtitles: action.jobtitles, error: null };
    case GET_ALL_JOBTITLES_FAILURE:
      return { ...state, isFetching: false, allJobtitles: [], error: action.error };

    case GET_EMPLOYEES_DEPARTMENT_BASED:
      return { ...state, queryEmployeesFetching: true, employees: [], error: null}
    case GET_EMPLOYEES_DEPARTMENT_BASED_SUCCESS:
      return { ...state, queryEmployeesFetching: false, employees: action.employees, error: null}
    case GET_EMPLOYEES_DEPARTMENT_BASED_FAILURE:
      return {...state, queryEmployeesFetching: false, error: action.error, employees: []}

    case GET_EMPLOYEES:
      return { ...state, isFetching: true, allEmployees: [], error: null}
    case GET_EMPLOYEES_SUCCESS:
      return { ...state, isFetching: false, allEmployees: action.employees, error: null}
    case GET_EMPLOYEES_FAILURE:
      return {...state, isFetching: false, error: action.error, employees: []}

    case GET_DEPARTMENT:
      return { ...state, isFetching: true };
    case GET_DEPARTMENT_SUCCESS:
      return { ...state, isFetching: false, department: action.department, error: null };
    case GET_DEPARTMENT_FAILURE:
      return { ...state, isFetching: false, department: [], error: action.error };

    case GET_ALL_SALARY_ELEMENTS:
      return { ...state, isFetching: true };
    case GET_ALL_SALARY_ELEMENTS_SUCCESS:
      return { ...state, isFetching: false, allSalaryElements: action.elements, error: null };
    case GET_ALL_SALARY_ELEMENTS_FAILURE:
      return { ...state, isFetching: false, allSalaryElements: [], error: action.error };

    case QUERY_DEPARTMENTS:
      return { ...state, queryDeptFetching: true };
    case QUERY_DEPARTMENTS_SUCCESS:
      return { ...state, queryDeptFetching: false, queriedDepartments: action.departments, error: null };
    case QUERY_DEPARTMENTS_FAILURE:
      return { ...state, queryDeptFetching: false, queriedDepartments: [], error: action.error };

    default:
      return state;
  }
}