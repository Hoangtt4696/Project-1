// Import React
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// Import third-party
import {Checkbox, Col, Input, Row, Select} from 'antd';
import _get from 'lodash/get';

// Import Helpers
import { validateIsNumber } from '../../../../lib/helper';

const propType = {
  data: PropTypes.object.isRequired,
  handleChangeSection: PropTypes.func,
};
const defaultProps = {
  handleChangeSection: () => void(0),
};

class ManagerVotingLimit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      votingLimit: _get(this.props, 'data.votingLimit', {
        1 : {
          limit: 50,
          round_method: null,
        },
        2 : {
          limit: 30,
          round_method: null,
        },
        3 : {
          limit: 20,
          round_method: null,
        }
      }
      ),
      onlyA: _get(this.props, 'data.onlyA', false),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data.votingLimit) {
      this.setState({
        votingLimit: nextProps.data.votingLimit,
      });
    }
    
    if (nextProps.data.onlyA !== undefined) {
      this.setState({
        onlyA: nextProps.data.onlyA,
      });
    }
  }

  renderSelect(name) {
    const Option = Select.Option;
    const { votingLimit, onlyA } = this.state;

    let disabled = false;

    if ((name == '2' || name == '3') && onlyA) { // eslint-disable-line eqeqeq
      disabled = true;
    }

    return (
      <Select
        className="border"
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a person"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={this.handleChangeSelect.bind(this, name)}
        value={
          _get(votingLimit, `${name}.round_method`) === null || !_get(votingLimit, `${name}.round_method`)
              ? 'ROUND'
              : _get(votingLimit, `${name}.round_method`)
        }
        disabled={disabled}
      >
        <Option value="ROUND">Làm tròn chuẩn (ROUND)</Option>
        <Option value="CEIL">Làm tròn lên (CEIL)</Option>
        <Option value="FLOOR">Làm tròn xuống (FLOOR)</Option>
      </Select>
    );
  }

  renderInput(name) {
    const { votingLimit, onlyA } = this.state;

    let disabled = false;
    
    if ((name == '2' || name == '3') && onlyA) { // eslint-disable-line eqeqeq
      disabled = true;
    }

    return (
      <Input
        style={{ width: 100 }}
        addonAfter={'%'}
        name={name}
        onChange={this.handleChangeInput.bind(this)}
        value={_get(votingLimit, `${name}.limit`)}
        disabled={disabled}
      />
    );
  }

  handleChangeCheckbox(e) {
    const { name, checked } = e.target;
    const stateClone = Object.assign({}, this.state);

    stateClone[name] = checked;
    
    if (checked) {
      stateClone.votingLimit[2].limit = 'Auto';
      stateClone.votingLimit[3].limit = 'Auto';
    } else {
      if (_get(stateClone, 'votingLimit.1.limit')) {
        stateClone.votingLimit[2].limit = (100 - stateClone.votingLimit[1].limit) / 2;
        stateClone.votingLimit[3].limit = (100 - stateClone.votingLimit[1].limit) / 2;
      } else {
        stateClone.votingLimit[2].limit = null;
        stateClone.votingLimit[3].limit = null;
      }
    }

    this.setState(stateClone, () => {
      this.props.handleChangeSection({ only_limit_ballot_A: checked, voting_limit: this.state.votingLimit } );
    });
  }

  handleChangeInput(e) {
    const { name, value } = e.target;
    const votingLimit = JSON.parse(JSON.stringify(this.state.votingLimit));

    if (validateIsNumber(value) && value >= 0 && value <= 100) {
      votingLimit[name].limit = Number(value);

      if (votingLimit[1].limit
          && votingLimit[2].limit
          && (name == 1 || name == 2) // eslint-disable-line eqeqeq
          && Number(votingLimit[1].limit) + Number(votingLimit[2].limit) < 100) {
        votingLimit[3].limit = 100 - (Number(votingLimit[1].limit) + Number(votingLimit[2].limit));
      }
    }

    if (value === '') {
      votingLimit[name].limit = null;
    }

    this.setState({
      votingLimit,
    }, () => {
      this.props.handleChangeSection({ voting_limit: this.state.votingLimit } );
    });
  }

  handleChangeSelect(name, value) {
    const votingLimit = JSON.parse(JSON.stringify(this.state.votingLimit));

    votingLimit[name].round_method = value;

    this.setState({
      votingLimit,
    }, () => {
      this.props.handleChangeSection({ voting_limit: this.state.votingLimit } );
    });
  }

  render() {
    return (
        <Fragment>
          <Col className="padding-right-10" span={12}>
            <p className="font-weight-600">HẠN MỨC BÌNH CHỌN</p>
            <div className="bg-text-3">
              <Row className="padding-5">
                <Col className="padding-5" span={3} />
                <Col className="padding-5" span={6}>HẠN MỨC</Col>
                <Col className="padding-5" span={14}>CÁCH LÀM TRÒN</Col>
              </Row>
              <Row className="padding-5">
                <Col className="padding-5 line-height-36" span={3}>PHIẾU A</Col>
                <Col className="padding-5" span={6}>
                  {this.renderInput(1)}
                </Col>
                <Col className="padding-5" span={14}>
                  {this.renderSelect(1)}
                </Col>
              </Row>
              <Row className="padding-5">
                <Col className="padding-5 line-height-36" span={3}>PHIẾU B</Col>
                <Col className="padding-5" span={6}>
                  {this.renderInput(2)}
                </Col>
                <Col className="padding-5" span={14}>
                  {this.renderSelect(2)}
                </Col>
              </Row>
              <Row className="padding-5">
                <Col className="padding-5 line-height-36" span={3}>PHIẾU C</Col>
                <Col className="padding-5" span={6}>
                  {this.renderInput(3)}
                </Col>
                <Col className="padding-5" span={14}>
                  {this.renderSelect(3)}
                </Col>
              </Row>
              <Row className="padding-5">
                <Col className="padding-5 line-height-36" span={3} />
                <Col className="padding-5" span={14}>
                  <Checkbox
                    name="onlyA"
                    onChange={this.handleChangeCheckbox.bind(this)}
                    checked={_get(this.state, 'onlyA', false)}
                  >
                    Chỉ giới hạn phiếu A
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </Col>
        </Fragment>
    );
  }
}

ManagerVotingLimit.propTypes = propType;
ManagerVotingLimit.defaultProp = defaultProps;

export default ManagerVotingLimit;