import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

class ConfirmModal extends Component {
  render() {
    const {visible, onCancel, onOk, message, title, type} = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={onOk}
        onCancel={() => onCancel('modal')}
        okText={type === 'deactivate' ? 'Ngưng' : type === 'activate' ? 'Kích hoạt' : 'Đồng ý'}
        cancelText="Huỷ"
      >
        <p>{message}</p>
      </Modal>
    );
  }
}

ConfirmModal.propTypes = propTypes;

export default ConfirmModal;