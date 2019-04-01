import React from 'react'
import { Link } from 'react-router-dom';
const ProductItem = ({items}) => {
  return items.map((item, index) => {
    return <li key={item.id}>San Pham : {item.name} - <Link to={'products/' + item.id}>Xem chi tiết</Link> </li>
  })
}
export default ProductItem