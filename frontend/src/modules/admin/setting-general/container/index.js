import React, { Component } from 'react';

import { Button, Layout, Select, Col } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {convertToRaw, convertFromRaw, EditorState} from 'draft-js';
import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import 'moment/locale/vi';
import '../../../../App.css';

import AdminLayout from 'modules/admin/admin-layout.js';
import AdminContentHeader from 'modules/admin/admin-content-header.js';
import CustomEditor from '../../../../component/custom-editor';
import VotingDuration from '../components/voting-duration-selector';

import showNotify from '../../../../component/notify';

import { 
  GET_GENERAL_SETTING_DATA, 
  PUT_GENERAL_SETTING_DATA
} from '../../../../actions/admin/setting-general';

import {GET_ALL_SALARY_ELEMENTS} from '../../../../actions/admin/hara-work';

const format = 'HH:mm';
const Option = Select.Option;
const date = [];
for (let i = 1; i < 32; i++) {
  date.push(<Option key={i}>{i}</Option>);
}

const propTypes = {
  settings: PropTypes.object.isRequired,
  getGeneralSetting: PropTypes.func.isRequired,
  putGeneralSetting: PropTypes.func.isRequired,
  error: PropTypes.object,
  status: PropTypes.number,
  getAllSalaryElements: PropTypes.func.isRequired,
  allSalaryElements: PropTypes.arrayOf(PropTypes.object)
}

class CreateVotedContainer extends Component {

  state = {
    votingGuide: EditorState.createEmpty(),
    selectedEmployeeSalaryElements: 0,
    selectedUnitSalaryElements: 0,
    mngStartDay: moment().date(),
    mngEndDay: moment().date(),
    empStartDay: moment().date(),
    empEndDay: moment().date(),
    mngStartTime: moment(),
    mngEndTime: moment(),
    empStartTime: moment(),
    empEndTime: moment(),
    message: {}
  }

  //===================== Start Edit Area ==============================//

  handleChangeVotingGuide = value => {
    this.setState({
      votingGuide: value
    })
  }

  // handleChangeEmpVotingGuide = value => {
  //   this.setState({
  //     empVotingGuide: value
  //   })
  // }

  handleChangeMngStartDay = value => {
    this.setState({
      mngStartDay: parseInt(value)
    })
  }

  handleChangeMngEndDay = value => {
    this.setState({
      mngEndDay: parseInt(value)
    })
  }

  handleChangeMngStartTime = value => {
    this.setState({
      mngStartTime: value
    })
  }
  
  handleChangeMngEndTime = value => {
    this.setState({
      mngEndTime: value
    })
  }

  handleChangeEmpStartDay = value => {
    this.setState({
      empStartDay: parseInt(value)
    })
  }

  handleChangeEmpEndDay = value => {
    this.setState({
      empEndDay: parseInt(value)
    })
  }

  handleChangeEmpStartTime = value => {
    this.setState({
      empStartTime: value
    })
  }

  handleChangeEmpEndTime = value => {
    this.setState({
      empEndTime: value
    })
  }

  handleChangeSelectSalaryElementsEmployee = value => {
    this.setState({
      selectedEmployeeSalaryElements: value
    })
  }

  handleChangeSelectSalaryElementsUnit = value => {
    this.setState({
      selectedUnitSalaryElements: value
    })
  }

  //===================== End Edit Area ================================//
  //===================== Start Call Actions Area ======================//

