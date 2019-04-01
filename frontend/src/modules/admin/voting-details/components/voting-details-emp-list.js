/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Table, Avatar, Col, Tag, Switch, LocaleProvider, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {GET_VOTING_LIMIT_DETAIL} from '../../../../actions/admin/voting-limit';
import viVN from '../../../../component/language';

const propTypes = {
  // votingData: PropTypes.object,
  isEditting: PropTypes.bool,
  employeeList: PropTypes.arrayOf(PropTypes.object),
  selectedDepartment: PropTypes.number,
  handleChangeEmpJoin: PropTypes.func.isRequired,
  votingLimit: PropTypes.object,
  getVotingLimit: PropTypes.func
};

const pointCount = (ticket, type, limit, round, empAmount) => {
  const result = [0, 0, 0];
  if (type === 'FIXED') {
    result[0] = limit[1].value * ticket.a;
    result[1] = limit[2].value * ticket.b;
    result[2] = limit[3].value * ticket.c;
  } else {
    result[0] = round(limit[1].round_method, ((limit[1].value * empAmount) / 100)) * ticket.a;
    result[1] = round(limit[2].round_method, ((limit[2].value * empAmount) / 100)) * ticket.b;
    result[2] = round(limit[3].round_method, ((limit[3].value * empAmount) / 100)) * ticket.c;
  }
  return result;
}

const round = (method, value) => {
  switch (method) {
    case 'ROUND':
      return Math.round(value)
    case 'FLOOR':
      return Math.floor(value)
    default:
      return Math.ceil(value)
  }
}

// const image = new Image;

// const imageExists = (image_url) => {

//   var http = new XMLHttpRequest();

//   http.open('HEAD', image_url, false);
//   http.send();

//   return http.status !== 404;

// }

// const checkImage = (imageSrc) => {
//   var img = new Image();
//   img.src = imageSrc;
//   return img.src === imageSrc;
// }

const text = (aTick, bTick, cTick, aPoint, bPoint, cPoint) => (
  <span>
    <p>Phiếu A: {aTick} ({aPoint} điểm)</p>
    <p>Phiếu B: {bTick} ({bPoint} điểm)</p>   
    <p>Phiếu C: {cTick} ({cPoint} điểm)</p>
  </span>
);

const compare = (a, b) => (a.employee_name > b.employee_name ? 1 : a.employee_name < b.employee_name? -1 : 0)
class EmployeesList extends Component {
  state = {
    employeeList: []
  }

  componentDidMount(){
    this.props.getVotingLimit()
  }

  columns = () => {
    const data =[{
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: '1',
      render: (name, record) => 
        <span>
          <Col span={4} style={{ width: 40 }}>
            {/* {checkImage(record.employee_photo) ?
              <Avatar src={record.employee_photo} alt="No avatar" />
              : */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            {/* {!checkImage(record.employee_photo, () => true, () => false) &&
            } */}
            {/* {imageExists(record.employee_photo) && 
            }
            {!imageExists(record.employee_photo) &&
            } */}
          </Col>
          <Col span={20}>
            <div>{record.employee_userId} - 
              <span
                onClick={() => {}}
                style={{color: '#1890ff', cursor: 'pointer'}}
              >
                &nbsp;{name}
              </span>
            </div>
            <div className="descrip">{record.employee_job_title}</div>
          </Col>
        </span>
        
    }, {
      title: 'Tổng điểm',
      dataIndex: 'point',
      className: 'text-center',
      // width:'100px',
      key: '4',
      render: (total, record) => {
        const {votingLimit, employeeList} = this.props;
        const ticket = {
          a: record.point_type[1],
          b: record.point_type[2],
          c: record.point_type[3],
        }

        if (votingLimit.exchange_mark) {
          const point = pointCount(ticket, votingLimit.exchange_mark_type, votingLimit.exchange_mark, round, employeeList.filter(e => e.join).length)
          
          return (
          <span style={{ whiteSpace: 'nowrap' }}>
          <Tooltip placement="top" title={() => text(record.point_type[1], record.point_type[2], record.point_type[3], point[0], point[1], point[2])}>
          <span>
            <Tag color="#4CD964" className='border-radius-50' key={point.reduce((a, b) => a + b, 0)}>{point.reduce((a, b) => a + b, 0)}</Tag>
          </span>
          </Tooltip>
          </span>
          )
        }


      },
    }, {
      title: 'Tham gia bình chọn',
      dataIndex: 'join',
      key: '5',
      // width: 170,
      className: 'text-center',
      render: (text, record) => (
        <span className="text-center">
          {text && !this.props.isEditting &&
            <span style={{color: '#4cd964'}}>Có</span>
          }
          {!text && !this.props.isEditting &&
            <span style={{color: '#9ca7b2'}}>Không</span>
          }
          {this.props.isEditting &&
            <Switch onChange={() => this.props.handleChangeEmpJoin(text, record.employee_id)} checked={text}/>
          }
        </span>
      ),
    }]
    return data;
  } ;

  render() {
    const {
      // votingData,
      employeeList} = this.props

    return (
      <div style={{ marginTop: '73px' }}>
      <LocaleProvider locale={viVN}>
        <Table className="border-table" size="middle" columns={this.columns()} rowKey="employee_id" dataSource={employeeList.sort(compare)} pagination={false} />
      </LocaleProvider>
      </div>
    );
  }
}

EmployeesList.propTypes = propTypes;

const mapStateToProps = state => ({
  votingData: state.votingDetails.votingData,
  votingLimit: state.votingLimit.votingLimit
})

const mapDispatchToProps = dispatch => ({
  getVotingLimit: () => dispatch({type: GET_VOTING_LIMIT_DETAIL})
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesList);