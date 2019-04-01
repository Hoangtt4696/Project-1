import React, { Component } from 'react';
import { Spin, Icon, Alert } from 'antd';
import AdminLayout from 'modules/admin/admin-layout.js'

const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 50 }} spin />;

class LoadingIndex extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <AdminLayout data={this.props}>
        <Spin indicator={antIcon}>
          <Alert className="width-100"
            type="info"
          />
        </Spin>
      </AdminLayout>
    );
  }
}

export default LoadingIndex;
