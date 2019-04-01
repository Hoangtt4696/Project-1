import React, { Component } from "react";
import "../../../../App.css";
import { GET_PRODUCT_DETAIL_DATA } from "store/actions/admin/product";
import { connect } from "react-redux";
import Loadable from 'react-loadable';
import Loading from '../../loading';
// import ProductDetail from '../component/item-detail';
class ProductDetailContainer extends Component {
  componentDidMount() {
    this.props.getProduct(this.props.match.params.id);
  }
  render() {
    let {items} = this.props;
    const ProductDetail = Loadable({
      loader: () => import('../component/item-detail'),
      loading: Loading,
    });
    return (
      <div className="App">
        <ul>
          <ProductDetail items={items}/>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.product.fetching,
    items: state.product.items,
    error: state.product.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProduct: (id) => dispatch({ type: GET_PRODUCT_DETAIL_DATA, id })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailContainer);