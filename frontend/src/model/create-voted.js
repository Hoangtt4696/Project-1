import BaseModel from './base.js';

const apiUrl = 'api/vote';

const CreateVotingModel = {
  getVoting: () => {
    return new Promise((resolve) => {
      let url = `${apiUrl}`;
      BaseModel.get(url, null, function(data) {
        resolve(data);
      })
    })
  },

  getVotingPeriodBased: period => {
    return new Promise((resolve) => {
      let url = `${apiUrl}`;
      BaseModel.get(url, {year_month_vote: period}, function(data) {
        resolve(data);
      })
    })
  },

  getVotingPeriodBasedPagination: (data) => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}`;
      BaseModel.get(url, {year_month_vote: data.period, page: data.page, limit: data.limit}, data => {
        resolve(data)
      }, err => {
        reject(err)
      })
    })
  },

  postVoting: (data) => {
    return new Promise((resolve, reject) => {
      BaseModel.post(apiUrl, data, function(data) {
        resolve(data);
      }, function(err) {
        reject(err);
      })
    })
  },

  putVoting: ({ id, status }) => {
    // const statusUrl = status ? 'deactivate' : 'activate';

    let url = `${apiUrl}/${id}`;

    return new Promise((resolve, reject) => {
      BaseModel.put(url, {activate: !status}, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  },

  submitResult: (id) => {
    let url = `${apiUrl}/${id}/submit`;
    return new Promise((resolve, reject) => {
      BaseModel.put(url, null, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      });
    });
  }
};

export default CreateVotingModel;