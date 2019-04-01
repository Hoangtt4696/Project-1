// Import React, Redux
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Third-party
import { Modal, Input, Checkbox, Select, Col, Button, Row, DatePicker, LocaleProvider, Spin} from 'antd';
import _isNil from 'lodash/isNil';
// import TreeSelect from '../../../../component/tree-select/index'
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

// Import Components
import viVN from '../../../../component/language';
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';

// Import Actions
import {
  GET_ALL_DEPARTMENTS,
  GET_DEPARTMENT_UNITS,
  GET_DEPARTMENTS,
  GET_JOBTITLES,
} from '../../../../actions/admin/hara-work';
import { POST_VOTING_DATA } from '../../../../actions/admin/create-vote-modal';
import { GET_GENERAL_SETTING_DATA } from '../../../../actions/admin/setting-general';

// Import Helpers
import { validateIsNumber } from '../../../../lib/helper';
import showNotify from '../../../../component/notify';
import {GET_VOTING_DATA_PERIOD_BASED_PAGINATION} from '../../../../actions/admin/create-voted';

const RangePicker = DatePicker.RangePicker;

const Option = Select.Option;

const propTypes = {
  getDepartmentUnits: PropTypes.func,
  departmentUnits: PropTypes.array,
  getDepartments: PropTypes.func,
  departments: PropTypes.array,
  allDepartments: PropTypes.array,
  getAllDepartments: PropTypes.func,
  getJobtitles: PropTypes.func,
  getAllJobTitles: PropTypes.func,
  getVotingPeriodBasedPagination: PropTypes.func,
  jobtitles: PropTypes.array,
  allJobtitles: PropTypes.array,
  generalSetting: PropTypes.object,
  getGeneralSetting: PropTypes.func,
  handleChangeVisible: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.object,
  postVoting: PropTypes.func,
  joinedUnitType: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })
  ),
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onChangeVisible: PropTypes.func,
};

class CreateVoteModal extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {

