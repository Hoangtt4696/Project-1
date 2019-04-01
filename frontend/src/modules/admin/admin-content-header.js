import React, { Component } from 'react';
import { Col } from 'antd';

class AdminContentHeader extends Component {
  render() {
    return (
      <Col className="gutter-row" span={12}>
        <div className="gutter-box size-22">
          {this.props.text}
        </div>
      </Col>
    );
  }
}

export default AdminContentHeader;

