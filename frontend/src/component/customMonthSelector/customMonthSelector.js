import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Select} from 'antd';

const Option = Select.Option;

const startTime = moment(112018, 'MMYYYY');
const month = [];
[...new Array(moment().diff(startTime, 'months') + 1)].map((m, index) => {
  const currentMonth = startTime.add(index === 0 ? 0 : 1, 'months');
  month.push(
    <Option key={parseInt(currentMonth.format('YYYYMM'))} value={parseInt(currentMonth.format('YYYYMM'))}>
      {`Tháng ${currentMonth.month() + 1}/${currentMonth.year()}`}
    </Option>
  )
  return month;
})
const months = month.reverse();

class CustomMonthSelector extends Component {
  componentDidMount(){
    this.props.handleSelectPeriod(parseInt(moment().format('YYYYMM')));
  }

  render() {
    return (
      <Select
        className= "border re-header3"
        placeholder="Chọn tháng"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        // defaultValue={parseInt(moment().format('YYYYMM'))}
        defaultValue={`Tháng ${moment().month() >= 10 ? moment().format('MM/YYYY') : moment().format('M/YYYY')}`}
        optionFilterProp="children"
        style={{width: '150px'}}
        onSelect={this.props.handleSelectPeriod}
        // style={{width: '9vw'}}
      >
        {months}
      </Select>
    );
  }
}

CustomMonthSelector.propTypes = {
  handleSelectPeriod: PropTypes.func.isRequired
};

export default CustomMonthSelector;

