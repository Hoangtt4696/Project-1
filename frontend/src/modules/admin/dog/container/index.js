import React, { Component } from "react";
import logo from "../../../../logo.svg";

import { GET_DOG_DATA } from "store/actions/admin/dog";
import { connect } from "react-redux";
import Button from "antd/lib/button";

class DogContainer extends Component {
  componentDidMount() {
    console.log(Button);
    
    console.log(this.state);
    this.props.onRequestDog();
  }
  render() {
    const { fetching, dog, onRequestDog, error, history } = this.props;

    return (
      <div className="App">
        <img src={dog || logo} className="App-logo" alt="logo" style={{ marginBottom: '150px', marginTop: '150px' }} />
        <h1 className="App-title">Welcome to Dog Saga</h1>
        <div  >
          {dog ? (
            <p className="App-intro">Keep clicking for new dogs</p>
          ) : (
              <p className="App-intro">Replace the React icon with a dog!</p>
            )}

          {fetching ? (
            <button disabled>Fetching...</button>
          ) : (
              <button onClick={onRequestDog}>Request a Dog</button>
            )} -&nbsp;
          <Button onClick={() => history.push({ pathname: '/products' })}>Sản phẩm</Button>
          {error && <p style={{ color: "red" }}>Uh oh - something went wrong!</p>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.dog.fetching,
    dog: state.dog.dog,
    error: state.dog.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestDog: () => dispatch({ type: GET_DOG_DATA })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DogContainer);