import BaseModel from './base.js'
const DogModel = {
  getList: () => {
    return new Promise((resolve) => {
      let url = 'http://5c0243ee5dca6b00130ffa76.mockapi.io/products';
      BaseModel.get(url, null, function(data) {
        resolve(data);
      })
    })
  },
  getDetail: (id) => {
    return new Promise((resolve) => {
      let url = 'http://5c0243ee5dca6b00130ffa76.mockapi.io/products/' + id;
      BaseModel.get(url, null, function(data) {
        resolve(data);
      })
    })
  }
}

export default DogModel;