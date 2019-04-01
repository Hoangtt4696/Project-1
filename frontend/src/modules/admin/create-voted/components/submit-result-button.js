import React, { Component } from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {PUT_SUBMIT_RESULT} from '../../../../actions/admin/create-voted';
import showNotify from '../../../../component/notify';

class SubmitResultButton extends Component {
  state = {
    loading: false
  }

  handleClickSubmit = () => {
    this.setState({
      loading: true
    })
    this.props.submitResult(this.props.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = prevState;

    if (nextProps.id === nextProps.sendResult) {
      state = {...state, loading: false}
    }

    return state;
  }

  componentDidUpdate(lastProps, lastState) {
    if (this.state.loading !== lastState.loading && lastState.loading && this.props.sendResultError === null) {
      showNotify('suc', 'Gửi kết quả thành công.');
    } else if (this.state.loading !== lastState.loading && lastState.loading && this.props.sendResultError !== null) {
      showNotify('err', 'Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }

  render() {
    const {loading} = this.state;
    // const {id} = this.props;

    return (
      <Button   
        type="primary" 
        className='bg-primary' 
        onClick={this.handleClickSubmit} 
        loading={loading} 
      >
        Gửi kết quả
      </Button>
    );
  }
}

SubmitResultButton.propTypes = {
  submitResult: PropTypes.func.isRequired,
  sendResult: PropTypes.string,
  sendResultError: PropTypes.object,
  id: PropTypes.string,
  sendResultFetching: PropTypes.bool
};

const mapStateToProps = state => ({
  sendResult: state.createVoting.sendResult,
  sendResultError: state.createVoting.sendResultError,
  sendResultFetching: state.createVoting.sendResultFetching
})

const mapDispatchToProps = dispatch => ({
  submitResult: id => dispatch({type: PUT_SUBMIT_RESULT, id})
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmitResultButton);