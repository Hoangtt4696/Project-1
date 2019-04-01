// Import React
import React from 'react'
import PropTypes from 'prop-types'

// Import Third-party
import {Select} from 'antd'

const propTypes = {
  title: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function TagPicker(props) {
  return (
    <div>
      <p className="margin-bottom-5">{props.title} {props.isRequired && '*'}</p>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        // defaultValue={['a10', 'c12']}
        onChange={props.onChange}
      >
        {children}
      </Select>
    </div>
  )
}

TagPicker.propTypes = propTypes;

export default TagPicker