  handleSaveSettings = () => {
    const {putGeneralSetting, allSalaryElements} = this.props;
    const {
      votingGuide, 
      mngStartDay, 
      mngStartTime, 
      mngEndDay, 
      mngEndTime, 
      empStartDay, 
      empStartTime, 
      empEndDay, 
      empEndTime,
      selectedEmployeeSalaryElements,
      selectedUnitSalaryElements
    } = this.state;
    const data = {
      voting_guide: JSON.stringify(convertToRaw(votingGuide.getCurrentContent())),
      employee_salary_element : {
        code: selectedEmployeeSalaryElements,
        authenticateCode: allSalaryElements.find(ase => ase.code === selectedEmployeeSalaryElements).authenticateCode
      },
      department_salary_element: {
        code: selectedUnitSalaryElements,
        authenticateCode: allSalaryElements.find(ase => ase.code === selectedUnitSalaryElements).authenticateCode
      },
      manager_voting_open_at: {
        day: mngStartDay,
        hour: mngStartTime.hour(),
        minute: mngStartTime.minute()
      },
      manager_voting_close_at: {
        day: mngEndDay,
        hour: mngEndTime.hour(),
        minute: mngEndTime.minute()
      },
      employee_voting_open_at: {
        day: empStartDay,
        hour: empStartTime.hour(),
        minute: empStartTime.minute()
      },
      employee_voting_close_at: {
        day: empEndDay,
        hour: empEndTime.hour(),
        minute: empEndTime.minute()
      }
    }

    putGeneralSetting(data);

  }

  //===================== End Call Actions Area ========================//
  //===================== Start Lifecycle Area =========================//

  componentDidMount(){
    if (this.props.allSalaryElements && this.props.allSalaryElements.length === 0) {
      this.props.getAllSalaryElements()
    }
    const {getGeneralSetting} = this.props;
    getGeneralSetting();
  }

  componentDidUpdate(lastProps){
    const {settings} = this.props;

    // load settings
    if (settings !== lastProps.settings && settings._id) {
      this.setState({
        votingGuide: settings.voting_guide.length > 0 ? EditorState.createWithContent(convertFromRaw(JSON.parse(settings.voting_guide))) : EditorState.createEmpty(),
        selectedEmployeeSalaryElements: settings.employee_salary_element.code,
        selectedUnitSalaryElements: settings.department_salary_element.code,
        mngStartDay: settings.manager_voting_open_at.day,
        mngStartTime: moment(`${settings.manager_voting_open_at.hour}:${settings.manager_voting_open_at.minute}`, format),
        mngEndDay: settings.manager_voting_close_at.day,
        mngEndTime: moment(`${settings.manager_voting_close_at.hour}:${settings.manager_voting_close_at.minute}`, format),
        empStartDay: settings.employee_voting_open_at.day,
        empStartTime: moment(`${settings.employee_voting_open_at.hour}:${settings.employee_voting_open_at.minute}`, format),
        empEndDay: settings.employee_voting_close_at.day,
        empEndTime: moment(`${settings.employee_voting_close_at.hour}:${settings.employee_voting_close_at.minute}`, format)
      })
    }

    if (this.props.allSalaryElements && this.props.allSalaryElements.length > 0 && this.state.selectedEmployeeSalaryElements === 0 && this.props.error !== null) {
      this.setState({
        selectedEmployeeSalaryElements:  this.props.allSalaryElements[0].code
      })
    }

    if (this.props.allSalaryElements && this.props.allSalaryElements.length > 0 && this.state.selectedUnitSalaryElements === 0 && this.props.error !== null) {
      this.setState({
        selectedUnitSalaryElements:  this.props.allSalaryElements[0].code
      })
    }

    // notify
    if (lastProps.error !== this.props.error && this.props.error !== null) {
      this.setState({
        message: {
          message: this.props.error.data.message,
          type: 'error'
        }
      }, () => {
        this.state.message.message.map(m => showNotify(this.state.message.type, m));
        setTimeout(() => this.setState({
          message:{},
          type: null
        }), 3000);
      })
    }
    if (lastProps.status !== this.props.status && this.props.status === 200) {
      this.setState({
        message: {
          message: 'Cập nhật thiết lập thành công.',
          type: 'suc'
        }
      }, () => {
        showNotify(this.state.message.type, this.state.message.message)
        setTimeout(() => this.setState({
          message:{},
          type: null
        }), 3000)
      })
    }


  }

