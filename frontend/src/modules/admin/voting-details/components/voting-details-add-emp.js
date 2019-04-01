import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Col, Select, Input, Icon, AutoComplete, Tag, Avatar, Row} from 'antd';
import _ from 'lodash';

import {QUERY_DEPARTMENTS, GET_EMPLOYEES_DEPARTMENT_BASED} from '../../../../actions/admin/hara-work'
import showNotify from '../../../../component/notify';

const {Option} = Select
// const imageExists = (image_url) => {

//   var img = new Image();
//   img.src = image_url;
//   return img.src === image_url;

// }
const propTypes = {
  departments: PropTypes.arrayOf(PropTypes.object),
  selectedDepartment: PropTypes.object,
  onChangeSelect: PropTypes.func,
  employees: PropTypes.arrayOf(PropTypes.object),
  handleSelectAddEmp: PropTypes.func.isRequired,
  handleRemoveAddEmp: PropTypes.func.isRequired,
  departmentIsFetching: PropTypes.bool,
  selectedVoteDepartment: PropTypes.number,
  queryDepartments: PropTypes.func.isRequired,
  queriedDepartments: PropTypes.array,
  existingDepartment: PropTypes.array,
  employeeIsFetching: PropTypes.bool,
  getEmpoyeesDepartmentBased: PropTypes.func.isRequired,
  existingEmployees: PropTypes.arrayOf(PropTypes.object)
  // allEmployees: PropTypes.arrayOf(PropTypes.object)
};

const antIcon = <Icon type="loading" spin />;

// const arrowIcon = <Icon type="search" />;

const renderOption = employee => (
  <Option key={employee.id} text={employee.fullName}>
    <div style={{display: 'none'}}>{employee.userId}</div>
    <Row>
      <Col span={12}>
      <span style={{left: 0}}>{employee.fullName}</span>
      </Col>
      <Col span={12} className="text-right">
      <span className="global-search-item-count text-right" style={{}}>{employee.jobtitleName}</span>
      </Col>
    </Row>
  </Option>
)

const deptRenderOption = dept => (
  <Option key={dept.id} text={dept.name}>
    {/* <div style={{display: 'none'}}>{employee.userId}</div> */}
    <Row>
      <Col span={24}>
      <span style={{left: 0}}>{dept.name}</span>
      </Col>
      {/* <Col span={12} className="text-right">
      <span className="global-search-item-count text-right" style={{}}>{employee.jobtitleName}</span>
      </Col> */}
    </Row>
  </Option>
)
class AddEmps extends Component {

  state = {
    employeesList: [],
    selectedEmployees: [],
    allEmployees: [],
    departments: [],
    selectedDepartment: {}
  }

  handleEdit = e => {
    const employeeList = e === undefined ? this.props.employees : this.props.employees.filter(emp => emp.fullName.toLowerCase().indexOf(e.toLowerCase()) >= 0);
    this.setState({
      employeesList: employeeList
    })
  }

  handleEditDepartment = e => {
    const departmentList = !e || e === '' || e === null ? this.props.existingDepartment : this.state.departments;
    this.setState({
      departments: departmentList
    })

    if (!e || e === '' || e === null) {
      this.props.getEmpoyeesDepartmentBased(this.props.selectedVoteDepartment)
    }
  }

  handleOnRemove = value => {
    this.setState({
      selectedEmployees: this.state.selectedEmployees.filter(s => s !== value)
    })
    this.props.handleRemoveAddEmp(value);
  }

