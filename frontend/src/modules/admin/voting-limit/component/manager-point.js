// Import React
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import {Col, Input, Row, Select, Radio} from 'antd';
import _get from 'lodash/get';

// Import Helpers
import { validateIsNumber } from '../../../../lib/helper';

const RadioGroup = Radio.Group;

const propTypes = {
  handleChangeSection: PropTypes.func,
  data: PropTypes.object.object,
};
const defaultProps = {
  handleChangeSection: () => void(0),
};

class ManagerPoint extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exchangeMarkType: _get(this.props, 'data.exchangeMarkType', 'FIXED'),
      pointRatio: _get(this.props, 'data.pointRatio', {}),
      pointFixed: _get(this.props, 'data.pointFixed', {}),
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data.pointFixed) {
      this.setState({
        pointFixed: nextProps.data.pointFixed,
      });
    }

    if (nextProps.data.pointRatio) {
      this.setState({
        pointRatio: nextProps.data.pointRatio,
      });
    }

    if (nextProps.data.exchangeMarkType) {
      this.setState({
        exchangeMarkType: nextProps.data.exchangeMarkType,
      });
    }
  }

  renderInput(name, type) {
    const addonText = type === 'fixed' ? 'Điểm' : '%';
    const width = type === 'fixed' ? 150 : 100;
    const { pointFixed, pointRatio } = this.state;

    const exchangeMark = type === 'fixed' ? pointFixed : pointRatio;

    return (
      <Input
        style={{ width }}
        addonAfter={addonText}
        name={name}
        onChange={this.handleChangeInput.bind(this)}
        value={_get(exchangeMark, `${name}.value`, null)}
      />
    );
  }

  renderSelect(name) {
    const Option = Select.Option;
    const { pointRatio, pointFixed, exchangeMarkType } = this.state;
    const exchangeMark = exchangeMarkType === 'FIXED' ? pointFixed : pointRatio;

    return (
        <Select
          className="border"
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a person"
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={this.handleChangeSelect.bind(this, name)}
          value={_get(exchangeMark, `${name}.round_method`, 'ROUND')}
        >
          <Option value="ROUND">Làm tròn chuẩn (ROUND)</Option>
          <Option value="CEIL">Làm tròn lên (CEIL)</Option>
          <Option value="FLOOR">Làm tròn xuống (FLOOR)</Option>
        </Select>
    );
  }

  handleChangeInput(e) {
    const { name, value } = e.target;
    const { exchangeMarkType, pointFixed, pointRatio } = this.state;

    if (exchangeMarkType === 'FIXED') {
      if (validateIsNumber(value) && value >= 0) {
        pointFixed[name].value = Number(value);
      }

      if (value === '') {
        pointFixed[name].value = null;
      }
    } else {
      if (validateIsNumber(value) && value >= 0) {
        pointRatio[name].value = Number(value);
      }

      if (value === '') {
        pointRatio[name].value = null;
      }
    }

    this.setState({
      pointFixed,
      pointRatio,
    }, () => {
      this.props.handleChangeSection({
        pointFixed: this.state.pointFixed,
        pointRatio: this.state.pointRatio,
      });
    });
  }

  handleChangeSelect(name, value) {
    const { pointRatio, pointFixed, exchangeMarkType } = this.state;

    if (exchangeMarkType === 'FIXED') {
      pointFixed[name].round_method = value;
    } else {
      pointRatio[name].round_method = value;
    }

    this.setState({
      pointFixed,
      pointRatio,
    }, () => {
      this.props.handleChangeSection({
        pointFixed: this.state.pointFixed,
        pointRatio: this.state.pointRatio,
      });
    });
  }

  handleChangeTabs(e) {
    this.setState({
      exchangeMarkType: e.target.value,
    }, () => {
      this.props.handleChangeSection({
        exchange_mark_type: this.state.exchangeMarkType,
      });
    });
  }

  render() {
    return (
        <Fragment>
          <Col className="padding-left-10" span={12}>
            <p className="font-weight-600">QUY ĐỔI ĐIỂM BÌNH CHỌN</p>
            <div className="bg-text-3">
            <RadioGroup name="radiogroup" onChange={this.handleChangeTabs.bind(this)} value={this.state.exchangeMarkType}>
              <Radio  value='FIXED'>Điểm cố định</Radio>
              <Radio value='RATIO'>Theo tỷ lệ danh sách bình chọn</Radio>
              {this.state.exchangeMarkType === 'FIXED' ? <Row span={24} style={{marginTop: '17px'}}>
                  <Row className="padding-5">
                      <Col className="padding-5 line-height-36" span={3}>PHIẾU A</Col>
                      <Col className="padding-5" span={6}>
                        {this.renderInput('1', 'fixed')}
                      </Col>
                    </Row>
                    <Row className="padding-5">
                      <Col className="padding-5 line-height-36" span={3}>PHIẾU B</Col>
                      <Col className="padding-5" span={6}>
                        {this.renderInput('2', 'fixed')}
                      </Col>
                    </Row>
                    <Row className="padding-5">
                      <Col className="padding-5 line-height-36" span={3}>PHIẾU C</Col>
                      <Col className="padding-5" span={6}>
                        {this.renderInput('3', 'fixed')}
                      </Col>
                    </Row>
                </Row> : null
              }
              {this.state.exchangeMarkType === 'RATIO' ? <Row span={24}>
                <Row className="padding-5">
                    <Col className="padding-5" span={3} />
                    <Col className="padding-5" span={6}>HẠN MỨC</Col>
                    <Col className="padding-5" span={14}>CÁCH LÀM TRÒN</Col>
                  </Row>
                  <Row className="padding-5">
                    <Col className="padding-5 line-height-36" span={3}>PHIẾU A</Col>
                    <Col className="padding-5" span={6}>
                      {this.renderInput('1', 'ratio')}
                    </Col>
                    <Col className="padding-5" span={14}>
                      {this.renderSelect('1')}
                    </Col>
                  </Row>
                  <Row className="padding-5">
                    <Col className="padding-5 line-height-36" span={3}>PHIẾU B</Col>
                    <Col className="padding-5" span={6}>
                      {this.renderInput('2', 'ratio')}
                    </Col>
                    <Col className="padding-5" span={14}>
                      {this.renderSelect('2')}
                    </Col>
                  </Row>
                  <Row className="padding-5">
                    <Col className="padding-5 line-height-36" span={3}>PHIẾU C</Col>
                    <Col className="padding-5" span={6}>
                      {this.renderInput('3', 'ratio')}
                    </Col>
                    <Col className="padding-5" span={14}>
                      {this.renderSelect('3')}
                    </Col>
                  </Row>
                </Row> : null
              }
            </RadioGroup>
            </div>
          </Col>
        </Fragment>
    );
  }
}

ManagerPoint.propTypes = propTypes;
ManagerPoint.defaultProps = defaultProps;

export default ManagerPoint;