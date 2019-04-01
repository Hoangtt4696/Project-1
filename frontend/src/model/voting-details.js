import BaseModel from './base.js'

const urlApi = 'api'

const VotingDetailsModel = {
  getVotingDetails: (id) => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/${id.id}`;
      BaseModel.get(url, null, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  },
  putVotingDetails: (data) => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/${data.id}`;
      BaseModel.put(url, data.data, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  },
  setVotingActive: data => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/${data.data.id}/${data.data.data.activate}`;
      BaseModel.put(url, {departmentVote: data.data.data.departmentVote}, function(data) {
        resolve(data)
      }, function(err) {
        reject(err)
      })
    })
  },
  exportResult: data => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/${data}/export`

      BaseModel.get(url, null, function(data) {
        resolve(data)
      }, function(err) {
        reject(err)
      })
    })
  }
}

export default VotingDetailsModel;