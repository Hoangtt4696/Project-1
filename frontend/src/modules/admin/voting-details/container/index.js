/* eslint-disable react/display-name */
import React, { Component } from 'react';
import '../../../../App.css';
import AdminLayout from 'modules/admin/admin-layout.js';
import { Button, Layout, Col, Icon, Input} from 'antd';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import lodash from 'lodash';

import Dashboard from '../components/voting-details-dashboard';
import Header from '../components/voting-details-header';
import ConfirmModal from '../components/voting-details-modal';
import EmployeesList from '../components/voting-details-emp-list';
import AddEmps from '../components/voting-details-add-emp';

import showNotify from '../../../../component/notify';
import config from '../../../../config/config';

import {
  GET_VOTING_DETAILS, 
  PUT_VOTING_DETAILS, 
  SET_VOTING_ACTIVE,
  GET_EXPORT
} from '../../../../actions/admin/voting-details';
import {
  // GET_EMPLOYEES,
  // GET_ALL_DEPARTMENTS,
  GET_EMPLOYEES_DEPARTMENT_BASED
} from '../../../../actions/admin/hara-work';
import {CHANGE_STATE_JUSTUPDATE} from '../../../../actions/admin/create-voted';
import moment from 'moment';

const Search = Input.Search;

const propTypes = {
  votingData: PropTypes.object,
  match: PropTypes.object,
  getVotingDetails: PropTypes.func.isRequired,
  // getAllDepartments: PropTypes.func.isRequired,
  // departments: PropTypes.arrayOf(PropTypes.object),
  putVotingDetails: PropTypes.func.isRequired,
  setVotingActive: PropTypes.func.isRequired,
  putFetching: PropTypes.bool,
  putError: PropTypes.object,
  getEmpoyeesDepartmentBased: PropTypes.func.isRequired,
  // getAllEmployees: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  setFetching: PropTypes.bool,
  history: PropTypes.object,
  changeStateJustUpdate: PropTypes.func.isRequired,
  getExport: PropTypes.func.isRequired,
  exportFetching: PropTypes.bool,
  queriedDepartments: PropTypes.array,
  queryEmployeesFetching: PropTypes.bool,
  queryHaraError: PropTypes.object
};

const getDepartmentForVote = (voteDepartments) => {
  let departmentList = [];
  voteDepartments.forEach(v => {
    // const department = departments.find(d => d.id === v)
    departmentList.push({
      id: v.id,
      name: v.name
    })
  });
  return departmentList;
}

class VotingDetails extends Component {

  state = { 
    backupVotingData: {},
    isEditting: false,
    // isActive: true, 
    visible: false,
    departments: [],
    joinVoteDepartments: [],
    selectedDepartment: 0,
    orgEmployeeList: [],
    employeeList: [],
    mngVotingDuration: {
      from: moment(),
      to: moment()
    },
    empVotingDuration: {
      from: moment(),
      to: moment()
    },
    selectedAddEmpDepartment: 0,
    filterName: '',
    message: {
      message: [],
      type: null
    },
    confirmMessage: {
      message: '',
      title: '',
      type: ''
    }
  }

//=================================START EDIT AREA====================================//

