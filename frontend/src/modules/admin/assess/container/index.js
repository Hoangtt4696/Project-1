import React, { Component, 
  // lazy,
  Suspense } from 'react';
import '../../../../App.css';
import AdminLayout from 'modules/admin/admin-layout.js';
import { Button, Layout, Col, Row } from 'antd';
import 'moment/locale/vi';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import moment from 'moment';
import {stateToHTML} from 'draft-js-export-html'
import {convertFromRaw} from 'draft-js';

import AssessGuide from '../components/assess-guide';
import VotingRate from '../components/assess-voting-rate';
import VotingList from '../components/assess-voting-list';
import DepartmentSelect from '../components/assess-department-select';
import CustomMonthSelector from '../../../../component/customMonthSelector/customMonthSelector';
// import AlertBox from '../../../../component/alertbox/alertbox';

import { GET_VOTING_DATA_PERIOD_BASED } from '../../../../actions/admin/create-voted';
import { GET_VOTE_POINT_DATA, POST_ASSESS_DATA, GET_ALL_VOTE_POINT_DATA }  from '../../../../actions/admin/assess';
// import { GET_ALL_DEPARTMENTS } from '../../../../actions/admin/hara-work';
import { GET_GENERAL_SETTING_DATA } from '../../../../actions/admin/setting-general';
import { GET_VOTING_LIMIT_DETAIL } from '../../../../actions/admin/voting-limit';
import Loading from 'modules/admin/loading.js';
import showNotify from '../../../../component/notify';
import storage from 'lib/storage.js';
// import _get from 'lodash/get';
// import { join } from 'redux-saga/effects';

const propTypes = {
  votingData: PropTypes.object,
  getVotingDataPeriodBased: PropTypes.func.isRequired,
  getVotePointData: PropTypes.func.isRequired,
  postVotePointData: PropTypes.func.isRequired,
  // getAllDepartment: PropTypes.func.isRequired,
  votePointData: PropTypes.object,
  votingLimit: PropTypes.object,
  // allDepartments: PropTypes.arrayOf(PropTypes.object),
  getGeneralSettingData: PropTypes.func.isRequired,
  settings: PropTypes.object,
  error: PropTypes.object,
  postFetching: PropTypes.bool,
  allVotePointData: PropTypes.arrayOf(PropTypes.object),
  getAllVotePointData: PropTypes.func.isRequired,
  haraFetching: PropTypes.bool,
  haraError: PropTypes.object,
  generalSettingFetching: PropTypes.bool,
  generalSettingError: PropTypes.object,
  limitFetching: PropTypes.bool,
  limitError: PropTypes.object,
  getVotingLimit: PropTypes.func.isRequired,
}

const calculateLimits = (numsOfEmp, limitSetting) => {
  const calculate = (method, value) => {
    if (method === 'ROUND') {
      return Math.round(value)
    }
    if (method === 'FLOOR') {
      return Math.floor(value)
    }
    return Math.ceil(value)
  }
  const a = calculate(limitSetting.voting_limit[1].round_method, (numsOfEmp * limitSetting.voting_limit[1].limit / 100));
  const b = calculate(limitSetting.voting_limit[2].round_method, (numsOfEmp * limitSetting.voting_limit[2].limit / 100));
  const c = calculate(limitSetting.voting_limit[3].round_method, (numsOfEmp * limitSetting.voting_limit[3].limit / 100));
  return  [a, b, c]
}

const validate = (aSelected, bSelected, cSelected, votingLimit, callback) => {
  let overLimit = {
    1: false,
    2: false,
    3: false
  }
  if (aSelected > votingLimit[0]) {
    overLimit[1] = true
  } else {
    overLimit[1] = false
  }
  if (!isNaN(votingLimit[1])) {
    if (bSelected > votingLimit[1]) {
      overLimit[2] = true
    } else {
      overLimit[2] = false
    }
    if (cSelected > votingLimit[2]) {
      overLimit[3] = true
    } else {
      overLimit[3] = false
    }
  }
  callback(overLimit)
}

const getVoting = (votingData, departmentId) => {
  let voting = votingData.items.find(vd => vd.department_active.indexOf(departmentId) >= 0) 
              ? JSON.parse(JSON.stringify(votingData.items.find(vd => vd.department_active.indexOf(departmentId) >= 0)))
              : votingData.items.find(vd => vd.department_active.indexOf(departmentId) >= 0);
  if (voting) {
    voting.employee_list = voting.employee_list.filter(e => e.employee_department_vote === departmentId);
  }
  return voting;
}

