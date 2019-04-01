// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import { Select } from 'antd';
import _isEmpty from 'lodash/isEmpty';

const propTypes = {
  value: PropTypes.array,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any,
    })
  ),
  handleChange: PropTypes.func,
  title: PropTypes.string,
};
const defaultValue = {
  value: [],
  options: [],
};

const Option = Select.Option;

class TagPicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      options: this.props.options,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }

    if (nextProps.options) {
      this.setState({
        options: nextProps.options,
      });
    }
  }

  static renderChildren(options) {
    options = options.filter((option, index, self) => (
        index === self.findIndex(ind => (
           ind.id === option.id
        ))
    ));

    return options.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
  }

  render() {
    return (
      <div>
        {this.props.title ? <p className="margin-bottom-5">{this.props.title}</p> : null}
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Vui lòng chọn"
          onChange={this.props.handleChange}
          value={this.state.value}
          {...this.props}
        >
          { _isEmpty(this.state.options) ? null : <Option key={this.state.options.length-1} value='all' className="bg-tree">Tất cả</Option> }
          {TagPicker.renderChildren (this.state.options || [])}
        </Select>
      </div>
    );
  }
}

TagPicker.propTypes = propTypes;
TagPicker.defaultValue = defaultValue;

export default TagPicker;