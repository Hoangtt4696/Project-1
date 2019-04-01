import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import {ACTION_SELECT_MENU_ITEM} from '../../actions/admin/admin-menu-left';
import PropTypes from 'prop-types';
import storage from 'lib/storage.js'
import config from 'config/config'
import lodash from 'lodash'
const propTypes = {
  selectedItem: PropTypes.string.isRequired,
  actSelectMenuItem: PropTypes.func.isRequired
}
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class AdminMenuLeft extends Component {
  handleSelectMenuItem = () => {
    const location = window.location.pathname.split('/')[2]
    if (location) {
      this.props.actSelectMenuItem(location);
    }
  }

  componentDidMount() {
    this.handleSelectMenuItem();
  }
  render() {
    let style = {display: 'none'}
    let user = storage.getData('me');
    let role = lodash.get(user, 'role', '');
    let userInfo = lodash.get(user, 'user_info', {});
    let isRoot = lodash.get(userInfo, 'isRoot', false);
    let scope = lodash.get(userInfo, 'scope', []);


    // if (user && (role === 'admin' || scope.indexOf('admin') > -1)) {
    //   style.display = '';
    // }
    if (isRoot || scope.indexOf('admin') >= 0 || scope.indexOf('hr_api.admin') >= 0) {
      style.display = '';
    }
    return (
      <Sider className='bg-left' width={250}
      breakpoint="lg"
      collapsedWidth="0"
      // onBreakpoint={(broken) => { console.log(broken); }}
      // onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
      >
        <Menu
          selectedKeys={[this.props.selectedItem]}
          defaultSelectedKeys={['assess']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
        <Menu.Item key="assess" onClick={this.handleSelectMenuItem}>
          <Link to={config.pathAdmin + '/assess'}>
                <span className='text-color-primary'>Đánh giá 360°</span>
          </Link>
        </Menu.Item>
          <SubMenu className="re-header" style={style} key="sub1" title={<span>Thiết lập</span>}>
            <Menu.Item key="create-voted" onClick={this.handleSelectMenuItem}>
              <Link to={config.pathAdmin + '/create-voted'}>
                  <span className='text-color-primary'>Danh sách cuộc bình chọn</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="setting-general" onClick={this.handleSelectMenuItem}>
              <Link to={config.pathAdmin + '/setting-general'}>
                  <span className='text-color-primary'>Thiết lập chung</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="voting-limit">
              <Link to={config.pathAdmin + '/voting-limit'}>
                  <span className='text-color-primary'>Hạn mức bình chọn</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}
AdminMenuLeft.propTypes = propTypes;
const mapStatesToProps = state => ({
  selectedItem: state.selectedAdminMenuItem,
})
const mapDispatchToProps = dispatch => ({
  actSelectMenuItem: item => dispatch({type: ACTION_SELECT_MENU_ITEM, item})
})
// export default AdminMenuLeft;
export default connect(mapStatesToProps, mapDispatchToProps)(AdminMenuLeft);