class AssessContainer extends Component {

  state = {
    // votingData: {},
    guide: '',
    prevProps: {
      allDepartments: [],
      votingData: {}
    },
    period: 0,
    departmentAmountOfPeriod: 0,
    department: [],
    votingData: {},
    selectedDepartment: 0,
    votePointData: {},
    aSelected: 0,
    bSelected: 0,
    cSelected: 0,
    votingLimit: [],
    overLimit: {
      1: false,
      2: false,
      3: false
    },
    isCheckedLimit: false,
    message: {
      message: '',
      type: null
    },
    isAlert: false,
    activeDepartments: [],
    preDepartments: [],
    isEditting: false,
    employeeNotVote: []
  }

//==============================START EDIT AREA===================================//

  handleChangeAssess = (last_point_level, point_level, employee_id) => {
    const {aSelected, bSelected, cSelected, votePointData, selectedDepartment, votingData, isEditting} = this.state;

    if (!(votingData.time_vote_employee && votingData.time_vote_manager && moment() > moment(JSON.parse(storage.getData('me', false)).isManager 
    ? votingData.time_vote_manager.to
    : votingData.time_vote_employee.to, 'x')) &&
    !(votingData.department_active && votingData.department_active.indexOf(selectedDepartment) < 0) && isEditting) {

      let newVotePointData = votePointData;
  
      if (newVotePointData.employee_point_list && newVotePointData.employee_point_list.find(e => e.employee_id === employee_id)) {
        newVotePointData.employee_point_list.forEach((v, index) => {
          if (v.employee_id === employee_id) {
            this.setState({
              aSelected: last_point_level !== 1 && point_level === 1 ? aSelected + 1 : last_point_level === 1 && point_level !== 1 ? aSelected - 1 : aSelected,
              bSelected: last_point_level !== 2 && point_level === 2 ? bSelected + 1 : last_point_level === 2 && point_level !== 2 ? bSelected - 1 : bSelected,
              cSelected: last_point_level !== 3 && point_level === 3 ? cSelected + 1 : last_point_level === 3 && point_level !== 3 ? cSelected - 1 : cSelected,
            })
            newVotePointData.employee_point_list[index].point_level = point_level
          }
        })
      } else if (newVotePointData.employee_point_list) {
        switch (point_level) {
          case 1:
            this.setState({
              aSelected: aSelected + 1,
            })
            break;
          case 2: 
            this.setState({
              bSelected: bSelected + 1,
            })
            break;
          default:
            this.setState({
              cSelected: cSelected + 1
            })
        }
        newVotePointData.employee_point_list.push({
          employee_id: employee_id,
          point_level: point_level
        })
      } else {
        switch (point_level) {
          case 1:
            this.setState({
              aSelected: aSelected + 1,
            })
            break;
          case 2: 
            this.setState({
              bSelected: bSelected + 1,
            })
            break;
          default:
            this.setState({
              cSelected: cSelected + 1
            })
        }
        newVotePointData = {
          vote_id : getVoting(this.props.votingData, selectedDepartment),
          department_id : selectedDepartment,
          // voter_id : JSON.parse(storage.getData('me', false)).id,
          employee_point_list : []
        }
        newVotePointData.employee_point_list.push({
          employee_id: employee_id,
          point_level: point_level
        })
      }
  
      this.setState({
        votePointData: newVotePointData
      })
    }

  }

  getDepartments = (voterId, voteList) => {
    let departmentList = [];
    // const userInfo = JSON.parse(storage.getData('me', false));

    // if (!userInfo.isManager) {
      voteList.forEach(vt => {
        if (vt.activate) {
          const employees = lodash.find(vt.employee_list, el => el.employee_id === parseInt(voterId) && el.join);
          if (employees 
              && departmentList.indexOf(
                  {
                    id: employees.employee_department_vote, 
                    name: employees.employee_department_vote_name
                  }
                ) < 0) {
            departmentList.push({id: employees.employee_department_vote, name: employees.employee_department_vote_name});
          } 
        }
      });
    // } else if (voteList) {
    //   // voteList.forEach(vt => {
    //   //   if (vt.department_active) {
    //   //     // departmentList = [...departmentList, ...vt.department_active]
          
    //   //     departmentList = [...departmentList, ...vt.department_active.filter(d => userInfo.departments_managed.indexOf(d) >= 0)];
    //   //   }
    //   // })
    //   voteList.forEach(vt => {
    //     if (vt.activate) {
    //       const departments = lodash.find(vt.employee_list, el => el.employee_id === parseInt(voterId) && el.join);
    //       if (departments 
    //           && departmentList.indexOf(departments.employee_department_vote) < 0) {
    //         departmentList.push(departments.employee_department_vote);
    //       } 
    //     }
    //   });
    // }
    return departmentList;
  }

//==============================END EDIT AREA=====================================//
//==============================START CALL ACTIONS AREA===========================//

  handleSelectPeriod = period => {
    if (period && period !== this.state.period) {
      this.setState({
        period: period
      }, () => {
        this.props.getVotingDataPeriodBased(this.state.period);
        this.setState({
          selectedDepartment: 0
        })
      });
    }
  }

  handleSelectDepartment = department => {
    this.setState({
      selectedDepartment: department
    }, () => {
      if (getVoting(this.props.votingData, department)) {
        const voteId = getVoting(this.props.votingData, department)._id;
        this.props.getVotePointData({
          vote_id: voteId,
          department_id: department,
          voter_id: parseInt(JSON.parse(storage.getData('me', false)).employee_id)
        });
        this.props.getAllVotePointData({
          vote_id: voteId,
          department_id: department
        })
      }
    })
  }

  handleClickEdit = () => {
    this.setState({
      isEditting: true
    })
  }

  handleClickSave = () => {
    const {overLimit, votePointData} = this.state;
    if (!overLimit[1] && !overLimit[2] && !overLimit[3]) {
      if (votePointData.vote_id) {
        this.props.postVotePointData({
            vote_id: votePointData.vote_id,
            department_id: votePointData.department_id,
            employee_point_list: votePointData.employee_point_list
        })
      }
    } else {
      showNotify(this.state.message.type, this.state.message.message)
    }
  }

//==============================END CALL ACTIONS AREA=============================//
//==============================START LIFECYCLE AREA==============================//

  componentDidMount(){
    if (this.props.settings && this.props.settings.updated_at) {
      this.setState({
        guide: stateToHTML(convertFromRaw(JSON.parse(this.props.settings.voting_guide)))
      })
    }
    // if (this.props.allDepartments.length === 0) {
    //   // this.props.getAllDepartment();
    // }
  }

  static getDerivedStateFromProps(props, state){
    // let department = [];
    let states = state;

    // if (props.allDepartments.length > 0 && state.activeDepartments.length > 0 && state.department.length !== state.activeDepartments.length) {
    //   department = state.activeDepartments.map(ad => {
    //       return  props.allDepartments.find(ald => ald.id === ad)
    //     })
    //   states = {...states,
    //     department: department,
    //     prevProps: {
    //       allDepartments: props.allDepartments
    //     }
    //   }
    // }

    const userInfo =  JSON.parse(storage.getData('me', false))
    const isAdmin = userInfo && userInfo.isManager && userInfo.departments_managed.indexOf(state.selectedDepartment) >= 0;
    const role = isAdmin ? 'admin' : 'notAdmin';
    // const id = userInfo.user_info.employee_id;
    if (props.allVotePointData.length > 0 && state.votingData.employee_list && role === 'admin') {
      let notVoted = [];
      state.votingData.employee_list.forEach(el => {
        if (!props.allVotePointData.find(avp => avp.voter_id === el.employee_id)) {
          notVoted.push(el.employee_id)
        }
      })
      states = {...states, employeeNotVote: notVoted}
    }

    return states
  }