  showModal = (type) => {
    const {backupVotingData, departments, selectedDepartment} = this.state;

    switch (type) {
      case 'save':
        if (backupVotingData.department && backupVotingData.department.length === 1) {
          if (this.state.orgEmployeeList !== backupVotingData.employee_list) {
            this.setState({
              visible: true,
              confirmMessage: {
                message: 'Bạn đã điều chỉnh quyền tham gia bình chọn của nhân viên. Hệ thống sẽ hủy bỏ các kết quả bình chọn và đánh giá đang có. Bạn có chắc muốn Lưu?',
                type: '1 đơn vị, thay đổi nhân viên tham gia',
                title: 'Xác nhận cập nhật thông tin cuộc bình chọn'
              }
            });
          } else {
            this.props.putVotingDetails({
              departmentVote: this.state.selectedDepartment,
              time_vote_manager: this.state.mngVotingDuration,
              time_vote_employee: this.state.empVotingDuration,
              employee_list: this.state.orgEmployeeList
            }, this.props.votingData._id)
            
            this.setState({
              isEditting: false
            });
          }
        } else if (backupVotingData.department && backupVotingData.department.length > 1) {
          if (this.state.orgEmployeeList !== backupVotingData.employee_list) {
            const department = departments.find(d => d.id === selectedDepartment).name
            this.setState({
              visible: true,
              confirmMessage: {
                message: `Bạn đã điều chỉnh thông tin cuộc bình chọn của đơn vị ${department} và quyền tham gia bình chọn của nhân viên. Hệ thống sẽ hủy bỏ các kết quả bình chọn và đánh giá đang có của đơn vị này. Bạn có chắc muốn Lưu?`,
                type: 'nhiều đơn vị, thay đổi nhân viên tham gia',
                title: 'Xác nhận cập nhật thông tin cuộc bình chọn'
              }
            });
          } else {
            this.props.putVotingDetails({
              departmentVote: this.state.selectedDepartment,
              time_vote_manager: this.state.mngVotingDuration,
              time_vote_employee: this.state.empVotingDuration,
              employee_list: this.state.orgEmployeeList
            }, this.props.votingData._id)
            
            this.setState({
              isEditting: false
            });
          }
        }
        break;
      default:
        // if (backupVotingData.department && backupVotingData.department.length === 1) {        
          if (type === 'activate') {
            this.setState({
              visible: true,
              confirmMessage: {
                message: 'Bạn có chắc muốn Kích hoạt lại cuộc bình chọn này?',
                type: 'activate',
                title: 'Xác nhận kích hoạt cuộc bình chọn'
              }
            })
          } else {
            this.setState({
              visible: true,
              confirmMessage: {
                message: `Bạn có chắc muốn Ngưng kích hoạt lại cuộc bình chọn này? 
                Đơn vị này sẽ không thể bình chọn và đánh giá nữa.`,
                type: 'deactivate',
                title: 'Xác nhận ngưng kích hoạt cuộc bình chọn'
              }
            })
          }
        // } 
    }
    
  }

  handleOk = () => {
    this.props.putVotingDetails({
      departmentVote: this.state.selectedDepartment,
      time_vote_manager: this.state.mngVotingDuration,
      time_vote_employee: this.state.empVotingDuration,
      employee_list: this.state.orgEmployeeList
    }, this.props.votingData._id)
    
    this.setState({
      visible: false,
      isEditting: false
    });
  }

  handleCancel = type => {
    if (type === 'modal'){
      this.setState({
        visible: false,
      });
    } else {
      this.setState({
        isEditting: false
      })
    }
  }

  handleClickEdit = () => {
    this.setState({
      isEditting: true
    })
  }

  handleClickDeactive = () => {
    this.setState({
      visible: false,
      // isActive: false
    })
    this.props.setVotingActive({
      departmentVote: this.state.selectedDepartment,
      activate: 'deactivate'
    }, this.props.votingData._id)
  }

  handleClickActive = () => {
    this.setState({
      visible: false,
      // isActive: true
    })
    this.props.setVotingActive({
      departmentVote: this.state.selectedDepartment,
      activate: 'activate'
    }, this.props.votingData._id)
  }

  handleChangeEmpJoin = (isJoin, id) => {
    if (this.state.isEditting) {
      this.setState({
        employeeList: this.state.employeeList.map(emp => {
          if (emp.employee_id === id) {
            emp.join = !isJoin;
          }
          return emp;
        })
      }, () => {
        const changedEmp = this.state.employeeList.find(e => e.employee_id === id);
        this.setState({
          orgEmployeeList: this.state.orgEmployeeList.map(oe => {
            if (oe.employee_id === changedEmp.employee_id) {
              return changedEmp
            }
            return oe
          })
        })
      })
    }
  }

