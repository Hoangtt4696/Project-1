import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Col, Row, Icon, DatePicker, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import viVN from '../../../../component/language';

// import {InputDatetimePicker} from 'haravan-react-components';

const RangePicker = DatePicker.RangePicker;

const propTypes = {
  selectedDepartment: PropTypes.number,
  isEditting: PropTypes.bool.isRequired,
  votingData: PropTypes.object,
  handleChangeMngVotingDuration: PropTypes.func.isRequired,
  handleChangeEmpVotingDuration: PropTypes.func.isRequired,
  joinAmount: PropTypes.string
}

// const {RangePicker} = DatePicker;

class Dashboard extends Component {
  state = {
    mngVotingDuration: {
      from: moment(),
      to: moment()
    },
    empVotingDuration: {
      from: moment(),
      to: moment()
    }
  }
  
  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'day').endOf('day');
  }

  componentDidUpdate(lastProps){
    const {votingData} = this.props;
    if (lastProps.votingData.time_vote_manager !== this.props.votingData.time_vote_manager || lastProps.votingData.time_vote_employee !== this.props.votingData.time_vote_employee) {
      this.setState({
        mngVotingDuration: { from: moment(votingData.time_vote_manager.from, 'x'), to: moment(votingData.time_vote_manager.to, 'x')},
        empVotingDuration: { from: moment(votingData.time_vote_employee.from, 'x'), to: moment(votingData.time_vote_employee.to, 'x')}
      })
    }
  }

  render() {
    const {isEditting, votingData, joinAmount} = this.props;

    return (
      <LocaleProvider locale={viVN}>
        <div className="content-detail">
          <Col span={8}>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">TÊN CUỘC BÌNH CHỌN:</Col>
              <Col span={12} className="detail-value">{votingData.name}</Col>
            </Row>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">KỲ BÌNH CHỌN:</Col>
              <Col span={12} className="detail-value">Tháng {moment(votingData.year_month_vote, 'YYYYMM').format('MM/YYYY')}</Col>
            </Row>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">NGÀY TẠO DANH SÁCH:</Col>
              <Col span={12} className="detail-value">{moment(votingData.created_at, 'x').format('DD/MM/YYYY HH:mm A')}</Col>
            </Row>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">SỐ LƯỢNG THAM GIA:</Col>
              <Col span={12} className="detail-value">{joinAmount}</Col>
            </Row>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">TRẠNG THÁI:</Col>
              <Col span={12} style={{ paddingLeft:'20px' }}>
                {votingData && votingData.activate
                  ? <Icon style={{ color:'#4CD964' }} type="check-circle" theme="filled" /> 
                  : <Icon style={{ color:'#768490b5' }} type="minus-circle" theme="filled" />               
                }
                &nbsp;
                {votingData && votingData.activate ? 'Đang kích hoạt' : 'Ngưng kích hoạt'}
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">THỜI GIAN BÌNH CHỌN CỦA QUẢN LÝ:</Col>
              <Col span={12} className="detail-value">
                {!isEditting && votingData.time_vote_manager && 
                  `${moment(votingData.time_vote_manager.from, 'x').format('DD/MM/YYYY HH:mm A')} - ${moment(votingData.time_vote_manager.to, 'x').format('DD/MM/YYYY HH:mm A')}`
                }
                {isEditting && 
                <>
                  {/* <RangePicker 
                    onChange={this.props.handleChangeMngVotingDuration} 
                    defaultValue={[this.state.mngVotingDuration.from, this.state.mngVotingDuration.to]}
                    format='DD/MM/YYYY'
                    style={{ width:'100%'}} 
                  /> */}
                  <RangePicker
                    disabledDate={this.disabledDate.bind(this)}
                    style= {{width:'100%'}}
                    ranges={{ 'Hôm nay': [moment(), moment()], 'Tháng này': [moment().startOf('month'), moment().endOf('month')] }}
                    showTime={{ 
                      format: 'HH:mm A' }}
                    format="DD/MM/YYYY HH:mm:ss A"
                    onOk={this.props.handleChangeMngVotingDuration}
                    defaultValue={[this.state.mngVotingDuration.from, this.state.mngVotingDuration.to]}
                    onChange={this.props.handleChangeMngVotingDuration}
                  />
                  {/* <InputDatetimePicker 
                    singleDatePicker={false} 
                    onChange={this.props.handleChangeMngVotingDuration} 
                    placement='left' 
                    startDate={this.state.mngVotingDuration.from}
                    endDate={this.state.mngVotingDuration.to}
                    minDate={moment()}
                  /> */}
                </>
                }
              </Col>
            </Row>
            <Row className=" line-height-46">
              <Col span={12} className="detail-label">THỜI GIAN BÌNH CHỌN CỦA NHÂN VIÊN:</Col>
              <Col span={12} className="detail-value">
                {!isEditting && votingData.time_vote_employee && 
                  `${moment(votingData.time_vote_employee.from, 'x').format('DD/MM/YYYY HH:mm A')} - ${moment(votingData.time_vote_employee.to, 'x').format('DD/MM/YYYY HH:mm A')}`
                }
                {isEditting &&
                  // <RangePicker 
                  //   onChange={this.props.handleChangeEmpVotingDuration} 
                  //   defaultValue={[this.state.empVotingDuration.from, this.state.empVotingDuration.to]}
                  //   format='DD/MM/YYYY'
                  //   style={{ width:'100%'}} 
                  // />
                  <RangePicker
                    disabledDate={this.disabledDate.bind(this)}
                    style= {{width:'100%'}}
                    ranges={{ 'Hôm nay': [moment(), moment()], 'Tháng này': [moment().startOf('month'), moment().endOf('month')] }}
                    showTime={{ 
                      format: 'HH:mm A' }}
                    format="DD/MM/YYYY HH:mm:ss A"
                    onOk={this.props.handleChangeEmpVotingDuration}
                    defaultValue={[this.state.empVotingDuration.from, this.state.empVotingDuration.to]}
                    onChange={this.props.handleChangeEmpVotingDuration}
                  />
                  // <InputDatetimePicker 
                  //   style={{paddingTop:'50px'}}
                  //   singleDatePicker={false} 
                  //   onChange={this.props.handleChangeEmpVotingDuration} 
                  //   placement='left' 
                  //   startDate={this.state.empVotingDuration.from}
                  //   endDate={this.state.empVotingDuration.to}
                  //   minDate={moment()}
                  // />
                }
              </Col>
            </Row>
          </Col>
          <div className="clear"></div>
        </div>
      </LocaleProvider>
    );
  }
}

Dashboard.propTypes = propTypes;

const mapStateToProps = state => ({
  votingData: state.votingDetails.votingData
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);