      vote: {
        name: '',
        department_unit: null,
        department: null,
        job_title: null,
        department_detail: null,
        contract_condition: 0,
        number_of_contract_days: null,
        time_vote_manager: {
          from: null,
          to: null,
        },
        time_vote_employee: {
          from: null,
          to: null,
        },
        year_month_vote: Number(moment().format('YYYYMM')),
      },
      visible: this.props.visible,
      isFetching: false,
      error: {},
      isSave: false,
      departments: this.props.departments || [],
      departmentUnits: this.props.departmentUnits || [],
      allDepartments: this.props.allDepartments || [],
      jobtitles: [],
      allJobtitles: this.props.allJobtitles || [],
      generalSetting: {},
      page: 1,
      limit: 20,
    };
  }

  componentDidUpdate() {
    if (this.state.isSave) {
      if (!this.state.isFetching && _isEmpty(this.state.error)) {
        showNotify('suc', 'Hệ thống đang xử lý. Tiến trình sẽ mất vài phút để hoàn tất. Vui lòng kiểm tra email để cập nhật kết quả xử lý.');

        this.setState({
          isSave: false,
        }, () => {
          this.handleCancel();
          this.props.getVotingPeriodBasedPagination({
            period: parseInt(moment().format('YYYYMM')),
            page: this.state.page,
            limit: this.state.limit,
          });
        });
      } else if (!this.state.isFetching && !_isEmpty(this.state.error)) {
        _get(this.state.error, 'data.message', ['Có lỗi xảy ra']).forEach(mes => {
          showNotify('err', mes);
        });

        this.setState({
          visible: true,
          isSave: false,
        }, () => {
          this.props.onChangeVisible(true);
        });
      }
    }
  }

  componentDidMount() {
    this.props.getAllDepartments();
    this.props.getGeneralSetting();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};

    if (nextProps.page) {
      newState.page = nextProps.page;
    }

    if (nextProps.limit) {
      newState.limit = nextProps.limit;
    }

    if (nextProps.isFetching !== undefined) {
      newState.isFetching = nextProps.isFetching;
    }

    if (nextProps.allDepartments) {
      newState.allDepartments = nextProps.allDepartments;
    }

    if (nextProps.allJobtitles) {
      newState.allJobtitles = nextProps.allJobtitles;
    }

    if (nextProps.error) {
      newState.error = nextProps.error;
    }

    if (nextProps.departmentUnits) {
      newState.departmentUnits = nextProps.departmentUnits;
    }

    if (nextProps.departments) {
      newState.departments = nextProps.departments;
    }

    if (nextProps.jobtitles) {
      newState.jobtitles = nextProps.jobtitles;
    }

    if (nextProps.visible) {
      newState.visible = nextProps.visible;
    }

    if (nextProps.generalSetting && _isEmpty(this.state.generalSetting)) {
      newState.generalSetting = nextProps.generalSetting;

      const timeManagerOpen = _get(nextProps, 'generalSetting.manager_voting_open_at', {});
      const timeEmployeeOpen = _get(nextProps, 'generalSetting.employee_voting_open_at', {});
      const timeManagerClose = _get(nextProps, 'generalSetting.manager_voting_close_at', {});
      const timeEmployeeClose = _get(nextProps, 'generalSetting.employee_voting_close_at', {});

      newState.vote = _cloneDeep(this.state.vote);

      newState.vote.time_vote_manager = {
        from:
          !_isNil(timeManagerOpen.day) && !_isNil(timeManagerOpen.hour) && !_isNil(timeManagerOpen.minute)
            ? moment().date(timeManagerOpen.day).hour(timeManagerOpen.hour).minute(timeManagerOpen.minute).valueOf()
            : null,
        to:
          !_isNil(timeManagerClose.day) && !_isNil(timeManagerClose.hour) && !_isNil(timeManagerClose.minute)
            ? moment().date(timeManagerClose.day).hour(timeManagerClose.hour).minute(timeManagerClose.minute).valueOf()
            : null,
      };
      newState.vote.time_vote_employee = {
        from:
          !_isNil(timeEmployeeOpen.day) && !_isNil(timeEmployeeOpen.hour) && !_isNil(timeEmployeeOpen.minute)
            ? moment().date(timeEmployeeOpen.day).hour(timeEmployeeOpen.hour).minute(timeEmployeeOpen.minute).valueOf()
            : null,
        to:
          !_isNil(timeEmployeeClose.day) && !_isNil(timeEmployeeClose.hour) && !_isNil(timeEmployeeClose.minute)
            ? moment().date(timeEmployeeClose.day).hour(timeEmployeeClose.hour).minute(timeEmployeeClose.minute).valueOf()
            : null,
      };
    } else {
      newState.vote = this.state.vote;
    }

    this.setState({ ...newState });
  }

  handleChangeSelect(name, value) {
    const vote = Object.assign({}, this.state.vote);

    if (name === 'contract_condition') {
      vote[name] = value;
    } else {
      let id = value.map((x) => {
        return x.id
      });

      if (name === 'department') {
        vote['department_detail'] = value.map((x) => {
          return {
            id: x.id,
            name: x.name,
          };
        });
      }

      vote[name] = [...id];
    }

    vote.department = name === 'department_unit' ? [] : vote.department;
    vote.job_title = (name === 'department_unit' || name === 'department') ? [] : vote.job_title;

    this.setState({
      vote,
      isSave: false,
    });
  }

  handleChangeYearMonthVote(name, value) {
    const vote = Object.assign({}, this.state.vote);

    if (validateIsNumber(value)) {
      vote[name] = Number(value);
    }

    this.setState({ vote, isSave: false, });
  }

  handleChangeInput(e) {
    const vote = Object.assign({}, this.state.vote);
    const { value, name } = e.target;

    if (name === 'number_of_contract_days') {
      if (validateIsNumber(value) && value >= 0) {
        vote[name] = Number(value);
      }

      if (value === '') {
        vote[name] = null;
      }
    } else {
      vote[name] = value;
    }

    this.setState({ vote, isSave: false, });
  }

  handleChangeDate(name, value) {
    const vote = Object.assign({}, this.state.vote);
    const fromDate = value === null ? null : value[0];
    const toDate = value === null ? null : value[1];

    vote[name] = {
      from: fromDate === null ? null : moment(fromDate).valueOf(),
      to: toDate === null ? null : moment(toDate).valueOf(),
    };

    this.setState({
      vote,
      isSave: false,
    });
  }

  handleSave() {
    const { departments, jobtitles, allDepartments, allJobtitles } = this.state;

    let vote = this.state.vote;

    vote = _cloneDeep(vote);

    if (vote.number_of_contract_days) {
      vote.number_of_contract_days = Number(vote.number_of_contract_days);
    }

    if (vote.department_unit) {
      vote.department_unit =
        _isEmpty(vote.department_unit)
          ? null
          : (
            vote.department_unit.includes('all')
              ? []
              : vote.department_unit
          );
    }

    if (vote.department) {
      if (_isEmpty(vote.department)) {
        vote.department = null;
      } else if (vote.department.includes('all')) {
        if (vote.department_unit.includes('all')) {
          vote.department = [];

          allDepartments.forEach(dept => {
            if (dept.id) {
              vote.department.push(dept.id);
            }
          })
        } else {
          vote.department = [];

          departments.forEach(dept => {
            if (dept.id) {
              vote.department.push(dept.id);
            }
          })
        }
      }
    }

    if (vote.job_title) {
      if (_isEmpty(vote.job_title)) {
        vote.job_title = null;
      } else if (vote.job_title.includes('all')) {
        if (vote.department.includes('all') && vote.department_unit.includes('all')) {
          vote.job_title = [];

          allJobtitles.forEach(job => {
            if (job.id) {
              vote.department.push(job.id);
            }
          })
        } else {
          vote.job_title = [];

          jobtitles.forEach(job => {
            if (job.id) {
              vote.job_title.push(job.id);
            }
          })
        }
      }
    }

    this.props.postVoting(vote);

    this.setState({
      isSave: true,
    });
  }

  handleChangeVisible(visible) {
    this.setState({
      visible,
      isSave: false,
    }, () => {
      this.props.onChangeVisible(visible);
    });
  }

  handleCancel() {
    const timeManagerOpen = _get(this.state, 'generalSetting.manager_voting_open_at', {});
    const timeEmployeeOpen = _get(this.state, 'generalSetting.employee_voting_open_at', {});
    const timeManagerClose = _get(this.state, 'generalSetting.employee_voting_close_at', {});
    const timeEmployeeClose = _get(this.state, 'generalSetting.employee_voting_close_at', {});

    const timeManager = {
      from:
          !_isNil(timeManagerOpen.day) && !_isNil(timeManagerOpen.hour) && !_isNil(timeManagerOpen.minute)
              ? moment().date(timeManagerOpen.day).hour(timeManagerOpen.hour).minute(timeManagerOpen.minute).valueOf()
              : null,
              to:
          !_isNil(timeManagerClose.day) && !_isNil(timeManagerClose.hour) && !_isNil(timeManagerClose.minute)
          ? moment().date(timeManagerClose.day).hour(timeManagerClose.hour).minute(timeManagerClose.minute).valueOf()
          : null,
    };
    const timeEmp = {
      from:
          !_isNil(timeEmployeeOpen.day) && !_isNil(timeEmployeeOpen.hour) && !_isNil(timeEmployeeOpen.minute)
              ? moment().date(timeEmployeeOpen.day).hour(timeEmployeeOpen.hour).minute(timeEmployeeOpen.minute).valueOf()
              : null,
      to:
          !_isNil(timeEmployeeClose.day) && !_isNil(timeEmployeeClose.hour) && !_isNil(timeEmployeeClose.minute)
          ? moment().date(timeEmployeeClose.day).hour(timeEmployeeClose.hour).minute(timeEmployeeClose.minute).valueOf()
          : null,
    };

    this.handleChangeDate('time_vote_manager', timeManager.from, timeManager.to);
    this.handleChangeDate('time_vote_employee', timeEmp.from, timeEmp.to);

    this.setState({
      vote: {
        name: '',
        department_unit: [],
        department: [],
        job_title: [],
        contract_condition: 0,
        number_of_contract_days: null,
        year_month_vote: Number(moment().format('YYYYMM')),
        time_vote_manager: {
          from: timeManager.from,
          to: timeManager.to,
        },
        time_vote_employee: {
          from: timeEmp.from,
          to: timeEmp.to,
        },
      },
      visible: false,
      isSave: false,
    }, () => {
      this.props.onChangeVisible(false);
    });
  }

  handleLoading(name) {
    const { vote } = this.state;

    vote.department_unit = vote.department_unit === null ? [] : vote.department_unit;
    vote.department = vote.department === null ? [] : vote.department;

    if (name === 'departmentUnits') {
      this.props.getDepartmentUnits();
    }

    if (name === 'departments') {
      if (_get(vote, 'department_unit', []).includes('all')) {
        this.setState({
          departments: _cloneDeep(this.state.allDepartments),
        });
      } else {
        this.props.getDepartments(_get(vote, 'department_unit', []), true);
      }
    }

    if (name === 'jobtitles') {
      if (_get(vote, 'department', []).includes('all')) {
        this.setState({
          jobtitles: _cloneDeep(this.state.allJobtitles),
        });
      } else {
        this.props.getJobtitles(_get(vote, 'department', []), true);
      }
    }
  }

  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  
  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'day').endOf('day');
  }

  renderChildren(options, name) {
    if (_isEmpty(options)
        && ((name === 'departments' && !_isEmpty(_get(this.state, 'vote.department_unit')))
        || (name === 'jobtitles' && !_isEmpty(_get(this.state, 'vote.department'))))
    ) {
      return [{
        id: 'loading',
        name: 'Đang tải...',
      }];
    }

    return options.filter((option, index, self) => (
        index === self.findIndex(ind => (
            ind.id === option.id
        ))
    ));
  }

  returnValue(optArr, valueArr) {
    let arr = [];

    if (valueArr !== null) {
      valueArr.forEach(item => {
        const isMatch = optArr.find(elm => (elm.id === item));

        if (isMatch) {
          arr.push(isMatch);
        }
      })
    }

    return arr;
  }
  

  render() {
    const { vote, departments, departmentUnits, jobtitles, visible, isFetching } = this.state;
    const optDeptUnits = this.renderChildren(departmentUnits, 'departmentUnits');
    const optDepts = this.renderChildren(departments, 'departments');
    const optJobtitles = this.renderChildren(jobtitles, 'jobtitles');

    return (
      <LocaleProvider locale={viVN}>
      <Modal
        visible={visible}
        title="TẠO CUỘC BÌNH CHỌN MỚI"
        onOk={this.handleChangeVisible.bind(this, true)}
        onCancel={this.handleChangeVisible.bind(this, false)}
        footer={[
          <Button key="back" onClick={this.handleCancel.bind(this)}>Hủy</Button>,
          <Button  className="btn-create" key="submit" type="primary" onClick={this.handleSave.bind(this)} loading={isFetching}>
            Tạo
          </Button>,
        ]}
      >
        <div>
          <p className="font-weight-500" style={{ marginBottom: '5px' }}>TÊN DANH SÁCH *</p>
          <Input
            name="name"
            onChange={this.handleChangeInput.bind(this)}
            value={vote.name}
          />
        </div>
        <div>
          <p className="margin-bottom-5 font-weight-500">KỲ BÌNH CHỌN *</p>
          <Select
            className= "border"
            value={vote.year_month_vote}
            style={{ width: '100%' }}
            onChange={this.handleChangeYearMonthVote.bind(this, 'year_month_vote')}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value={Number(moment().format('YYYYMM'))}>Tháng {moment().format('MM/YYYY')}</Option>
            <Option value={Number(moment().subtract(1, 'month').format('YYYYMM'))}>
              Tháng {moment().subtract(1, 'months').format('MM/YYYY')}
            </Option>
          </Select>
        </div>

        <div className="container">
          <div className="row">
            <div className="col">
            <p className="margin-bottom-5 font-weight-500">LOẠI ĐƠN VỊ THAM GIA *</p>
              <Picky
                value={this.returnValue(optDeptUnits, vote.department_unit)}
                placeholder="Vui lòng chọn"
                filterPlaceholder="Tìm kiếm"
                options={optDeptUnits}
                onChange={this.handleChangeSelect.bind(this, 'department_unit')}
                onOpen={this.handleLoading.bind(this, 'departmentUnits')}
                open={false}
                valueKey="id"
                labelKey="name"
                multiple={true}
                manySelectedPlaceholder="%s Loại đơn vị"
                allSelectedPlaceholder="Tất cả"
                includeSelectAll={true}
                includeFilter={true}
                dropdownHeight={600}
                renderSelectAll={({ filtered, tabIndex, allSelected, toggleSelectAll, multiple }) => {
                  if (multiple && !filtered) {
                    if (optDeptUnits.length === this.returnValue(optDeptUnits, vote.department_unit).length){
                      allSelected = true
                    } else {
                      allSelected = false
                    }
                    return (
                      <div
                      style={{outline: 'transparent!important'}}
                        tabIndex={tabIndex}
                        role="presentation"
                        // role="option"
                        className={allSelected ? 'option selected' : 'option'}
                        onClick={toggleSelectAll}
                        onKeyPress={toggleSelectAll}
                      >
                        <li className="fixed" >
                          <Col span={12}>
                            <Checkbox type="checkbox" checked={allSelected} readOnly />
                            <span className="inline">Chọn tất cả</span>
                          </Col>
                          <Col span={12}  className="inline text-right">
                            <span>{vote.department_unit === null
                                ? `Đã chọn 0/${optDeptUnits.length}`
                                : `Đã chọn ${vote.department_unit.length}/${optDeptUnits.length}`}</span>
                          </Col>
                        </li>
                      </div>
                    );
                  }
                }}
                render={({
                 style,
                 isSelected,
                 item,
                 selectValue,
                 labelKey,
                 valueKey,
                 multiple,
                }) => {
                  if (item[valueKey] === 'loading') {
                    return (
                      <li
                          className={'selected margin-tree-select'}
                          key={item[valueKey]}
                      >
                        <span><Spin />&nbsp;{item[labelKey]}</span>
                      </li>
                    );
                  } else {
                    return (
                        <li
                            className={isSelected ? 'selected margin-tree-select' : 'margin-tree-select'}
                            key={item[valueKey]}
                            onClick={() => selectValue(item)}
                        >
                          <Checkbox type="checkbox" checked={isSelected} readOnly />
                          <span>{item[labelKey]}</span>
                        </li>
                    );
                  }

                }}
              />
            </div>

          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col">
            <p className="margin-bottom-5 font-weight-500">ĐƠN VỊ *</p>
              <Picky
                value={this.returnValue(optDepts, vote.department)}
                placeholder="Vui lòng chọn"
                filterPlaceholder="Tìm kiếm"
                options={optDepts}
                onChange={this.handleChangeSelect.bind(this, 'department')}
                onOpen={this.handleLoading.bind(this, 'departments')}
                open={false}
                valueKey="id"
                labelKey="name"
                multiple={true}
                includeSelectAll={true}
                includeFilter={true}
                manySelectedPlaceholder="%s Đơn vị"
                allSelectedPlaceholder="Tất cả"
                dropdownHeight={600}
                renderSelectAll={({ filtered, tabIndex, allSelected, toggleSelectAll, multiple }) => {
                  if (multiple && !filtered) {
                    if (optDepts.length === this.returnValue(optDepts, vote.department).length){
                      allSelected = true
                    } else {
                      allSelected = false
                    }
                    if (optDepts.length === 0){
                      allSelected = false
                    }
                    return (
                      <div
                      style={{outline: 'transparent!important'}}
                        tabIndex={tabIndex}
                        role="presentation"
                        // role="option"
                        className={allSelected ? 'option selected' : 'option'}
                        onClick={toggleSelectAll}
                        onKeyPress={toggleSelectAll}
                      >
                        <li className="fixed">
                          <Col span={12}>
                            <Checkbox type="checkbox" checked={allSelected} readOnly />
                            <span className="inline">Chọn tất cả</span>
                          </Col>
                          <Col span={12}  className="inline text-right">
                            <span>{vote.department === null
                                ? `Đã chọn 0/${optDepts.length}`
                                : `Đã chọn ${vote.department.length}/${optDepts.length}`}</span>
                          </Col>
                        </li>
                      </div>
                    );
                  }
                }}
                render={({
                 style,
                 isSelected,
                 item,
                 selectValue,
                 labelKey,
                 valueKey,
                 multiple,
                }) => {
                  if (item[valueKey] === 'loading') {
                    return (
                        <li
                            className={'selected margin-tree-select text-center'}
                            key={item[valueKey]}
                        >
                          <span><Spin />&nbsp;{item[labelKey]}</span>
                        </li>
                    );
                  } else {
                    return (
                        <li
                            className={isSelected ? 'selected margin-tree-select' : 'margin-tree-select'}
                            key={item[valueKey]}
                            onClick={() => selectValue(item)}
                        >
                          <Checkbox type="checkbox" checked={isSelected} readOnly />
                          <span>{item[labelKey]}</span>
                        </li>
                    );
                  }
                }}
              />
            </div>

          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col">
            <p className="margin-bottom-5 font-weight-500">CHỨC DANH THAM GIA *</p>
              <Picky
                value={this.returnValue(optJobtitles, vote.job_title)}
                placeholder="Vui lòng chọn"
                filterPlaceholder="Tìm kiếm"
                options={optJobtitles}
                onChange={this.handleChangeSelect.bind(this, 'job_title')}
                onOpen={this.handleLoading.bind(this, 'jobtitles')}
                open={false}
                valueKey="id"
                labelKey="name"
                multiple={true}
                includeSelectAll={true}
                manySelectedPlaceholder="%s Chức danh"
                allSelectedPlaceholder="Tất cả"
                includeFilter={true}
                dropdownHeight={600}
                renderSelectAll={({ filtered, tabIndex, allSelected, toggleSelectAll, multiple }) => {
                  if (multiple && !filtered) {
                    if (optJobtitles.length === this.returnValue(optJobtitles, vote.job_title).length){
                      allSelected = true
                    } else {
                      allSelected = false
                    }
                    if (optJobtitles.length === 0){
                      allSelected = false
                    }
                    return (
                      <div
                        tabIndex={tabIndex}
                        role="presentation"
                        className={allSelected ? 'option selected' : 'option'}
                        onClick={toggleSelectAll}
                        onKeyPress={toggleSelectAll}
                      >
                        <li className="fixed">
                          <Col span={12}>
                            <Checkbox type="checkbox" checked={allSelected} readOnly />
                            <span className="inline">Chọn tất cả</span>
                          </Col>
                          <Col span={12}  className="inline text-right">
                            <span>{vote.job_title === null
                                ? `Đã chọn 0/${optJobtitles.length}`
                                : `Đã chọn ${vote.job_title.length}/${optJobtitles.length}`}</span>
                          </Col>
                        </li>
                      </div>
                    );
                  }
                }}
                render={({
                 style,
                 isSelected,
                 item,
                 selectValue,
                 labelKey,
                 valueKey,
                 multiple,
                }) => {
                  if (item[valueKey] === 'loading') {
                    return (
                        <li
                            className={'selected margin-tree-select'}
                            key={item[valueKey]}
                        >
                          <span><Spin />&nbsp;{item[labelKey]}</span>
                        </li>
                    );
                  } else {
                    return (
                        <li
                            className={isSelected ? 'selected margin-tree-select' : 'margin-tree-select'}
                            key={item[valueKey]}
                            onClick={() => selectValue(item)}
                        >
                          <Checkbox type="checkbox" checked={isSelected} readOnly />
                          <span>{item[labelKey]}</span>
                        </li>
                    );
                  }
                }}
              />
            </div>

          </div>
        </div>
        <div>
          <Row>
          <p className="margin-bottom-5 font-weight-500">SỐ NGÀY LÀM VIỆC CHÍNH THỨC *</p>
          <Col span={6}>
            <Select
              className= "border"
              showSearch
              style={{ width: 100 }}
              optionFilterProp="children"
              onChange={this.handleChangeSelect.bind(this, 'contract_condition')}
              value={vote.contract_condition}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value={3}> {'>='} </Option>
              <Option value={4}> {'<='} </Option>
              <Option value={1}> {'>'} </Option>
              <Option value={2}> {'<'} </Option>
              <Option value={0}> {'='} </Option>
            </Select>
          </Col>
          <Col span={18}>
            <Input
              addonAfter={'Ngày'}
              value={vote.number_of_contract_days}
              style={{ width: 200 }}
              name='number_of_contract_days'
              onChange={this.handleChangeInput.bind(this)}
            />
          </Col>
          </Row>
        </div>
        <div>
          <p className="margin-bottom-5 font-weight-500">THỜI GIAN BÌNH CHỌN CỦA QUẢN LÝ *</p>
          <RangePicker
            disabledDate={this.disabledDate.bind(this)}
            style= {{width:'100%'}}
            ranges={{ 'Hôm nay': [moment().startOf(), moment().endOf('date')], 'Tháng này': [moment().startOf(), moment().endOf('month')] }}
            showTime={{ 
              format: 'HH:mm A' }}
            format="DD/MM/YYYY HH:mm:ss"
            onOk={this.handleChangeDate.bind(this, 'time_vote_manager')}
            onChange={this.handleChangeDate.bind(this, 'time_vote_manager')}
            value={
              [
                vote.time_vote_manager && vote.time_vote_manager.from !== null ? moment(vote.time_vote_manager.from) : null,
                vote.time_vote_manager && vote.time_vote_manager.from !== null ? moment(vote.time_vote_manager.to) : null
              ]
            }
          />
        </div>
        <div>
          <p className="margin-bottom-5 font-weight-500">THỜI GIAN BÌNH CHỌN CỦA NHÂN VIÊN *</p>
          <RangePicker
           disabledDate={this.disabledDate.bind(this)}
            style= {{width:'100%'}}
            ranges={{ 'Hôm nay': [moment().startOf(), moment().endOf('date')], 'Tháng này': [moment().startOf(), moment().endOf('month')] }}
            showTime={{
              format: 'HH:mm A' }}
            format="DD/MM/YYYY HH:mm:ss"
            onOk={this.handleChangeDate.bind(this, 'time_vote_employee')}
            onChange={this.handleChangeDate.bind(this, 'time_vote_employee')}
            value={[
              vote.time_vote_employee && vote.time_vote_employee.from !== null ? moment(vote.time_vote_employee.from) : null,
              vote.time_vote_employee && vote.time_vote_employee.from !== null ? moment(vote.time_vote_employee.to) : null
            ]}
          />
        </div>
      </Modal>
      </LocaleProvider>
    );
  }
}

