module.exports = {
  moduleAdmin: global.env.MODULEADMIN,
  moduleInstall: global.env.MODULEINSTALL,
  prefix_db: global.env.PREFIX_DB,
  protocol: global.env.PROTOCOL,
  prefix_app: global.env.PREFIX_APP,
  host: global.env.HOST,
  pretty_host: global.env.PRETTY_HOST,
  hash_token: global.env.HASH_TOKEN,
  expired_token: global.env.EXPIRED_TOKEN, // thoi gian het han cua token tinh bang phut
  db_mg_connect_string: global.env.DB_MG_CONNECT_STRING, // thoi gian het han cua token tinh bang phut
  mongo_config: {
    db_mg_user: global.env.DB_MG_USER,
    db_mg_pass: global.env.DB_MG_PASS,
    db_mg_host: global.env.DB_MG_HOST,
    db_mg_port: global.env.DB_MG_PORT,
    db_mg_name: global.env.DB_MG_NAME,
  },
  rabbit_config: {
    active: global.env.RABBIT_CONFIG_ACTIVE,
    publisher_active: global.env.RABBIT_CONFIG_PUBLISHER_ACTIVE,
    consumer_active: global.env.RABBIT_CONFIG_CONSUMER_ACTIVE,
    prefetch: parseFloat(global.env.RABBIT_CONFIG_PREFETCH),
    ttl: parseFloat(global.env.RABBIT_CONFIG_TTL),
    time_retry_consumer: global.env.RABBIT_CONFIG_TIME_RETRY_CONSUMER || 1000,
    user: global.env.RABBIT_CONFIG_USER,
    pass: global.env.RABBIT_CONFIG_PASS,
    host: global.env.RABBIT_CONFIG_HOST,
    port: global.env.RABBIT_CONFIG_PORT,
    vhost: global.env.RABBIT_CONFIG_VHOST,
    queue: {
      sync_sum_vote_point: {
        limitConsumer: global.env.RABBIT_CONFIG_QUEUE_SYNC_SUM_VOTE_POINT_LIMITCONSUMER,
        active: global.env.RABBIT_CONFIG_QUEUE_SYNC_SUM_VOTE_POINT_ACTIVE,
        retryLimit: global.env.RABBIT_CONFIG_QUEUE_SYNC_SUM_VOTE_POINT_RETRYLIMIT
      },
      sync_create_vote: {
        limitConsumer: global.env.RABBIT_CONFIG_QUEUE_SYNC_CREATE_VOTE_LIMITCONSUMER,
        active: global.env.RABBIT_CONFIG_QUEUE_SYNC_CREATE_VOTE_ACTIVE,
        retryLimit: global.env.RABBIT_CONFIG_QUEUE_SYNC_CREATE_VOTE_RETRYLIMIT
      },
    },
  },
  hr_api: global.env.HR_API,
  hr_account_api: global.env.HR_ACCOUNT_API,
  hraccount_login: {
    orgId: global.env.ORGID,
    response_mode: global.env.RESPONSE_MODE,
    url_authorize: global.env.URL_AUTHORIZE,
    url_connect_token: global.env.URL_CONNECT_TOKEN,
    url_get_user_info: global.env.URL_GET_USER_INFO,
    grant_type: global.env.GRANT_TYPE,
    nonce: global.env.NONCE,
    response_type: global.env.RESPONSE_TYPE,
    get_code_callback: global.env.GET_CODE_CALLBACK,
    clientID: global.env.CLIENTID,
    clientSecret: global.env.CLIENTSECRET,
    scope: global.env.SCOPE,
    hr_call_back_url: global.env.HR_CALL_BACK_URL,
  },
  client_login_callback_url: global.env.CLIENT_LOGIN_CALLBACK_URL,
  client_login_error_callback_url: global.env.CLIENT_LOGIN_ERROR_CALLBACK_URL,
  mailer: {
    from: global.env.MAILER_FROM || 'noreply@haravan.com',
    options: {
      service: global.env.MAILER_SERVICE_PROVIDER || 'http://42.117.4.246:5000/mailer'
    }
  },
  app: {
    title: global.env.APP_TITLE,
    normalize_title : global.env.APP_NORMALIZE_TITLE,
  },
  upload_host: {
    long_term: {
      host: global.env.LONG_TERM_UPLOAD_HOST,
      auth: global.env.LONG_TERM_UPLOAD_HOST_AUTH,
      upload_dir: global.env.UPLOAD_DIR,
    },
    short_term: {
      host: global.env.SHORT_TERM_UPLOAD_HOST,
      auth: global.env.SHORT_TERM_UPLOAD_HOST_AUTH,
      import_dir: global.env.IMPORT_DIR,
      export_dir: global.env.EXPORT_DIR,
    },
  },
  get domain() {
    return `${this.protocol}${this.host}${global.env.PORT || ''}/`;
  },
  get domain_frontend() {
    return `${this.protocol}${this.host}${global.env.PORT_FRONTEND || ''}/`;
  },
  get redirect_uri() {
    return `${this.domain_frontend}${this.prefix_app}install/finalize`;
  },
  get pretty_url() {
    return `${this.protocol}${this.pretty_host}${global.env.PORT || ''}/`;
  },
  get haravan_uri_install() {
    return `${this.haravan_shop_admin_domain}api/auth/?api_key=${global.env.HARAVAN_CREDENTIAL_SETS}`;
  },
  get haravan_uri_authen() {
    return `oauth/authorize?client_id=${global.env.HARAVAN_API_KEY}&scope=${global.env.HARAVAN_SCOPE}&redirect_uri=${this.redirect_uri}&response_type=code`;
  },
}