import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import lodash from 'lodash';
import AdminLayout from 'modules/admin/admin-layout.js';
const queryString = require('query-string');
const { Header } = Layout;
class LoginError extends Component {
  render() {
    let search = lodash.get(this.props, 'location.search', '');
    if (search === '') {
      search = window.location.href.split('?')[1];
    }

    let query = queryString.parse(search);
    return (
      <AdminLayout>
        <Layout className="bg-error">
          <div className="height-100">
            <div className="text-center margin-top-60 ">
              <img style={{width:'405px'}} className="" alt="Haravan" src='/images/icon/error.png' />
            </div>
            <div className="text-center error-header" style={{ marginTop: '30px', marginBottom:'5px' }}>
              {lodash.get(query, 'error', 'Bạn không có quyền truy cập!')}
            </div>
            <div className="text-center">
             Nội dung không tồn tại hoặc bạn không có quyền để xem. Vui lòng liên hệ người quản trị.
            </div>
            <div className="text-center margin-top-30">
              <Button type="primary" className="btn-error" href="/site">Về trang chính</Button>
            </div>
          </div>
        </Layout>
      </AdminLayout>
      
    );
  }
}
export default LoginError;
