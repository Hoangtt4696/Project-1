import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Radio, Avatar, Tooltip} from 'antd';
import {connect} from 'react-redux';
import storage from 'lib/storage.js';
import _get from 'lodash/get';

const text = <span>Chưa bình chọn</span>;

const RadioGroup = Radio.Group;

const propTypes = {
  votePointData: PropTypes.object,
  votingData: PropTypes.object,
  votingDataId: PropTypes.string,
  onChange: PropTypes.func,
  aSelected: PropTypes.number,
  bSelected: PropTypes.number,
  cSelected: PropTypes.number,
  selectedDepartment: PropTypes.number,
  isLimitInA: PropTypes.bool,
  votingLimit: PropTypes.array,
  notVotedList: PropTypes.array
}

// const imageExists = (image_url) => {

//   var img = new Image();
//   img.src = image_url;
//   return img.src === image_url;

// }

const compare = (a, b) => (a.employee_name > b.employee_name ? 1 : a.employee_name < b.employee_name? -1 : 0)

class VotingList extends Component {
  state = {
    // employeeJoinedData: [],
    // votingLimit: [],
    // checkedList: [],
    currentSelected: [],
    votingData: []
  }

  componentDidMount(){
    this.setState({
      // votingData: getVoting(this.props.votingData, this.props.selectedDepartment)
      votingData: this.props.votingData
    })
  }

  componentDidUpdate(lastProps){
    const {votePointData} = this.props;
    if (JSON.stringify(lastProps.votingData) !== JSON.stringify(this.props.votingData)) {
      this.setState({
      votingData: this.props.votingData,
      currentSelected: []
      // votingData: getVoting(this.props.votingData, this.props.selectedDepartment)
      })
    }

    if (lastProps.votePointData !== votePointData) {
      this.setState({
        currentSelected: votePointData.employee_point_list
      })
    }
    // console.log(this.props, this.state);
  }

  render() {
    const {currentSelected, votingData} = this.state;
    const {notVotedList} = this.props;
    const role =
        _get(JSON.parse(storage.getData('me', false)), 'isManager')
        && JSON.parse(storage.getData('me', false)).departments_managed.indexOf(this.props.selectedDepartment) >= 0;
    return (
      <div>
        {/* <p>KẾT QUẢ BÌNH CHỌN</p> */}
        {votingData.employee_list && votingData.employee_list.length > 0 &&
          votingData.employee_list.sort(compare).map((e, index) => e.join &&
            <React.Fragment key={e.employee_userId}>
              <Row>
                <Col className="re-col" span={24}>
                    {notVotedList && notVotedList.indexOf(e.employee_id) >= 0 && role &&
                      <Tooltip 
                        placement="top" 
                        title={text} 
                        style={{display: 'none'}}
                      >
                        <Row className={notVotedList ? notVotedList.indexOf(e.employee_id) >= 0 ? 'cacl-200 list-vote-3 re-list' : 'cacl-200 list-vote-1 re-list' : 'cacl-200 list-vote-1 re-list'} style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ whiteSpace: 'nowrap' }}>
                            <span>
                              <Col span={4} className="line-height-36 re-avatar" style={{ width: 40 }}>
                                {/* <Avatar className="re-img" src={e.employee_photo} alt='avatar' /> */}
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
                              </Col>
                              <Col  className="re-col-20" span={20}>
                                <div className="re-userId">{e.employee_userId} -&nbsp; <span
                                className ="re-name"
                                onClick={() => {}}
                                style={{color: '#1890ff', cursor: 'pointer'}}
                                >
                                {e.employee_name}
                                </span></div>
                                <div className="descrip">{e.employee_job_title}</div>
                              </Col>
                            </span>
                          </div>
                        </Row>
                      </Tooltip>
                    }
                    {((notVotedList && notVotedList.indexOf(e.employee_id) < 0) || !role) &&
                      <Row className={notVotedList ? notVotedList.indexOf(e.employee_id) >= 0 ? 'cacl-200 list-vote-3 re-list' : 'cacl-200 list-vote-1 re-list' : 'cacl-200 list-vote-1 re-list'} style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ whiteSpace: 'nowrap' }}>
                          <span>
                            <Col span={4} className="line-height-36 re-avatar" style={{ width: 40 }}>
                              {/* {imageExists(e.employee_photo) && */}
                                {/* <Avatar className="re-img" src={e.employee_photo} alt='avatar' /> */}
                              {/* } */}
                              {/* {!imageExists(e.employee_photo) && */}
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
                            </Col>
                            <Col className="re-col-20" span={20}>
                              <div className="re-userId">{e.employee_userId} -&nbsp; 
                                <span
                                className ="re-name"
                                onClick={() => {}}
                                style={{color: '#1890ff', cursor: 'pointer'}}
                                >
                                  {e.employee_name}
                                </span>
                              </div>
                              <div className="descrip">{e.employee_job_title}</div>
                            </Col>
                          </span>
                        </div>
                      </Row>
                  }
                  <RadioGroup 
                    className="padding-left-8" 
                    value={currentSelected && currentSelected.length > 0 ? currentSelected.find(c => c.employee_id === e.employee_id) ? currentSelected.find(c => c.employee_id === e.employee_id).point_level : null : null}
                    style={{width:'200px'}} 
                    onChange={ev => this.props.onChange(currentSelected ? currentSelected.find(cs => cs.employee_id === e.employee_id) ? currentSelected.find(cs => cs.employee_id === e.employee_id).point_level : 0 : 0, ev.target.value, e.employee_id)}
                  >
                    <Radio className="list-vote-2 re-list-vote-2" value={1} disabled={this.props.votingLimit[0] <= this.props.aSelected}></Radio>
                    <Radio className="list-vote-2 re-list-vote-2" value={2} disabled={this.props.votingLimit[1] <= this.props.bSelected}></Radio>
                    <Radio className="list-vote-2 re-list-vote-2" value={3} disabled={this.props.votingLimit[2] <= this.props.cSelected}></Radio>
                  </RadioGroup>
                  
                </Col>
              </Row>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

VotingList.propTypes = propTypes;

const mapStateToProps = state => ({
  // votePointData: state.assess.listVotePoint[0],
  // votingData: state.createVoting.votingData.items,
  // votingLimit: state.votingLimit.votingLimit,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(VotingList);