  //===================== End Lifecycle Area ===========================//  
  render() {
    const {
      votingGuide,
      mngStartDay,
      mngStartTime,
      mngEndDay,
      mngEndTime,
      empStartDay,
      empStartTime,
      empEndDay,
      empEndTime,
      selectedEmployeeSalaryElements,
      selectedUnitSalaryElements
    } = this.state;

    const {
      allSalaryElements
    } = this.props;

    return (
      <AdminLayout>
        <Layout>
          <div className="app-heading">
            <AdminContentHeader text="Thiết lập chung" />
          </div>
          <div className="app-content-1">
            <div>
              <CustomEditor
                title='HƯỚNG DẪN BÌNH CHỌN'
                handleEditorStateChange={this.handleChangeVotingGuide}
                content={votingGuide}
              />
            </div>
            <Col span={9} style={{ paddingLeft: 10 }}>
              <p style={{fontWeight: 'bold'}}>THÀNH PHẦN LƯƠNG NHÂN VIÊN</p>
              <Select
                className="border"
                optionFilterProp="children"
                showSearch
                style={{width: '100%'}}
                value={selectedEmployeeSalaryElements === 0 ? 'Loading...' : selectedEmployeeSalaryElements}
                onChange={this.handleChangeSelectSalaryElementsEmployee}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {allSalaryElements && allSalaryElements.length > 0 &&
                  allSalaryElements.map(ase => (
                    <Option key={ase.id} value={ase.code}>{ase.name}</Option>
                  ))
                }
              </Select>
              <p></p>
              <p style={{fontWeight: 'bold'}}>THÀNH PHẦN LƯƠNG ĐƠN VỊ</p>
              <Select
                className="border"
                style={{width: '100%'}}
                showSearch
                optionFilterProp="children"
                onChange={this.handleChangeSelectSalaryElementsUnit}
                value={selectedUnitSalaryElements === 0 ? 'Loading...' : selectedUnitSalaryElements}
              >
                {allSalaryElements && allSalaryElements.length > 0 &&
                  allSalaryElements.map(ase => (
                    <Option key={ase.id} value={ase.code}>{ase.name}</Option>
                  ))
                }
              </Select>
            </Col>
            <div className="clear"></div>
            <div>
              <VotingDuration
                title='THỜI GIAN MỞ VÒNG BÌNH CHỌN CỦA QUẢN LÝ'
                handleChangeStartDay={this.handleChangeMngStartDay}
                handleChangeStartTime={this.handleChangeMngStartTime}
                handleChangeEndDay={this.handleChangeMngEndDay}
                handleChangeEndTime={this.handleChangeMngEndTime}
                startDay={mngStartDay}
                startTime={mngStartTime}
                endDay={mngEndDay}
                endTime={mngEndTime}
              />
            </div>
            <div>
              <VotingDuration
                title='THỜI GIAN MỞ VÒNG BÌNH CHỌN CỦA NHÂN VIÊN'
                handleChangeStartDay={this.handleChangeEmpStartDay}
                handleChangeStartTime={this.handleChangeEmpStartTime}
                handleChangeEndDay={this.handleChangeEmpEndDay}
                handleChangeEndTime={this.handleChangeEmpEndTime}
                startDay={empStartDay}
                startTime={empStartTime}
                endDay={empEndDay}
                endTime={empEndTime}
              />
            </div>
            <div className="clear"></div>
          </div>
          <div className="app-footer text-right">
            <Button className="bg-primary" type="primary" onClick={this.handleSaveSettings}>
              Lưu
            </Button>
          </div>
        </Layout>
      </AdminLayout>
    );
  }
}

CreateVotedContainer.propTypes = propTypes;

const mapStatesToProps = state => ({
  isFetching: state.generalSetting.fetching,
  settings: state.generalSetting.settings,
  error: state.generalSetting.error,
  status: state.generalSetting.status,
  allSalaryElements: state.haraWork.allSalaryElements
});

const mapDispatchToProps = dispatch => ({
  getGeneralSetting: () => dispatch({ type: GET_GENERAL_SETTING_DATA }),
  putGeneralSetting: settings => dispatch({ type: PUT_GENERAL_SETTING_DATA, settings }),
  getAllSalaryElements: () => dispatch({type: GET_ALL_SALARY_ELEMENTS})
})

export default connect(mapStatesToProps, mapDispatchToProps)(CreateVotedContainer);