CreateVoteModal.propTypes = propTypes;

const mapStateToProps = state => ({
  error: _get(state, 'createVotingModal.error', {}),
  isFetching: _get(state, 'createVotingModal.fetching', false),
  departments: _get(state, 'haraWork.departments', []),
  allDepartments: _get(state, 'haraWork.allDepartments', []),
  departmentUnits: _get(state, 'haraWork.departmentUnits', []),
  jobtitles: _get(state, 'haraWork.jobtitles', []),
  allJobtitles: _get(state, 'haraWork.allJobtitles', []),
  generalSetting: _get(state, 'generalSetting.settings', {}),
});

const mapDispatchToProps = dispatch => ({
  getAllDepartments: () => dispatch({ type: GET_ALL_DEPARTMENTS }),
  getDepartments: (id, isGetAll) => dispatch({ type: GET_DEPARTMENTS, id, isGetAll }),
  getDepartmentUnits: () => dispatch({ type: GET_DEPARTMENT_UNITS }),
  getJobtitles: (id, isGetAll) => dispatch({ type: GET_JOBTITLES, id, isGetAll }),
  postVoting: (voting) => dispatch({ type: POST_VOTING_DATA, voting }),
  getVotingPeriodBasedPagination: ({ period, page, limit }) =>
      dispatch({ type: GET_VOTING_DATA_PERIOD_BASED_PAGINATION, data: {period, page, limit} }),
  getGeneralSetting: () => dispatch({ type: GET_GENERAL_SETTING_DATA }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateVoteModal);