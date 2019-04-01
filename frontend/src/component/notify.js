import { notification } from 'antd';

const showNotify = (action, message, description, click = () => {}) => {
  let func;
  switch (action) {
    case 'suc': 
    func = notification.success;
    break;
    default:
    func = notification.error; 
    break
  }

  func({
    message,
    description,
    onClick: click,
  });
};

export default showNotify;