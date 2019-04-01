import BaseModel from './base';

const apiUrl = 'api';

const VotingLimitModel = {
  getDetail: () => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/vote/setting/limit/`;

      BaseModel.get(url, null, function(res) {
        resolve(res);
      }, function(err) {
        reject(err);
      })
    });
  },
  putVoting: data => {
    return new Promise((resolve, reject) => {
      let url = `${apiUrl}/vote/setting/limit`;

      BaseModel.put(url, data, function(res) {
        resolve(res);
      }, function(err) {
        reject(err);
      })
    });
  },
};

export default VotingLimitModel;