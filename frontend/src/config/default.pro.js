export default {
  pathAdmin: '/site',
  backend_url: 'https://danhgia360.onapp.haravan.com/',
  pretty_url: 'https://danhgia360.onapp.haravan.com/',
  hraccount_login: {
    orgid             : '200000000094',
    response_mode     : 'form_post',
    url_authorize     : 'https://accounts.haravan.com/connect/authorize',
    url_connect_token : 'https://accounts.haravan.com/connect/token',
    url_get_user_info : 'https://accounts.haravan.com/connect/userinfo',
    grant_type        : 'authorization_code',
    nonce             : 'kcjqhdltd',
    response_type     : 'code id_token',
    get_code_callback : '/api/authentication/hr',
    clientID          : '04313a043d0acedaaafdb8e15040237a',
    scope             : 'offline_access openid profile hac_api hr_api email org userinfo',
  },
  urlLogout: 'https://accounts.haravan.com/account/logout',
  get buildLoginHrUrlCallBack() {
    return 'https://danhgia360.onapp.haravan.com/api/authentication/hr';
  },
  get buildLoginHrUrl() {
    let objQuery = {
      response_mode: this.hraccount_login.response_mode,
      response_type: encodeURIComponent(this.hraccount_login.response_type),
      scope: encodeURIComponent(this.hraccount_login.scope),
      client_id: encodeURIComponent(this.hraccount_login.clientID),
      redirect_uri: encodeURIComponent(this.buildLoginHrUrlCallBack),
      nonce: this.hraccount_login.nonce
    };
    let query = Object.keys(objQuery).map(key => key + '=' + objQuery[key]).join('&');
    let url = `${this.hraccount_login.url_authorize}?${query}`;
    return url;
  }
}