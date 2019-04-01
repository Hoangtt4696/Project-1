// Import React
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Import third-party
import {Col, Input, Row, Select} from 'antd';

// Import Helpers
import { validateIsNumber } from '../../../../lib/helper';

const propTypes = {
  handleChangeSection: PropTypes.any,
  employeeVotingLimit: PropTypes.object.isRequired,
};
const defaultProps = {
  handleChangeSection: () => void(0),
};

class EmployeeVotingLimit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prevProps: {
        employeeVotingLimit: this.props.employeeVotingLimit
      },
      employee_voting_limit: this.props.employeeVotingLimit,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const prevProps = prevState.prevProps;
    const controlledValue =
        prevProps.employeeVotingLimit !== nextProps.employeeVotingLimit
            ? nextProps.employeeVotingLimit
            : prevState.employee_voting_limit;

    return {
      employee_voting_limit: controlledValue,
    };
  }

  handleChange(e) {
    const { name, value } = e.target;
    const employeeVotingLimit = this.state.employee_voting_limit;

    if (value === '' || (!validateIsNumber(value) && value > 100) || (!validateIsNumber(value) && value < 0)) {
      return null;
    }

    employeeVotingLimit[name] = Number(value);

    this.setState({
      employee_voting_limit: employeeVotingLimit,
    }, () => {
      this.props.handleChangeSection({ employee_voting_limit: this.state.employee_voting_limit });
    });
  }

  handleChangeSelect(value) {
    const { employee_voting_limit } = this.state;

    employee_voting_limit.round_method = value;

    this.setState({ employee_voting_limit }, () => {
      this.props.handleChangeSection({ employee_voting_limit: this.state.employee_voting_limit });
    });
  }

  render() {
    const { employee_voting_limit } = this.state;

    return (
        <Fragment>
          <Col className="padding-right-10" span={12}>
            <p className="font-weight-600">HẠN MỨC BÌNH CHỌN CỦA NHÂN VIÊN</p>

            <div className="bg-text">
              <Row className="padding-5">
                <Col className="padding-5" span={3} />
                <Col className="padding-5" span={6}>HẠN MỨC</Col>
                <Col className="padding-5" span={14}>CÁCH LÀM TRÒN</Col>
              </Row>
              <Row className="padding-5">
                <Col className="padding-5 line-height-36" span={3} />
                <Col className="padding-5" span={6}>
                  <Input
                      name="limit"
                      onChange={this.handleChange.bind(this)}
                      style={{ width: 100 }}
                      addonAfter={'%'}
                      value={employee_voting_limit.limit}
                  />
                </Col>
                <Col className="padding-5" span={14}>
                  <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select a person"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={this.handleChangeSelect.bind(this)}
                      value={employee_voting_limit.round_method}
                  >
                    <Select.Option value="ROUND">Làm tròn chuẩn (ROUND)</Select.Option>
                    <Select.Option value="CEIL">Làm tròn lên (CEIL)</Select.Option>
                    <Select.Option value="FLOOR">Làm tròn xuống (FLOOR)</Select.Option>
                  </Select>
                </Col>
              </Row>
            </div>
          </Col>
        </Fragment>
    );
  }
}

EmployeeVotingLimit.propTypes = propTypes;
EmployeeVotingLimit.defaultProps = defaultProps;

export default EmployeeVotingLimit;