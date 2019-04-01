import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Select, TimePicker, Col, Row} from 'antd';

const Option = Select.Option;
const date = [];
for (let i = 1; i < 32; i++) {
  date.push(<Option key={i}>{i}</Option>);
}

const format = 'HH:mm';

const propTypes = {
  title: PropTypes.string.isRequired,
  handleChangeStartDay: PropTypes.func.isRequired,
  handleChangeEndDay: PropTypes.func.isRequired,
  handleChangeStartTime: PropTypes.func.isRequired,
  handleChangeEndTime: PropTypes.func.isRequired,
  startDay: PropTypes.number,
  startTime: PropTypes.object,
  endDay: PropTypes.number,
  endTime: PropTypes.object
}

class VotingDuration extends Component {
  render() {
    const {
      title, 
      handleChangeStartDay, 
      handleChangeEndDay, 
      handleChangeStartTime, 
      handleChangeEndTime,
      startDay,
      startTime,
      endDay,
      endTime
    } = this.props;
    return (
      <Col span={15}>
        <Row className="margin-top-20">
          <p className="text-bold">{title}</p>
          <span className="bg-text">Hàng tháng vào ngày</span>
          <span className="bg-text-2">
            <Select
              showSearch
              style={{ width: 68 }}
              optionFilterProp="children"
              value={startDay}
              onChange={handleChangeStartDay}
              filterOption={(input, option) => option.props.children.toString().indexOf(input) >= 0}
            >
              {date}
            </Select>
          </span>
          <span className="bg-text">Lúc</span>
          <span className="bg-text-2">
            <TimePicker 
              format={format} 
              style={{ width: 90 }}
              value={startTime}
              onChange={handleChangeStartTime}
            />
          </span>
          <span className="bg-text">Đến ngày</span>
          <span className="bg-text-2">
            <Select
            className="radius-0"
              showSearch
              style={{ width: 68 }}
              optionFilterProp="children"
              value={endDay}
              onChange={handleChangeEndDay}
              filterOption={(input, option) => option.props.children.toString().indexOf(input) >= 0}
            >
              {date}
            </Select>
          </span>
          <span className="bg-text">Lúc</span>
          <span className="bg-text-2">
            <TimePicker 
              format={format} 
              value={endTime}
              style={{ width: 90}}
              onChange={handleChangeEndTime}
            />
          </span>
        </Row>
      </Col>
    );
  }
}

VotingDuration.propTypes = propTypes;

export default VotingDuration;