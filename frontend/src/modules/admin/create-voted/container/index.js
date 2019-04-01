/* eslint-disable react/display-name */
// Import React
import React, { Component, lazy, Suspense } from 'react';

// Import Third-party
import { Button, Table, Switch, Layout, Col, Row, Tag, Select, LocaleProvider } from 'antd';
import {Pagination} from 'haravan-react-components';
import moment from 'moment';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import config from 'config/config'
import 'moment/locale/vi';
import _ from 'lodash';
import viVN from '../../../../component/language';
import storage from 'lib/storage.js';

// Import Styles
import '../../../../App.css';
import Loading from 'modules/admin/loading.js';

import {
  GET_VOTING_DATA, 
  CHANGE_STATE_JUSTUPDATE,
  SET_VOTING_STATUS,
  PUT_SUBMIT_RESULT,
  GET_VOTING_DATA_PERIOD_BASED_PAGINATION  
} from '../../../../actions/admin/create-voted';
  import {
    GET_DEPARTMENT_UNITS,
    GET_ALL_JOBTITLES
  } from '../../../../actions/admin/hara-work';
  
  import '../../../../App.css';
  
  import showNotify from '../../../../component/notify';
  const CreateVoteModal = lazy(() => import('../components/create-vote-modal'));
  
  // moment.locale('vi');
  // Import Base Components
  const AdminLayout = lazy(() => import('modules/admin/admin-layout.js')) ;
  const AdminContentHeader = lazy(() => import('modules/admin/admin-content-header.js')); 

  // Import Components
  const CustomMonthSelector = lazy(() => import('../../../../component/customMonthSelector/customMonthSelector'));
  const SubmitResultButton = lazy(() => import('../components/submit-result-button'));

  const Option = Select.Option;
  
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const propTypes = {
  getVotingData: PropTypes.func.isRequired,
  getVotingDataPeriodBasedPagination: PropTypes.func.isRequired,
  getDepartmentUnits: PropTypes.func.isRequired,
  getAllJobTitles: PropTypes.func.isRequired,
  votingData: PropTypes.object,
  jobTitles: PropTypes.arrayOf(PropTypes.object),
  departmentUnits: PropTypes.arrayOf(PropTypes.object),
  setStatus: PropTypes.func.isRequired,
  error: PropTypes.object,
  fetching: PropTypes.bool,
  changedData: PropTypes.object,
  submitResult: PropTypes.func,
  detailsJustUpdate: PropTypes.bool,
  changeStateJustUpdate: PropTypes.func.isRequired,
  sendResultFetching: PropTypes.bool,
  setFetching: PropTypes.bool,
  sendResultError: PropTypes.object
}