  componentDidUpdate(lastProps, lastState){
    // console.log(this.props, this.state);
    const {votePointData} = this.props;
    const {overLimit, votingData, selectedDepartment, isCheckedLimit, aSelected, bSelected, cSelected, votingLimit, message} = this.state;
    const userInfo =  JSON.parse(storage.getData('me', false))
    const isAdmin = userInfo && userInfo.isManager && userInfo.departments_managed.indexOf(selectedDepartment) >= 0;
    const role = isAdmin ? 'admin' : 'notAdmin';
    const id = userInfo.employee_id;

    if (this.props.votingData !== lastProps.votingData) {
      this.props.getVotingLimit();
      this.props.getGeneralSettingData();
    }

    if (lastState.selectedDepartment !== selectedDepartment) {
      this.setState({
        votingData: getVoting(this.props.votingData, selectedDepartment) ? getVoting(this.props.votingData, selectedDepartment) : {employee_list: []},
        isCheckedLimit: false,
        aSelected: 0,
        bSelected: 0,
        cSelected: 0,
        votePointData: {}
      })
    } else if (votingData && votingData.employee_list && votingData.employee_list.find(el => el.employee_id === parseInt(id))) {
      const data = JSON.parse(JSON.stringify(this.state.votingData));
      const empList = this.state.votingData.employee_list.filter(el => el.employee_id !== parseInt(id));
      data.employee_list = empList;
      this.setState({
        votingData: data ? data : {employee_list: []},
      })
    }

    // set employee chưa vote
    if (votingData && lastState.votingData && votingData.employee_list !== lastState.votingData.employee_list && role === 'admin') {
      // console.log(this.props.allVotePointData)      
      let notVoted = [];
      votingData.employee_list.forEach(el => {
        if (!this.props.allVotePointData.find(avp => avp.voter_id === el.employee_id)) {
          notVoted.push(el.employee_id)
        }
      })

      this.setState({
        employeeNotVote: notVoted
      })
    }


    // set guide
    if (lastProps.settings !== this.props.settings && this.props.settings.updated_at) {
      this.setState({
        guide: stateToHTML(convertFromRaw(JSON.parse(this.props.settings.voting_guide)))
      })
    }

    // check limit
    if (lastState.overLimit !== overLimit && message.type !== 'success') {
      if (!overLimit[1] || !overLimit[2] || !overLimit[3]) {
        this.setState({
          message: {
            message: role === 'admin' ? 'Đánh giá vượt hạn mức quy định. Vui lòng kiểm tra lại.' : 'Bình chọn vượt hạn mức quy định. Vui lòng kiểm tra lại.',
            type: 'error'
          },
        })
      } else {
        this.setState({
          message: {
            message: '',
            type: null
          }
        })
      }
    }

    // reset khi vote point data rỗng
    if ((JSON.stringify(lastProps.votePointData) !== JSON.stringify(votePointData)) && !votePointData.created_at) {
      this.setState({
        votePointData: votePointData,
        aSelected: 0,
        bSelected: 0,
        cSelected: 0,
        isEditting: true
      })
    }

    if (!votePointData.created_at && !this.state.isEditting) {
      this.setState({
        isEditting: true
      })
    }

    // đếm số điểm đã chọn
    if (lastProps.votePointData !== votePointData && votePointData.employee_point_list && votePointData.employee_point_list.length > 0) {
      let countA = 0;
      let countB = 0;
      let countC = 0;

      votePointData.employee_point_list.filter(e => e.employee_id !== id).forEach(e => {
        switch (e.point_level) {
          case 1:
            countA += 1;
            break;
          case 2:
            countB += 1;
            break;
          case 3:
            countC += 1;
            break;
          default: 
            break;
        }
      })
      this.setState({
        votePointData: votePointData,
        aSelected: countA,
        bSelected: countB,
        cSelected: countC,
        isEditting: false
      })
    }
    
    // set department cho select box
    
    
    if (lastProps.votingData !== this.props.votingData) {
      const departments = this.getDepartments(id, this.props.votingData.items);
      if (departments.length !== this.state.activeDepartments && (!departments[0] || !departments[0].id)) {
        this.setState({
          activeDepartments: departments
        })
      }

      if (departments.length > 0 && departments[0].id) {
        this.setState({
          department:  departments,
          activeDepartments: []
        })
      } else if (departments.length === 0){
        this.setState({
          department: [],
          selectedDepartment: 0
        })
      }
    }
    
    // get limit
    if (selectedDepartment !== 0 && this.props.votingLimit.created_at && votingData && votingData._id && !isCheckedLimit) {
      this.setState({
        votingLimit: calculateLimits(getVoting(this.props.votingData, selectedDepartment).employee_list.length, this.props.votingLimit),
        isCheckedLimit: true
      })
    }

    if (JSON.stringify(lastState.votingLimit) !== JSON.stringify(this.state.votingLimit) && this.props.votingLimit.only_limit_ballot_A) {
      this.setState({
        votingLimit: [this.state.votingLimit[0], '∞', '∞']
      })
    }

    if (this.props.votingLimit !== lastProps.votingLimit) {
      this.setState({
        isCheckedLimit: false
      })
    }

    if (lastState.aSelected !== aSelected || lastState.bSelected !== bSelected || lastState.cSelected !== cSelected) {
      validate(aSelected, bSelected, cSelected, votingLimit, (over) => this.setState({
        overLimit: over
      }))
    }

    // handle lỗi
    if (lastProps.error !== this.props.error && this.props.error !== null) {
      this.setState({
        message: {
          message: this.props.error.message,
          type: 'error'
        }
      }, () => {
        this.state.message.message.map(m => showNotify(this.state.message.type, m));
        setTimeout(() => {
          this.setState({
            message: {
              message: [],
              type: null
            }
          })
        }, 3000)
      })
    }
    if (this.props.haraFetching !== lastProps.haraFetching && lastProps.haraFetching && this.props.haraError && this.props.haraError !== null) {
      showNotify('err', this.props.haraError.data.message[0])
    }
    if (this.props.limitFetching !== lastProps.limitFetching && lastProps.limitFetching && this.props.limitError.data) {
      showNotify('err', this.props.limitError.data.message[0])
    }
    if (this.props.generalSettingFetching !== lastProps.generalSettingFetching && this.props.generalSettingError !== null && this.props.generalSettingError) {
      showNotify('err', this.props.generalSettingError.data.message[0])
    }

    // handle thành công
    if (lastProps.postFetching !== this.props.postFetching && this.props.postFetching && this.props.error === null) {
      showNotify('suc', 'Lưu bình chọn thành công!')
    }
  }

//==============================END LIFECYCLE AREA================================//

