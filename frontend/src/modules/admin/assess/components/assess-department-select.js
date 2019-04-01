import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';
import {connect} from 'react-redux';

const propTypes = {
  departments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedDepartment: PropTypes.number,
  isFetching: PropTypes.bool
}

class DepartmentSelect extends Component {

  componentDidUpdate(lastProps) {
    if (lastProps.departments !== this.props.departments && this.props.departments[0]) {
      this.props.onSelect(this.props.departments[0].id)
    }
  }

  render() {
    const {selectedDepartment} = this.props;
    if (this.props.departments.length <= 0) {
      return (
        <Select
          className="margin-left-10 border"
          showSearch
          placeholder="-"
          optionFilterProp="children"
          value={'notValue'}
          disabled
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          loading={this.props.isFetching}
        >
          <Select.Option key='notValue' >Không có đơn vị</Select.Option>
        </Select>
      );
    }

    return (
      <Select
        className="margin-left-10 border re-select"
        showSearch
        // style={{ width: 300 }}
        placeholder="-"
        optionFilterProp="children"
        value={selectedDepartment !== 0 ? selectedDepartment : this.props.departments[0] ? this.props.departments[0].id : undefined}
        onChange={this.props.onSelect}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        loading={this.props.isFetching}
      >
        {this.props.departments.length > 0 && this.props.departments[0] && this.props.departments.map(dept => dept &&
          <Select.Option key={dept.id} value={dept.id}>{dept.name}</Select.Option>
        )}
      </Select>
    );
  }
}

DepartmentSelect.propTypes = propTypes;

const mapStateToProps = state => ({
  isFetching: state.haraWork.isFetching
})

export default connect(mapStateToProps, null)(DepartmentSelect);