  handleChangeMngVotingDuration = (value) => {
    // handleChangeMngVotingDuration = (start, end) => {
    this.setState({
      mngVotingDuration: {
        from: parseInt(value[0].format('x')),
        to: parseInt(value[1].format('x'))
      }
    })
  }

  handleChangeEmpVotingDuration = (value) => {
    // handleChangeEmpVotingDuration = (start, end) => {
    this.setState({
      empVotingDuration: {
        from: parseInt(value[0].format('x')),
        to: parseInt(value[1].format('x'))
      }
    })
  }

  handleChangeSearchEmp = e => {
    this.setState({
      filterName: e.target.value
    })
  }

  handleSearchEmp = () => {
    const {orgEmployeeList, selectedDepartment, filterName} = this.state;
    const empList = orgEmployeeList.filter(ev => 
      ev.employee_department_vote === selectedDepartment)
    let value = empList.filter(emp => (emp.employee_name.toLowerCase().indexOf(filterName.toLowerCase()) >= 0)
    || (emp.employee_userId.toLowerCase().indexOf(filterName.toLowerCase()) >= 0))
    this.setState({
      employeeList: value
    })
  }

  handleSelectAddEmp = value => {
    this.setState({
      orgEmployeeList: [...this.state.orgEmployeeList, value]
    })
  }

  handleRemoveAddEmp = value => {
    const newEmpList = this.state.orgEmployeeList.filter(or => or.employee_id !== value);
    this.setState({
      orgEmployeeList: newEmpList
    })
  }

//=================================END EDIT AREA======================================//
//=================================START CALL ACTIONS AREA============================//

  handleClickExport = () => {
    this.props.getExport(this.props.match.params.id)
  }

  handleChangeDepartment = e => {
    const employeeList = this.props.votingData.employee_list;
    this.setState({
      selectedDepartment: e,
      employeeList: employeeList.filter(emp => emp.employee_department_vote === e),
      selectedAddEmpDepartment: this.state.joinVoteDepartments.find(d => e === d.id)
    })
  }

  handleChangeAddEmpDepartment = e => {
    this.setState({
      selectedAddEmpDepartment:  this.state.joinVoteDepartments.find(d => e === d.id)
    })
    this.props.getEmpoyeesDepartmentBased({departmentId: e, isGetAll: true})
  }

//=================================END CALL ACTIONS AREA==============================//
//=================================START COMPONENT LIFECYCLE AREA=====================//

  componentDidMount(){
    this.props.getVotingDetails(this.props.match.params.id);
    // this.props.getAllDepartments();
    // this.props.getAllEmployees();
  }

