import BaseModel from './base';
import _get from 'lodash/get';
// import { number } from 'prop-types';

const apiUrl = 'api/hara-work';

const HaraWorkModel = {
  getDepartments: (ids, isGetAll = false) => {
    const dept = (id) => {
      return new Promise((resolve, reject) => {
        let url = `${apiUrl}/departments`;

        BaseModel.get(url, { unitId: id, isGetAll }, (res) => {
          resolve(_get(res, 'data.items', []));
        }, function(err) {
          reject(err)
        })
      });
    };

    return Promise.all(ids.map(proms => {
      return dept(proms);
    }));
  },

  getAllDepartments: () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/departments`;

      BaseModel.get(url, {isGetAll: true}, (res) => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    });
  },

  getDepartmentUnits: () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/departmentUnits`;

      BaseModel.get(url, null, (res) => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    });
  },
  getJobtitles: (ids, isGetAll = false) => {
    const jobtl = (id) => {
      return new Promise((resolve, reject) => {
        let url = `${apiUrl}/jobtitles/department/${id}`;

        BaseModel.get(url, { isGetAll }, (res) => {
          resolve(_get(res, 'data', {}));
        }, function(err) {
          reject(err)
        })
      });
    };

    return Promise.all(ids.map(proms => {
      return jobtl(proms);
    }));
  },

  getAllJobTitle : () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/jobtitles`;

      BaseModel.get(url, { isGetAll: true }, (res) => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    });
  },

  getEmployeesDepartmentBased: data => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/employees`;

      BaseModel.get(url, data, res => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    })
  },

  getEmployees: () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/employees`;

      BaseModel.get(url, {isGetAll: true}, res => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    })
  },

  getDepartment: id => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/department/${id}`;

      BaseModel.get(url, null, res => {
        resolve(res);
      }, function(err) {
        reject(err)
      })
    })
  },

  getAllSalaryElements: () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/salaryelements`;

      BaseModel.get(url, {isGetAll: true}, res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  },

  queryDepartments: query => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/departments`;

      BaseModel.get(url, {query, isGetAll: true}, res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }
};

export default HaraWorkModel;