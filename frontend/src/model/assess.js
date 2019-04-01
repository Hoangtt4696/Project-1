import BaseModel from './base.js'

const urlAPI = 'api'

const AssessModel = {
  getListVotePoint: (query) => {
    return new Promise((resolve, reject) => {
      let url = `${urlAPI}/vote-point`;
      BaseModel.get(url, query, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  },
  postAssess: (data) => {
    return new Promise((resolve, reject) => {
      let url = `${urlAPI}/vote-point`;
      BaseModel.post(url, data, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  }
}

export default AssessModel;