  componentDidUpdate(lastProps, lastState){
    // console.log(this.props, this.state);
    const {votingData} = this.props;
    // set state ban đầu
    if (votingData && votingData.employee_list && votingData !== lastProps.votingData && JSON.stringify(lastProps.votingData)){
      this.setState({
        orgEmployeeList: votingData.employee_list,
        joinVoteDepartments: getDepartmentForVote(votingData.department_detail),
        backupVotingData: votingData,
        filterName: ''
      }, () => {
        const departmentsForVote = getDepartmentForVote(votingData.department_detail);
        this.props.getEmpoyeesDepartmentBased({departmentId: this.state.selectedAddEmpDepartment})
        this.setState({
          selectedDepartment: lodash.get(departmentsForVote, '0.id', 0),
          selectedAddEmpDepartment: lodash.get(departmentsForVote, '0', {}),
          employeeList: votingData.employee_list.filter(e => e.employee_department_vote === lodash.get(this.state.joinVoteDepartments, '0.id', 0))
        });
        this.handleChangeAddEmpDepartment(lodash.get(departmentsForVote, '0.id', 0));
        }
      )
    }

    if (this.props.queriedDepartments !== lastProps.queriedDepartments) {
      this.setState({
        departments: lodash.defaults(this.state.departments, this.props.queriedDepartments)
      })
    }

    // redirect cho voting có departments > 1
    if (votingData && lastProps.votingData && votingData.department && lastProps.votingData.department && votingData.department.length < lastProps.votingData.department.length && votingData.department.length > 1) {
      this.props.history.push(`${config.pathAdmin}/create-voted`)
    } else if (votingData && lastProps.votingData && JSON.stringify(votingData) !==  JSON.stringify(lastProps.votingData)) {
      this.props.changeStateJustUpdate();
    }



    if (this.props.putFetching !== lastProps.putFetching && lastProps.putError !== this.props.putError && this.props.putError !== null) {
      this.setState({
        selectedDepartment: lodash.get(this.state.joinVoteDepartments, '0.id', 0),
        orgEmployeeList: votingData.employee_list,
        employeeList: votingData.employee_list.filter(e => e.employee_department_vote === lodash.get(this.state.joinVoteDepartments, '0.id', 0)),
        message: {
          message: this.props.putError.data.message,
          type: 'err'
        }
      }, () => {
        this.state.message.message.map(m => showNotify(this.state.message.type, m));
        setTimeout(() => this.setState({
          message: {
            message: [],
            type: null
          }
        }), 3000)
      })
    }

    if (lastProps.putFetching !== this.props.putFetching && lastProps.putFetching && this.props.putError === null) {
      this.props.getVotingDetails(this.props.match.params.id);
      // this.props.getAllDepartments();
      this.setState({
        message: {
          message: ['Cập nhật cuộc bình chọn thành công.'],
          type: 'suc'
        }
      }, () => {
        this.state.message.message.map(m => showNotify(this.state.message.type, m));
        setTimeout(() => this.setState({
          message: {
            message: [],
            type: null
          }
        }))
      })
    }

    if (lastState.isEditting !== this.state.isEditting && this.state.isEditting) {
      this.setState({
        mngVotingDuration: votingData.time_vote_manager,
        empVotingDuration: votingData.time_vote_employee
      })
    }

    if (this.props.exportFetching !== lastProps.exportFetching && !this.props.exportFetching && this.props.putError === null) {
      showNotify('suc', 'Xuất dữ liệu thành công. Vui lòng kiểm tra email để nhận file.')
    } else if (this.props.exportFetching !== lastProps.exportFetching && !this.props.exportFetching && this.props.putError !== null) {
      showNotify('err', 'Có lỗi xảy ra. Vui lòng thử lại sau.')
    }

    if (this.props.setFetching !== lastProps.setFetching && !this.props.setFetching && this.props.putError !== null) {
      showNotify('err', this.props.putError.data.message[0])
    }

    if (this.props.queryEmployeesFetching !== lastProps.queryEmployeesFetching && lastProps.queryEmployeesFetching && this.props.queryHaraError !== null) {
      showNotify('err', this.props.queryHaraError.data.message[0])
    }
    // if (this.props.putFetching !== lastProps.putFetching && !this.props.putFetching && this.props.putError !== null) {
    //   this.props.putError.data.message.map(m => showNotify('err', m))
    // }
  }
//=================================END COMPONENT LIFECYCLE AREA=======================//

