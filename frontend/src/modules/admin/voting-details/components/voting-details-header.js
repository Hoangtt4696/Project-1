import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Col, Select, Button} from 'antd';
import config from 'config/config'

const {Option} = Select;

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  isEditting: PropTypes.bool.isRequired,
  handleClickEdit: PropTypes.func.isRequired,
  handleClickDeactive: PropTypes.func.isRequired,
  handleClickActive: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(PropTypes.object),
  selectedDepartment: PropTypes.number,
  onChangeSelect: PropTypes.func.isRequired
}

class Header extends Component {
  render() {
    const {
      isActive,
      isEditting,
      handleClickEdit, 
      handleClickDeactive, 
      handleClickActive,
      departments,
      selectedDepartment,
      onChangeSelect
    } = this.props;
    return (
      <>
        <Col span={10}>
        <Breadcrumb className="Breadcrumb">
          <Breadcrumb.Item><a className="Breadcrumb" href={`${config.pathAdmin}/create-voted`}>Danh sách cuộc bình chọn</a></Breadcrumb.Item>
          <Breadcrumb.Item className="Breadcrumb">Chi tiết cuộc bình chọn</Breadcrumb.Item>
        </Breadcrumb>
        </Col>
        <Col span={14} className="text-right">
          <span>
            <Select
              className="border"
              showSearch
              style={{ width: '300px' }}
              placeholder="Loading..."
              value={selectedDepartment !== 0 ? selectedDepartment: 'Loading...'}
              onChange={onChangeSelect}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              loading={selectedDepartment === 0}
              disabled={isEditting}
              >
              {departments && departments.map(d => 
                <Option key={d.id} value={d.id}>{d.name}</Option>
              )}
            </Select>
          </span>
          <span>
            {!isEditting &&
              <Button type="primary" className="bg-primary margin-left-7" onClick={handleClickEdit}>Chỉnh sửa</Button>
            }
            {isActive && <Button type="primary" className="bg-stop margin-left-7" onClick={handleClickDeactive}>Ngưng kích hoạt</Button>}
            {!isActive && <Button type="primary" className="bg-active margin-left-7" onClick={handleClickActive}>Kích hoạt</Button>}
          </span>
        </Col>
      </>
    );
  }
}

Header.propTypes = propTypes;

export default Header;