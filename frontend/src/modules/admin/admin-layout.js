import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import AdminMenuLeft from 'modules/admin/admin-menu-left.js';
import AdminHeader from 'modules/admin/admin-header.js';

class AdminLayout extends Component {
  text = () => <span>Thoát</span>
  content = () => (
    <div>
      <p>Thông tin cá nhân</p>
      <p>Đổi mật khẩu</p>
    </div>
  )

  render() {
    return (
      <Layout className="layout">
        {/*--------------- Start Menu Top --------------------*/}
          <AdminHeader/>
        {/*--------------- End Menu Top --------------------*/}

        <Layout>

          {/*--------------- Start Menu Left --------------------*/}
          <AdminMenuLeft />
          {/*--------------- End Menu Left --------------------*/}

          {/*--------------- Start Content --------------------*/}
          {this.props.children}
          {/*--------------- End Content --------------------*/}
        </Layout>

      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  products: state.products,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
