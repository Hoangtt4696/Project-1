import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import RouteList from './modules/router';
// import registerServiceWorker from "./registerServiceWorker";
import { Provider } from 'react-redux';
import store from 'store';
import Middleware from './middleware/middleware';
import config from 'config/config'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Middleware>
        <Switch>
          {RouteList.map((props, index) => <Route exact key={index} {...props} />)}
          <Redirect from='*' to={`${config.pathAdmin}/assess`} />
        </Switch>
      </Middleware>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();