  render() {
    const {
      // isActive,
      visible,
      isEditting,
      // departments,
      selectedDepartment,
      employeeList,
      confirmMessage,
      joinVoteDepartments
    } = this.state;

    const {votingData} = this.props;

    return (
      <AdminLayout>
        <Layout>  
          <div className="app-heading">
            <Header 
              isActive={votingData.department_active ? votingData.department_active.indexOf(selectedDepartment) >= 0 : false}
              isEditting={isEditting}
              handleClickEdit={this.handleClickEdit}
              handleClickDeactive={() => this.showModal('deactivate')}
              // handleClickDeactive={this.handleClickDeactive}
              handleClickActive={() => this.showModal('activate')}
              // handleClickActive={this.handleClickActive}
              departments={joinVoteDepartments}
              selectedDepartment={selectedDepartment}
              onChangeSelect={this.handleChangeDepartment}
            />
          </div>

          <div className="app-content-1">
            <Dashboard 
              selectedDepartment={selectedDepartment}
              isEditting={isEditting}
              handleChangeMngVotingDuration={this.handleChangeMngVotingDuration}
              handleChangeEmpVotingDuration={this.handleChangeEmpVotingDuration}
              joinAmount={`${this.state.employeeList.filter(e => e.join).length}/${this.state.employeeList.length}`}
            />
            <div className="margin-top-20">
              <Col span={12}>
                <Button type="default" onClick={this.handleClickExport}><Icon type="download" />  Xuất dữ liệu</Button>
              </Col>
              <Col span={12} className="text-right">
              <Search
                style={{ width: 350 }}
                placeholder="Tìm theo Tên, Mã nhân viên"
                enterButton="Tìm"
                size="default"
                onSearch={this.handleSearchEmp}
                onChange={this.handleChangeSearchEmp}
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
              <div className="clear"></div>
              </Col>
            </div>
            <EmployeesList 
              isEditting={isEditting}
              employeeList={employeeList}
              handleChangeEmpJoin={this.handleChangeEmpJoin}
            />
            {isEditting &&
              <AddEmps 
                // departments={this.props.departments}
                existingDepartment={this.state.joinVoteDepartments}
                selectedDepartment={this.state.selectedAddEmpDepartment}
                selectedVoteDepartment={this.state.selectedDepartment}
                onChangeSelect={this.handleChangeAddEmpDepartment}
                handleSelectAddEmp={this.handleSelectAddEmp}
                handleRemoveAddEmp={this.handleRemoveAddEmp}
                existingEmployees={employeeList}
              />
            }
            <div className="clear"></div>
          </div>
          <div className="app-footer margin-bottom-20">
            <div className="text-right">
              {isEditting && 
                <>
                  <Button className="margin-right-15" type="default" onClick={() => this.handleCancel('cancel')}>Huỷ</Button>
                  <Button className="bg-primary" type="primary" onClick={() => this.showModal('save')}>Lưu</Button>
                </>
              }
              <ConfirmModal 
                visible={visible}
                onCancel={this.handleCancel}
                onOk={confirmMessage.type === 'activate' ? this.handleClickActive : confirmMessage.type === 'deactivate' ? this.handleClickDeactive : this.handleOk}
                message={this.state.confirmMessage.message}
                title={this.state.confirmMessage.title}
                type={this.state.confirmMessage.type}
              />
            </div>
          </div>
          </Layout>
      </AdminLayout>
    );
  }
}

VotingDetails.propTypes = propTypes;

const mapStatesToProps = state => ({
  votingData: state.votingDetails.votingData,
  // departments: state.haraWork.allDepartments,
  putFetching: state.votingDetails.putFetching,
  fetching: state.votingDetails.fetching,
  setFetching: state.votingDetails.setFetching,
  putError: state.votingDetails.error,
  exportFetching: state.votingDetails.exportFetching,
  queriedDepartments: state.haraWork.queriedDepartments,
  queryEmployeesFetching: state.haraWork.queryEmployeesFetching,
  queryHaraError: state.haraWork.error
});

const mapDispatchToProps = dispatch => ({
  getVotingDetails: id => dispatch({ type: GET_VOTING_DETAILS, id}),
  // getAllDepartments: () => dispatch({ type: GET_ALL_DEPARTMENTS }),
  putVotingDetails: (data, id) => dispatch({ type: PUT_VOTING_DETAILS, data: {data, id}}),
  setVotingActive: (data, id) => dispatch({type: SET_VOTING_ACTIVE, data: {data, id}}),
  getEmpoyeesDepartmentBased: data => dispatch({type: GET_EMPLOYEES_DEPARTMENT_BASED, data}),
  // getAllEmployees: () => dispatch({type: GET_EMPLOYEES}),
  changeStateJustUpdate: () => dispatch({type: CHANGE_STATE_JUSTUPDATE}),
  getExport: id => dispatch({ type: GET_EXPORT, id})
})
export default connect(mapStatesToProps, mapDispatchToProps)(VotingDetails);