import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import config from 'config/config'
class HomeIndexs extends Component {
  goLogin() {
    window.location.href = config.buildLoginHrUrl
  }
  render() {
    return (
        <Layout style={{ height:'100vh'}}>
          <div className="main-container">
            <div className="wrap-box">
              <div className="wrapper-content">
                <div className="ui-main-section-header ">
                    <a href="//www.haravan.com">
                    <img className="padding-left-8" alt='haravan-logo' style={{ height: '40px' }} src='/images/logo.png' />
                    </a>
                </div>
                <div className="ui-main-section-body">
                  <div className="text-bold" style={{ fontSize: 25 }}>
                    Đăng xuất
                  </div>
                  <div>
                    {/* Bạn có muốn đăng xuất toàn bộ các dịch vụ? */}
                    Đăng xuất thành công
                  </div>
                  {/* <div style={{ marginTop: '20px'}}>
                    <Button type="default" onClick={this.goLogin.bind(this)}>Đăng xuất</Button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      // </AdminLayout>
    );
  }
}
export default HomeIndexs;
