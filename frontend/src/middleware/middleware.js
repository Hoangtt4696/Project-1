import { Component } from 'react'
import config from 'config/config'
import lodash from 'lodash'
import storage from 'lib/storage'
import UserModel from '../model/user'
import BaseModel from '../model/base'

const queryString = require('query-string');

export default class Middleware extends Component {
  async componentDidMount() {
    let ignore = ['/loading', '/log-out', '/login-error'];

    let path = lodash.get(this.props, 'match.path', '');
    if (path === '') {
      path = window.location.href;
    }
    let redirect = true;
    let currentToken = storage.getData('AccessToken');

    for (let i = 0; i < ignore.length; i++) {
      let ignoreItem = ignore[i];
      if (path.indexOf(config.pathAdmin + ignoreItem) > -1) {
        redirect = false;
      }
    }
    console.log(path)
    if (!currentToken || !redirect) {
      path = path + '/';
      if (path.indexOf(config.pathAdmin + '/loading') > -1) {
        let token = this.getTokenFromPath();
        if (token !== '') {
          storage.setData('AccessToken', token);
          console.log('bbbbb')
          setTimeout(async () => {
            let token = storage.getData('AccessToken');
            if (token) {
              BaseModel.updateToken(token);
              const userInfo = await UserModel.getUserInfo();
              storage.setData('me', JSON.stringify(userInfo.data));
              
              window.location.href = config.pathAdmin;
            }
          
          }, 3000);
        } else {
          redirect = true;
        }
      }

      if (redirect) {
        let path = config.buildLoginHrUrl;
        window.location.href = path;
      }
    }
  }
  getTokenFromPath() {
    let search = lodash.get(this.props, 'location.search', '');
    if (search === '') {
      search = window.location.href.split('?')[1];
    }

    let query = queryString.parse(search);
    let token = lodash.get(query, 'token', '');
    return token;
  }

  render() {
    return this.props.children
  }
}