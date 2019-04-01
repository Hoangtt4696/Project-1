import React from 'react';
import { Alert } from 'antd';

const AlertBox = (props) => (
    <Alert className="alert-new" message={props.message} type={props.type} showIcon />
);

export default AlertBox;