  render() {
    const {
      department, 
      selectedDepartment,
      aSelected,
      bSelected,
      cSelected,
      votingData,
      guide
    } = this.state;
    // const {votingData} = this.props;
    return (
      <Suspense fallback={<Loading/>}>

        <AdminLayout>
          <Layout>
            <div>
              <Col span={12}><div className="app-heading size-22 re-header" >Đánh giá 360°</div></Col>
              <Col span={12} className="padding-top-15 padding-right-20 text-right re-header2">
                <CustomMonthSelector handleSelectPeriod={this.handleSelectPeriod}/>
                <DepartmentSelect departments={department} selectedDepartment={selectedDepartment} onSelect={this.handleSelectDepartment} />
              </Col>
            </div>
            {selectedDepartment !== 0 && this.props.votingData.items && this.props.votingData.items.length > 0 && this.state.period !== 0 &&
              <>
                <div className="app-content-1 re-app-content-1">
                  <Col  span={10} className="padding-right-10 re-content1 re-header">
                    <AssessGuide guide={guide}/>
                  </Col>
                  <Col span={14} className="padding-left-10 re-content2">
                    {votingData && votingData.time_vote_employee && votingData.time_vote_manager && moment() > moment(JSON.parse(storage.getData('me', false)).role === 'admin' 
                                                  ? votingData.time_vote_manager.to
                                                  : votingData.time_vote_employee.to, 'x') &&
                      <div className="noti-end">Cuộc bình chọn đã kết thúc</div>
                    }
                    { votingData && !(votingData.time_vote_employee && votingData.time_vote_manager && moment() > moment(JSON.parse(storage.getData('me', false)).role === 'admin' 
                                                  ? votingData.time_vote_manager.to
                                                  : votingData.time_vote_employee.to, 'x')) && 
                      votingData.department_active && votingData.department_active.indexOf(selectedDepartment) < 0 &&
                      <div className="noti-pause">Cuộc bình chọn đang tạm dừng</div>
                    }
                    <Row>
                      <Col span={12} className="re-voting-rate1">
                        <div className="padding-bottom-5 text-bold re-text3">DANH SÁCH BÌNH CHỌN</div>
                        <div className="padding-bottom-5 text-bold display-none2 re-text4">D/S BÌNH CHỌN</div>
                      </Col>
                    {selectedDepartment !== 0 && votingData && votingData.employee_list && votingData.employee_list.length > 0 && 
                      <VotingRate 
                        votingLimit={this.state.votingLimit}
                        aSelected={aSelected}
                        bSelected={bSelected}
                        cSelected={cSelected}
                        isLimitInA={this.props.votingLimit.only_limit_ballot_A}
                      />
                    }
                    </Row>
                    {selectedDepartment !== 0 && votingData && votingData.employee_list && votingData.employee_list.length > 0 && 
                      <VotingList 
                        selectedDepartment={selectedDepartment}
                        // votingDataId={getVoting(this.props.votingData, selectedDepartment) ._id}
                        isLimitInA={this.props.votingLimit.only_limit_ballot_A}
                        votingData={votingData}
                        votePointData={this.state.votePointData}
                        // votingLimit={this.state.votingLimit}
                        notVotedList={this.state.employeeNotVote}
                        votingLimit={this.state.votingLimit}
                        onChange={this.handleChangeAssess}
                        aSelected={aSelected}
                        bSelected={bSelected}
                        cSelected={cSelected}
                      />
                    }
                  </Col>
                  <div className="clear"></div>
                </div>
                <div className="app-footer text-right margin-bottom-15">
                  {this.state.votePointData.updated_at && !this.state.isEditting &&
                    <span className='descrip'>Cập nhật lần cuối {moment(this.state.votePointData.updated_at).format('DD/MM/YYYY HH:mm:ss')} </span>
                  }
                  {votingData && !(votingData.time_vote_employee && votingData.time_vote_manager && moment() > moment(JSON.parse(storage.getData('me', false)).role === 'admin' 
                                                      ? votingData.time_vote_manager.to
                                                      : votingData.time_vote_employee.to, 'x')) &&
                    !(votingData.department_active && votingData.department_active.indexOf(selectedDepartment) < 0) &&
                    <>
                      { (!this.props.votePointData._id || (this.props.votePointData._id && this.state.isEditting)) &&
                        <Button type="primary" className="bg-primary" onClick={this.handleClickSave}>Lưu</Button>
                      }
                      { this.props.votePointData._id && !this.state.isEditting &&
                        <>
                          <Button type="primary" className="bg-primary" onClick={this.handleClickEdit}>Chỉnh sửa</Button>
                        </>
                      }
                    </>
                  } 
                </div>
                <div className="app-content-1 re-app-content-2 re-content3 display-none2 ">
                  <div className="padding-right-10 ">
                      <AssessGuide guide={guide}/>
                  </div>
                </div>
              </>
            }
            {this.state.department.length === 0 && this.state.period !== 0 &&
              <div className="app-content-1">
                <Col span={24} className="text-center">
                  <img alt='avatar' style={{paddingBottom:'15px'}} src='/images/i.png'></img>
                  <p>Không có cuộc đánh giá nào được thiết lập. Vui lòng liên hệ quản lý để biết thêm thông tin.</p>
                </Col>
              </div>
            }
            {/* {this.state.isAlert &&
              <AlertBox type={this.state.message.type} message={this.state.message.message} />
            } */}
          </Layout>
        </AdminLayout>
      </Suspense>
    );
  }
}

AssessContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  votingData: state.createVoting.votingData,
  votePointData: state.assess.votePointData,
  allVotePointData: state.assess.listVotePoint,
  votingLimit: state.votingLimit.votingLimit,
  allDepartments: state.haraWork.allDepartments,
  settings: state.generalSetting.settings,
  error: state.assess.error,
  postFetching: state.assess.postFetching,
  haraFetching: state.haraWork.isFetching,
  haraError: state.haraWork.error,
  limitFetching: state.votingLimit.isFetching,
  limitError: state.votingLimit.error,
  generalSettingFetching: state.generalSetting.fetching,
  generalSettingError: state.generalSetting.error
})

const mapDispatchToProps = dispatch => ({
  getVotingDataPeriodBased: period => dispatch({type: GET_VOTING_DATA_PERIOD_BASED, period}),
  getVotePointData: query => dispatch({type: GET_VOTE_POINT_DATA, query}),
  postVotePointData: data => dispatch({ type: POST_ASSESS_DATA, data}),
  // getAllDepartment: () => dispatch({type: GET_ALL_DEPARTMENTS }),
  getGeneralSettingData: () => dispatch({type: GET_GENERAL_SETTING_DATA}),
  getAllVotePointData : query => dispatch({type: GET_ALL_VOTE_POINT_DATA, query}),
  getVotingLimit: () => dispatch({ type: GET_VOTING_LIMIT_DETAIL })   
})

export default connect(mapStateToProps, mapDispatchToProps)(AssessContainer);