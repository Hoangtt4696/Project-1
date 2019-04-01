import BaseModel from './base.js'

const UserModel = {
  getUserInfo: () => {
    return new Promise((resolve) => {
      let url = 'api/authentication/user-info';
      BaseModel.get(url, null, function(data) {
        resolve(data);
      })
    })
  }
};

export default UserModel;