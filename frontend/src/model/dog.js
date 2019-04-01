import BaseModel from './base.js'
const DogModel = {
  getList: () => {
    return new Promise((resolve) => {
      let url = 'https://dog.ceo/api/breeds/image/random';
      BaseModel.get(url, {params: 1}, function(data) {
        resolve(data);
      })
    })
  }
}

export default DogModel;