import React from 'react'
import { Spin, Icon, Alert } from 'antd';

const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 50 }} spin />;
export default () => <div><Spin indicator={antIcon}><Alert className="width-100" type="info"/></Spin></div>