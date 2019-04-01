import React, { Component, lazy, Suspense } from "react";
import "App.css";
import { GET_PRODUCT_DATA } from "store/actions/admin/product";
import { connect } from "react-redux";
const ProductItem = lazy(() => import("modules/admin/product/component/item-list.js"));
const divStyle = {
  margin: '40px',
  border: '5px solid pink'
};
const pStyle = {
  fontSize: '15px',
  textAlign: 'center'
};


class ProductContainer extends Component {
  componentWillMount() {
    this.props.getProduct();
  }
  render() {
    let { items } = this.props;
    return (
      <div className="App" style={divStyle}>
        <ul style={pStyle}>
          <Suspense fallback={<div>loading</div>}>
          <ProductItem items={items} />
          </Suspense>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.products.fetching,
    items: state.products.items,
    error: state.products.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProduct: () => dispatch({ type: GET_PRODUCT_DATA })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);