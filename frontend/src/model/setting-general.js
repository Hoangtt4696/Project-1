import BaseModel from './base.js'

const urlApi = 'api'

const GeneralSettingModel = {
  getSetting: () => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/setting/general`;
      BaseModel.get(url, null, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  },
  putSetting: (data) => {
    return new Promise((resolve, reject) => {
      let url = `${urlApi}/vote/setting/general`;
      BaseModel.put(url, data, function(data) {
        resolve(data);
      }, function(err) {
        reject(err)
      })
    })
  }
}

export default GeneralSettingModel;