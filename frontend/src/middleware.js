import { Component } from 'react'
import config from 'config/config'
import lodash from 'lodash'
const queryString = require('query-string');

export default class Middleware extends Component {
  componentDidMount() {
    let ignore = ['loading', 'log-out'];

    let path = lodash.get(this.props, 'match.path', '');
    if (path === '') {
      path = window.location.href;
    }
    let redirect = true;
    let currentToken = localStorage.getItem('AccessToken');
    for (let i = 0; i < ignore.length; i++) {
      let ignoreItem = ignore[i];
      if (path.indexOf(config.pathAdmin + ignoreItem) > -1) {
        redirect = false;
      }
    }
    // console.log(redirect, currentToken)
    if (!currentToken || !redirect) {
      if (path.indexOf(config.pathAdmin + 'loading') > -1) {
        let token = this.getTokenFromPath();
        if (token !== '') {
          localStorage.setItem('AccessToken', token);
          window.location.href = '/' + config.pathAdmin;
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