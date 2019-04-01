import React from 'react';
import {Icon} from 'antd';

function AssessGuide(props) {
  return (
    <div>
      <div className="padding-bottom-15 text-bold re-guild">
        <Icon type="question-circle" theme="filled" /> HƯỚNG DẪN
      </div>
      <div className="help-content margin-bottom-40" style={{maxHeight: '78vh', overflow: 'auto'}}>
        <div className='assess-guide-content' dangerouslySetInnerHTML={{__html:props.guide}} />
        {/* <p>Đánh giá 360° là công cụ đo lường và kiểm định hiệu suất làm việc của nhân viên.</p>
        <p>Đánh giá 360° tập trung vào hành vi và năng lực thực của các vai trò trong doanh nghiệp nhiều hơn vào các kỹ năng cơ bản, yêu cầu công việc. Nhân viên xem bản đánh giá và xếp loại từ nhiều nguồn khác nhau nhằm phản ánh sự công bằng về hiệu suất làm việc của chính mình, qua đó thúc đẩy sự thay đổi về hành vi và năng lực nhằm mang lại nhiều lợi ích cho doanh nghiệp/tổ chức và cho chính nhân viên.</p>
        <div>Đánh giá 360° đo lường những gì:</div>
        <div className="padding-left-20">• Hướng đến các kỹ năng như lắng nghe, lập kế hoạch,…</div>
        <div className="padding-left-20">• Tập trung vào các lĩnh vực như làm việc nhóm, tính cách,...</div>
        <div className="padding-left-20">• Đo lường hành vi và khung năng lực của nhân viên.</div> */}
      </div>
    </div>
  )
}

export default AssessGuide