// // tree select
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const treeData = [{
//   title: 'aaaaa',
//   value: '0',
//   key: '0',
  
// }, {
//   title: 'bbbb',
//   value: '1',
//   key: '1',
// }, {
//   className:'bg-tree',
//   title: 'Đã chọn 0/8 mục',
//   value: '',
//   key:''
// }
// ];
class CreateVotedContainer extends Component {

  // modal
  state = { 
    visible: false,
    votingName: '',
    votingPeriod: moment(),
    filterVotingPeriod: moment(),
    data: [],
    period: parseInt(moment().format('YYYYMM')),
    total: 0,
    page: 1,
    limit: 20,
    message: {
      message: '',
      type: null
    },
    clickChangeStatus: [],
    changedData: null
  };

  //==============================START MODAL AREA=========================// 

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleChangeVisible = (visible) => {
    this.setState({ visible });
  };

  //==============================END MODAL AREA===========================//

  //==============================START CALL ACTIONS AREA==================// 

  handleChangeStatus = (id, status) => {
    this.setState({
      clickChangeStatus: [...this.state.clickChangeStatus, id]
    })
    this.props.setStatus({id, status});
  }

  handleSubmitResult = (id) => {
    this.props.submitResult(id);
  }

  handleSelectPeriod = period => {
    // const {votingData} = this.props;
    if (period) {
      this.setState({
        period: period
      }, () => this.props.getVotingDataPeriodBasedPagination({
        period:period,
        page: this.state.page,
        limit: this.state.limit
      }));
    }
  }

  handleChangePageLimit = (current, value) => {
    this.setState({
      limit: value
    })
    if (value !== this.state.data.length) {
      this.props.getVotingDataPeriodBasedPagination({
        period: this.state.period,
        page: 1,
        limit: value
      })
    }
  }

  handleChangePage = (value) => {
    this.setState({
      page: value
    });
    
    this.props.getVotingDataPeriodBasedPagination({
      period: this.state.period,
      page: parseInt(value),
      limit: this.state.limit
    })
  }

  //==============================END CALL ACTIONS AREA====================// 
  //==============================START COMPONENT LIFECYCLE AREA===========// 

  componentDidMount(){
    // if (this.props.votingData.items && this.props.votingData.items.length > 0) {
    //   this.setState({
    //     data: this.props.votingData.items
    //   })
    // } else {
    //   this.props.getVotingData();
    // }
    if (this.props.detailsJustUpdate) {
      showNotify('suc', 'Cập nhật cuộc bình chọn thành công.');
      this.props.changeStateJustUpdate();
    }

    // if (this.props.votingData.items && this.props.votingData.items.length > 0) {
    //   this.setState({
    //     data: this.props.votingData.items
    //   })
    // }
    this.props.getVotingDataPeriodBasedPagination(
      {
        period: parseInt(moment().format('YYYYMM')),
        page: this.state.page,
        limit: this.state.limit
      })
    this.props.getDepartmentUnits();
    this.props.getAllJobTitles();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = prevState;
    if (nextProps.votingData.items && nextProps.votingData.items.length > 0) {
      state = {...state, data: nextProps.votingData.items}
    }
    if (nextProps.changedData && prevState.changedData !== nextProps.changedData) {
      state = {...state, changedData: nextProps.changedData};
      nextProps.getVotingDataPeriodBasedPagination({
        period: prevState.period,
        page: prevState.page,
        limit: prevState.limit
      })
    }
    return state
  }

  componentDidUpdate(lastProps){
 
    if (JSON.stringify(lastProps.votingData) !== JSON.stringify(this.props.votingData)) {
      // if (this.state.period !== 0) {
      //   this.props.getVotingDataPeriodBased(this.state.period)
      // }
      this.setState({
        data: this.props.votingData.items,
        total: this.props.votingData.total
      })
      
    }

    if (lastProps.fetching !== this.props.fetching && this.props.fetching === false && this.props.error === null) {
      // this.props.getVotingData();
      this.props.getDepartmentUnits();
      this.props.getAllJobTitles();
    }

    if (lastProps.changedData !== this.props.changedData) {
      if (this.props.changedData !== null && this.state.clickChangeStatus.indexOf(this.props.changedData._id) >= 0) {
        this.setState({
          clickChangeStatus: this.state.clickChangeStatus.filter(c => c !== this.props.changedData._id)
        })
      }
    }

    if (this.props.changedData !== null && lastProps.fetching && !this.props.fetching) {
      let posOld = this.state.data.indexOf(this.state.data.find(d => d._id === this.props.changedData._id));
      let newData = this.state.data.filter(d => d._id !== this.props.changedData._id);
      newData.splice(posOld, 0, this.props.changedData)
      this.setState({
        data: newData
      })
    }

    if (this.props.fetching !== lastProps.fetching && lastProps.fetching && this.props.error !== null) {
      showNotify('err', _.get(this.props.error, 'data', ''));
    }

    if (this.props.setFetching !== lastProps.setFetching && lastProps.setFetching && this.props.error === null) {
      showNotify('suc', 'Thay đổi trạng thái thành công.')
    } else if (this.props.setFetching !== lastProps.setFetching && lastProps.setFetching && this.props.error !== null) {
      showNotify('err', this.props.error.data.message[0]);
      if (this.state.clickChangeStatus.indexOf(this.props.error.data.id) > -1) {
        this.setState({
          clickChangeStatus: this.state.clickChangeStatus.filter(c => c !== this.props.error.data.id)
        })
      }
    }
  }

  //==============================START TABLE AREA=========================// 
  columns(){
    const {departmentUnits, jobTitles} = this.props
    const userInfo = storage.getData('me');
    const isManager = userInfo ? userInfo.isManager : false;

    const data = [{
      title: 'Tên cuộc bình chọn',
      className: 'min-width-150',
      dataIndex: 'name',
      key: '1',
      render: (text, record) => (<Link to={`${config.pathAdmin}/voting-details/${record._id}`}>{text}</Link>)
    }, {
      title: 'Trạng thái',
      className: 'text-center min-width-150',
      dataIndex: `${isManager? 'time_vote_manager' : 'time_vote_employee'}`,
      key: '2',
      render: (text, record) => 
        <>
          {isManager ?
            <div 
              style={
                moment(parseInt(record.time_vote_employee.to), 'x').isBefore(moment(parseInt(text.to), 'x'))
                ? moment(parseInt(text.to), 'x').isSameOrBefore(moment()) 
                  ? {color: '#4CD964'} 
                  : {color: '#FF9500'}
                : moment(parseInt(record.time_vote_employee.to), 'x').isSameOrBefore(moment()) 
                  ? {color: '#4CD964'} 
                  : {color: '#FF9500'}
              } 
            > 
              {
                moment(parseInt(record.time_vote_employee.to), 'x').isBefore(moment(parseInt(text.to), 'x'))
                ? moment(parseInt(text.to), 'x').isSameOrBefore(moment()) 
                  ? 'Hoàn thành' 
                  : 'Chưa hoàn thành'
                : moment(parseInt(record.time_vote_employee.to), 'x').isSameOrBefore(moment()) 
                  ? 'Hoàn thành' 
                  : 'Chưa hoàn thành'
              }
            </div>
            :
            <div 
              style={
                moment(parseInt(text.to), 'x').isSameOrBefore(moment()) 
                  ? {color: '#4CD964'} 
                  : {color: '#FF9500'}
              } 
            > 
              {
                moment(parseInt(text.to), 'x').isSameOrBefore(moment()) 
                  ? 'Hoàn thành' 
                  : 'Chưa hoàn thành'
              }
            </div>
          }
        </>
    }, {
      title: 'Loại đơn vị',
      className: 'min-width-350',
      dataIndex: 'department_unit',
      key: '3',
      render: (text, record) => 
        <span className="text-center">
          {record.department_unit.length === 0 &&
            'Tất cả'
          }
          {record.department_unit.length > 0 && record.department_unit.map((id, index) => {
            const departmentUnit = departmentUnits.find(d => d.id === id)
            return departmentUnit ? `${departmentUnit.name}${index === record.department_unit.length - 1 ? '' : ', '}` : ''
          })}
        </span>
    }, {
      title: 'Chức danh',
      className: 'min-width-350',
      dataIndex: 'employee_job_title',
      key: '4',
      render: (text, record) => <span className="text-center">
        {record.job_title.map((id, index) => {
            const jobTitle = jobTitles.find(d => d.id === id);
            return jobTitle ? `${jobTitle.name}${index === record.job_title.length - 1 ? '' : ', '}` : null
          })}
      </span>
    }, {
      title: 'Số lượng',
      className: 'text-center min-width-100',
      key: '5',
      dataIndex: 'amount',
      render: (text) => (
        <span>
          <Tag className='vote-a' key={text}>{text}</Tag>
        </span>
      ),
    }, {
      title: 'Thời gian bình chọn của quản lý',
      className: 'text-center min-width-280',      
      dataIndex: 'time_vote_manager',
      key: '6',
      render: (text, record) => (
        <span className="text-center">
          Từ&nbsp;
          <strong>
            {moment(record.time_vote_manager.from, 'x').format('DD/MM/YYYY HH:mm A')}
          </strong> đến&nbsp; 
          <strong>
            {moment(record.time_vote_manager.to, 'x').format('DD/MM/YYYY HH:mm A')}
          </strong>
        </span>
      )
    }, {
      title: 'Thời gian bình chọn của nhân viên',
      className: 'text-center min-width-280',
      dataIndex: 'time_vote_employee',
      key: '7',
      render: (text, record) => (
        <span className="text-center">
          Từ&nbsp;
          <strong>
            {moment(record.time_vote_employee.from, 'x').format('DD/MM/YYYY HH:mm A')}
          </strong> đến&nbsp; 
          <strong>
            {moment(record.time_vote_employee.to, 'x').format('DD/MM/YYYY HH:mm A')}
          </strong>
        </span>
      )
    }, {
      title: 'Ngày tạo',
      className: 'text-center min-width-220',
      dataIndex: 'created_at',
      key: '8',
      render: text => (
        <span className="text-render">
          {moment(text, 'x').format('DD/MM/YYYY HH:mm A')}
        </span>
      )
    }, {
      title: 'Kích hoạt',
      className: 'text-center min-width-100',
      dataIndex: 'activate',
      key: '9',
      render: (text, record) => (
        <span className="text-center">
          <Switch checked={text} onChange={() => this.handleChangeStatus(record._id, record.activate)} loading={(this.props.fetching || this.props.setFetching) && this.state.clickChangeStatus.indexOf(record._id) >= 0}/>
        </span>
      ),
    }, {
      title: 'Thao tác',
      className: 'text-center2 min-width-100',
      dataIndex: 'activate',
      fixed: 'right',
      key: '10',
      render: (text, record) => (
        <span className="text-center">
          {/* <Button type="primary" className='bg-primary' onClick={() => this.handleSubmitResult(record._id)} >Gửi kết quả</Button> */}
          <SubmitResultButton id={record._id} />
        </span>
      ),
    }];
    return data;
  }
  //==============================END TABLE AREA===========================// 

  //==============================END COMPONENT LIFECYCLE AREA=============// 

  render() {
    const {
      visible,
      data,
      total,
      limit
    } = this.state;
    return (
      <LocaleProvider locale={viVN}>
      <Suspense fallback={<Loading/>}>
        <AdminLayout>
          <Layout>
            <div className="app-heading">
              <AdminContentHeader text="Danh sách cuộc bình chọn" />
            </div>
            <div className="app-content">
              <div>
                <Row className="padding-bottom-15">
                  <Col span={12}>
                    <span className="size-12 font-weight-500">
                      KỲ BÌNH CHỌN: &nbsp;
                    </span>
                      <CustomMonthSelector handleSelectPeriod={this.handleSelectPeriod}/>
                  </Col>
                  <Col span={12} className="text-right">
                    <Button onClick={this.showModal} type="primary" className="bg-primary">
                      Tạo cuộc bình chọn
                    </Button>
                  </Col>
                </Row>
                  <Table
                    className="border-table"
                    size="middle"
                    columns={this.columns()}
                    dataSource={data}
                    rowKey='_id'
                    scroll={{ x:1500 }}
                    pagination={false}
                    bordered={true}
                  />
                  <Pagination
                    total={total}
                    defaultPageSize={limit}
                    onChange={this.handleChangePage}
                    onChangePageSize={this.handleChangePageLimit}
                    pageSizeOptions={[10, 20, 30, 40, 50]}
                  />
              </div>
              <div className="clear"></div>
            </div>
              <CreateVoteModal
                visible={visible}
                onChangeVisible={this.handleChangeVisible}
              />
          </Layout>
        </AdminLayout>
      </Suspense>
      </LocaleProvider>
    );
  }
}

CreateVotedContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  fetching: state.createVoting.fetching,
  votingData: state.createVoting.votingData,
  error: state.createVoting.error,
  jobTitles: _.get(state, 'haraWork.allJobtitles', []),
  departmentUnits: state.haraWork.departmentUnits,
  changedData: state.createVoting.changedData,
  detailsJustUpdate: state.votingDetails.justUpdated,
  sendResultFetching: state.createVoting.sendResultFetching,
  setFetching: state.createVoting.setFetching,
  sendResultError: state.createVoting.sendResultError
});

const mapDispatchToProps = dispatch => ({
  getVotingData: () => dispatch({ type: GET_VOTING_DATA }),
  getVotingDataPeriodBasedPagination: data => dispatch({ type: GET_VOTING_DATA_PERIOD_BASED_PAGINATION, data}),
  getDepartmentUnits: () => dispatch({ type: GET_DEPARTMENT_UNITS }),
  getAllJobTitles: () => dispatch({ type: GET_ALL_JOBTITLES }),
  setStatus: data => dispatch({type: SET_VOTING_STATUS, data}),
  submitResult: id => dispatch({type: PUT_SUBMIT_RESULT, id}),
  changeStateJustUpdate: () => dispatch({type: CHANGE_STATE_JUSTUPDATE})
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateVotedContainer);