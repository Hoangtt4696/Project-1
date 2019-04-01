import React, { Component } from 'react';
import { Layout, Icon, Col, Row, Popover, Avatar, Badge } from 'antd';
import storage from 'lib/storage'
import lodash from 'lodash'
import config from 'config/config'
const { Header } = Layout;
const logout = () => {
  localStorage.removeItem('AccessToken');
  // window.location.href = config.pathAdmin + '/log-out';
  window.location.href = config.urlLogout;
  
}
const text = <span onClick={logout} style={{ cursor: 'pointer' }}>Đăng xuất</span>;
const content = (
  <div>
    <a href="https://accounts.hara.vn/">Thông tin cá nhân</a>

  </div>
);

class AdminHeader extends Component {
  render() {
    let user = storage.getData('me');
    let name = ''
    let isRoot = lodash.get(user, 'user_info.isRoot', false);
    // let role = lodash.get(user, 'role', '');
    let scope = lodash.get(user, 'user_info.scope', []);
    let roleText = 'The Cofffee House'
    if (user) {
      name = lodash.get(user, 'name');
      if ((isRoot || scope.indexOf('admin') > -1 || scope.indexOf('hr_api.admin') > -1)) {
        roleText = 'The Coffee House';
      }
    }

    return (
      <Header className="menu-top">
        <Row style={{ height: '50px' }}>
          <Col span={8} style={{ height: '50px' }}>
            <div className="bg-top-logo">
              <img className="padding-left-8" style={{ height: '40px' }} src='/images/haravan.png' alt="" />
            </div>
          </Col>
          <Col span={8} className="text-center" style={{ height: '50px' }}>
          </Col>
          <Col className="text-right" span={8} style={{ height: '50px' }}>
            <div className="bg-top-login text-right">
              <Popover placement="bottomRight" title={text} content={content} trigger="click">
                <span >
                  <Badge dot><Avatar style={{ backgroundColor: '#2470b7' }} icon="user" /></Badge>
                </span>
                <span className="inline">
                  <div className="display-name text-left">{name}</div>
                  <div className="display-job text-left">{roleText}</div>
                </span>
                <span className="inline" style={{ color: 'white' }}>
                  <div className="display-down text-left"><Icon className="vertical-align-scalet" type="caret-down" /></div>
                  {/* <div className="display-job text-left"></div> */}
                </span>
              </Popover>
              <div className="clear"></div>
            </div>

            <div className="bg-top-logout text-right" style={{paddingRight:'8px'}}>
              <Popover placement="bottomRight" title={text} content={content} trigger="click">
               
                <span className="inline">
                  <div className="display-name text-left" style={{lineHeight: '50px'}}>Thoát</div>
                  <div className="display-name text-left">&nbsp;</div>
                </span>
                <span className="inline" style={{ color: 'white' }}>
                  <div className="display-down text-left"><Icon className="vertical-align-scalet" type="caret-down" /></div>
                  {/* <div className="display-job text-left"></div> */}
                </span>
              </Popover>
              <div className="clear"></div>
            </div>
          </Col>
          
        </Row>
      </Header>
    );
  }
}

export default AdminHeader;

