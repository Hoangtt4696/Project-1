export default {
  pathAdmin: '',
  backend_url: 'http://localhost:3000/',
  pretty_url: 'http://loc.haraoes_backend.com:3000',
  hraccount_login: {
    orgid             : '200000000094',
    response_mode     : 'form_post',
    url_authorize     : 'https://accounts.hara.vn/connect/authorize',
    url_connect_token : 'https://accounts.hara.vn/connect/token',
    url_get_user_info : 'https://accounts.hara.vn/connect/userinfo',
    grant_type        : 'authorization_code',
    nonce             : 'kcjqhdltd',
    response_type     : 'code id_token',
    get_code_callback : '/api/authentication/hr',
    clientID          : '2c8e395167189b1aaf96817984ada793',
    clientSecret      : '6f8bad896c9fe22c7b68d4bd393c266bdfcb145e5d041ba215b5d390196243de',
    scope             : 'offline_access openid profile hac_api hr_api email org userinfo',
  },
  get buildLoginHrUrlCallBack() {
    return 'http://loc.hara_oes.com:3000/hara_oes/admin/api/authentication/hr';
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