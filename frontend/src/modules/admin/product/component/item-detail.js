import React from 'react'
const ProductDetail = ({ items }) =>
  <div>
    <div>Tên : {items.name}</div>
    <div>Hình ảnh : <img alt="hinh anh" src={items.avatar} /></div>
    <div>address : {items.description}</div>

  </div>
export default ProductDetail