  handleOnSelect = value => {
    value = parseInt(value);
    if (this.props.existingEmployees.find(e => e.employee_id === value)) {
      showNotify('err', 'Nhân viên này đã tồn tại trong cuộc bình chọn. Vui lòng kiểm tra lại.')
    } else {

      if (this.state.selectedEmployees.indexOf(value) < 0){
        this.setState({
          selectedEmployees: [...this.state.selectedEmployees, value]
        })
    
        const empSelectedInfo = this.props.employees.find(emp => emp.id === value)
    
        const employee = {
          employee_department_id: empSelectedInfo.departmentId,
          employee_department_name: empSelectedInfo.departmentName,
          employee_department_vote: this.props.selectedVoteDepartment,
          employee_department_vote_name: this.state.departments.find(d => d.id === this.props.selectedVoteDepartment).name,
          employee_haraId: empSelectedInfo.haraId,
          employee_id: value,
          employee_job_title: empSelectedInfo.jobtitleName,
          employee_job_title_id: empSelectedInfo.jobtitleId,
          employee_name: empSelectedInfo.fullName,
          employee_photo: empSelectedInfo.photo,
          employee_userId: empSelectedInfo.userId,
          join: true,
          point: 0,
        }
    
        this.props.handleSelectAddEmp(employee);
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = prevState;
    if (JSON.stringify(nextProps.employees) !== JSON.stringify(prevState.allEmployees)) {
      if (prevState.allEmployees.indexOf(nextProps.employees) < 0) {
        state = {...state, allEmployees: [...state.allEmployees, ...nextProps.employees]}
      }
    }
    if (nextProps.selectedDepartment && nextProps.selectedDepartment.id && nextProps.selectedDepartment !== prevState.selectedDepartment) {
      state = {...state, selectedDepartment: nextProps.selectedDepartment}
      nextProps.queryDepartments(nextProps.selectedDepartment.name)
    }
    // if (nextProps.queriedDepartments && JSON.stringify(nextProps.queriedDepartments) !== JSON.stringify(prevState.departments)) {
    //   state = {...state, departments: nextProps.queriedDepartments}
    // }

    if (nextProps.existingDepartment && nextProps.existingDepartment.length > 0 && state.departments.length === 0) {
      state = {...state, departments: nextProps.existingDepartment}
    }

    if (nextProps.queriedDepartments && JSON.stringify(nextProps.queriedDepartments) !== JSON.stringify(prevState.departments)) {
      let oldDepartments = Object.assign([], state.departments);
      oldDepartments = [...oldDepartments, ...nextProps.queriedDepartments];

      const result = nextProps.queriedDepartments.concat(oldDepartments).filter(function(o) {  
        return this.has(o.id) ? false : this.add(o.id);
      }, new Set());

      state = {...state, departments: result}
    }

    // if (nextProps.queriedDepartments && JSON.stringify(nextProps.queriedDepartments) !== JSON.stringify(prevState.departments)) {
    //   const oldDepartment = Object.assign([], state.departments);
    //   let newDepartment = Object.assign([], nextProps.queriedDepartments)
    //   oldDepartment.forEach((d) => {
    //     newDepartment.forEach(qd => {
    //       if (d.id !== qd.id) {
    //         // state.departments.push(qd);
    //         state = {...state, departments: state.departments.push(qd)}
    //       }
    //       newDepartment = newDepartment.filter(nd => nd.id !== d.id)
    //     })
    //   })
    //   // state = {...state, departments: newDepartment}
    // }

    return state;
  }
  

  shouldComponentUpdate(nextProps){
    if (nextProps !== this.props){
      return true;
    }
    return true;
  }

  componentDidUpdate(lastProps) {
    if (lastProps.employees !== this.props.employees) {
      // console.log(this.props, this.state);
      this.setState({
        employeesList: this.props.employees
      })
    }
    // console.log(this.state)
  }

  render() {
    const {onChangeSelect} = this.props;
    const {selectedEmployees} = this.state;
    
    return (
      <div className="content-detail margin-top-20">
        <Col span={4}>
          THÊM NHÂN VIÊN
        </Col>
        <Col span={10} className="padding-l-r-20">
          {/* <Select
            className="border"
            showSearch
            style={{ width: '100%' }}
            placeholder=""
            value={selectedDepartment === 0 ? 'Loading...' : selectedDepartment.id ? selectedDepartment.id : 'Loading...'}
            onChange={onChangeSelect}
            loading={this.props.departmentIsFetching}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {departments && 
              departments.map(d => 
                <Option key={d.id} value={d.id}>{d.name}</Option>
              )
            }
          </Select> */}

          <AutoComplete
            style={{ width: '100%' }}
            dataSource={this.state.departments.map(deptRenderOption)}
            optionLabelProp='text'  
            onSelect={e => onChangeSelect(parseInt(e))}
            // onFocus={this.handleEdit}
            onChange={e => e === '' || e === null || !e ? this.handleEditDepartment(e) : this.props.queryDepartments(e)}
            filterOption={(inputValue, option) => {
              if (option.props.text.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
                return option;
              }
              return ;
            }
            }
          >
            <Input 
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={_.get(this.props.selectedDepartment, 'name', this.state.selectedDepartment.name)}
              suffix={this.props.departmentIsFetching? antIcon : null}
            ></Input>
          </AutoComplete>

        </Col>
        <Col span={10}>
        <AutoComplete
          style={{ width: '100%' }}
          dataSource={this.state.employeesList.map(renderOption)}
          optionLabelProp='text'  
          onSelect={this.handleOnSelect}
          onFocus={this.handleEdit}
          filterOption={(inputValue, option) => option.props.text.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 
                                                || option.props.children[0].props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1

          }
        >
          <Input 
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Tìm theo Tên, Mã nhân viên"  
            suffix={this.props.employeeIsFetching? antIcon : null}
          ></Input>
        </AutoComplete>
        </Col>
        <div className="clear"></div>
        {selectedEmployees.length > 0 && selectedEmployees.map(emp => {
          const employee = _.get(this.state, 'allEmployees', []).find(em => em.id === emp)
          return (
            <Tag key={employee.id} closable onClose={() => this.handleOnRemove(employee.id)} style={{width: 'auto', height: 'auto', marginTop: 8, paddingTop: 4}}>
              {/* {imageExists(employee.photo) &&
                <Avatar src={employee.photo} alt="No avatar" style={{float: 'left', paddingTop: 5, bottom: 0}}/>
              }
              {!imageExists(employee.photo) && */}
                <svg style={{float: 'left'}} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0)">
                    <path d="M12.6429 28.224L7.27212 31.1536C6.95695 31.3254 6.6737 31.5367 6.41016 31.7669C9.54148 34.4072 13.5837 36 18.0001 36C22.384 36 26.4003 34.4309 29.5228 31.8267C29.2348 31.5835 28.9224 31.3648 28.576 31.1923L22.8248 28.317C22.0817 27.9455 21.6123 27.1861 21.6123 26.3554V24.0989C21.774 23.9149 21.9588 23.6785 22.1564 23.3993C22.9403 22.2921 23.5332 21.0743 23.9442 19.7966C24.6819 19.569 25.2253 18.8878 25.2253 18.0781V15.6695C25.2253 15.1397 24.9895 14.6663 24.6234 14.3348V10.853C24.6234 10.853 25.3387 5.43463 18.0008 5.43463C10.6629 5.43463 11.3782 10.853 11.3782 10.853V14.3348C11.0114 14.6663 10.7763 15.1397 10.7763 15.6695V18.0781C10.7763 18.7125 11.1099 19.2709 11.6091 19.5935C12.2109 22.2133 13.7868 24.0989 13.7868 24.0989V26.2997C13.7861 27.1012 13.3473 27.8395 12.6429 28.224Z" fill="#E7ECED"/>
                    <path d="M18.3077 0.00274145C8.36827 -0.16707 0.172494 7.75293 0.00268219 17.6923C-0.0937706 23.328 2.41808 28.3932 6.41747 31.7615C6.67898 31.5333 6.95951 31.3241 7.27129 31.1543L12.6421 28.2247C13.3465 27.8403 13.7852 27.1019 13.7852 26.299V24.0983C13.7852 24.0983 12.2087 22.2127 11.6076 19.5929C11.109 19.2702 10.7748 18.7126 10.7748 18.0775V15.6689C10.7748 15.139 11.0105 14.6656 11.3766 14.3341V10.8523C11.3766 10.8523 10.6614 5.43399 17.9993 5.43399C25.3372 5.43399 24.6219 10.8523 24.6219 10.8523V14.3341C24.9887 14.6656 25.2237 15.139 25.2237 15.6689V18.0775C25.2237 18.8871 24.6803 19.5684 23.9427 19.7959C23.5317 21.0736 22.9388 22.2915 22.1549 23.3987C21.9573 23.6778 21.7725 23.9142 21.6108 24.0983V26.3547C21.6108 27.1855 22.0802 27.9455 22.8233 28.3164L28.5745 31.1916C28.9195 31.3642 29.2313 31.5822 29.5186 31.8247C33.3971 28.5901 35.9028 23.7539 35.9959 18.3077C36.1671 8.36833 28.2477 0.172553 18.3077 0.00274145Z" fill="#919EAB"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="36" height="36" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              {/* } */}
              <span style={{float: 'left'}}>&nbsp;&nbsp;</span>
              <span style={{float: 'left'}}>
                <div>{employee.userId} - 
                  <span
                    onClick={() => {}}
                    style={{color: '#1890ff', cursor: 'pointer'}}
                  >
                    &nbsp;{employee.fullName}
                  </span>
                </div>
                <div className="descrip">{employee.jobtitleName}</div>
              </span>
            </Tag>
          )
        })}
        <div className="clear"></div>
      </div>
    );
  }
}

AddEmps.propTypes = propTypes;

const mapStateToProps = state => ({
  employees: state.haraWork.employees,
  // allEmployees: state.haraWork.allEmployees,
  departmentIsFetching: state.haraWork.queryDeptFetching,
  queriedDepartments: state.haraWork.queriedDepartments,
  employeeIsFetching: state.haraWork.queryEmployeesFetching
})

const mapDispatchToProps = dispatch => ({
  queryDepartments: query => dispatch({type: QUERY_DEPARTMENTS, query}),
  getEmpoyeesDepartmentBased: data => dispatch({type: GET_EMPLOYEES_DEPARTMENT_BASED, data}),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEmps);