// Import React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import Styles
import '../../../../App.css';

// Import Base Components
import AdminLayout from '../../../../modules/admin/admin-layout.js';
import AdminContentHeader from '../../../../modules/admin/admin-content-header.js';

// Import Third-party
import { Layout, Button } from 'antd';
import 'moment/locale/vi';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import _isEmpty from 'lodash/isEmpty';

// Import Components
import ManagerVote from '../component/manager-voting-limit';
import ManagerPoint from '../component/manager-point';

// Import Actions
import {
  POST_VOTING_LIMIT,
  GET_VOTING_LIMIT_DETAIL,
} from '../../../../actions/admin/voting-limit';

import showNotify  from '../../../../component/notify';

const propTypes = {
  postVotingLimit: PropTypes.func,
  votingLimit: PropTypes.object,
  getVotingLimit: PropTypes.func,
  isFetching: PropTypes.bool,
  error: PropTypes.object,
};

const defaultProps = {
  votingLimit: {},
};

class VotingLimitContainer extends Component {
  constructor(props) {
    super(props);
    
    const defaultVotePoint = {
      value: null,
      round_method: 'ROUND',
    };
    const { votingLimit } = this.props;

    this.state = {
      isFetching: false,
      error: {},
      isSave: false,
      prevVotingLimit: {
        ..._cloneDeep(votingLimit),
        pointFixed: {
          '1': _cloneDeep(defaultVotePoint),
          '2': _cloneDeep(defaultVotePoint),
          '3': _cloneDeep(defaultVotePoint),
        },
        pointRatio: {
          '1': _cloneDeep(defaultVotePoint),
          '2': _cloneDeep(defaultVotePoint),
          '3': _cloneDeep(defaultVotePoint),
        },
      },
      votingLimitSetting: {
        ..._cloneDeep(votingLimit),
        pointFixed: {
          '1': _cloneDeep(defaultVotePoint),
          '2': _cloneDeep(defaultVotePoint),
          '3': _cloneDeep(defaultVotePoint),
        },
        pointRatio: {
          '1': _cloneDeep(defaultVotePoint),
          '2': _cloneDeep(defaultVotePoint),
          '3': _cloneDeep(defaultVotePoint),
        },
      }
    };
  }

  componentDidMount() {
    this.props.getVotingLimit();
  }

  componentDidUpdate() {
    if (this.state.isSave) {
      if (!this.state.isFetching && _isEmpty(this.state.error)) {
        showNotify('suc', 'Lưu hạn mức bình chọn thành công');

        this.setState({
          isSave: false,
        });
      }

      if (!this.state.isFetching && !_isEmpty(this.state.error)) {
        _get(this.state.error, 'data.message', ['Có lỗi xảy ra']).forEach(mes => {
          showNotify('err', mes);
        });

        this.setState({
          isSave: false,
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching !== undefined) {
      this.setState({
        isFetching: nextProps.isFetching,
      });
    }

    if (nextProps.error) {
      this.setState({
        error: nextProps.error,
      });
    }

    if (nextProps.votingLimit) {
      if (!nextProps.votingLimit.exchange_mark_type) {
        nextProps.votingLimit.exchange_mark_type = 'FIXED'
      }

      if (!nextProps.votingLimit.voting_limit) {
        nextProps.votingLimit.voting_limit = {
          1: {
            limit: 50,
            round_method: 'ROUND',
          },
          2: {
            limit: 30,
            round_method: 'ROUND',
          },
          3: {
            limit: 20,
            round_method: 'ROUND',
          }

        };
      }
      
      if (nextProps.votingLimit.exchange_mark_type === 'FIXED') {
        nextProps.votingLimit.pointFixed =
            !nextProps.votingLimit.exchange_mark ? {
              '1': {
                value: 3,
                round_method: 'ROUND',
              },
              '2': {
                value: 2,
                round_method: 'ROUND',
              },
              '3': {
                value: 1,
                round_method: 'ROUND',
              },
            } : nextProps.votingLimit.exchange_mark;
        nextProps.votingLimit.pointRatio = {
          '1': {
            value: 80,
            round_method: 'ROUND',
          },
          '2': {
            value: 60,
            round_method: 'ROUND',
          },
          '3': {
            value: 40,
            round_method: 'ROUND',
          },
        };
      } else {
        nextProps.votingLimit.pointRatio =
            !nextProps.votingLimit.exchange_mark ? {
              '1': {
                value: 80,
                round_method: 'ROUND',
              },
              '2': {
                value: 60,
                round_method: 'ROUND',
              },
              '3': {
                value: 40,
                round_method: 'ROUND',
              },
            } : nextProps.votingLimit.exchange_mark;
        nextProps.votingLimit.pointFixed = {
          '1': {
            value: 3,
            round_method: 'ROUND',
          },
          '2': {
            value: 2,
            round_method: 'ROUND',
          },
          '3': {
            value: 1,
            round_method: 'ROUND',
          },
        }
      }

      this.setState({
        votingLimitSetting: _cloneDeep(nextProps.votingLimit),
        prevVotingLimit: _cloneDeep(nextProps.votingLimit),
      });
    }
  }

  handleChangeSection(stateSection) {
    const votingLimitSetting = Object.assign({}, this.state.votingLimitSetting, {});
    const keyMatch = Object.keys(votingLimitSetting).filter(item => {
      return stateSection.hasOwnProperty(item);
    });

    keyMatch.forEach(key => {
      if (key === 'only_limit_ballot_A' || key === 'exchange_mark_type') {
        votingLimitSetting[key] = stateSection[key];
      } else {
        votingLimitSetting[key] = _merge(votingLimitSetting[key], stateSection[key]);
      }
    });

    this.setState({ votingLimitSetting });
  }

  handleClear() {
    this.setState({
      votingLimitSetting: _cloneDeep(this.state.prevVotingLimit),
    });
  }

  handleSave() {
    const votingLimitSetting = Object.assign({}, this.state.votingLimitSetting, {});

    votingLimitSetting.exchange_mark =
        votingLimitSetting.exchange_mark_type === 'FIXED'
            ? votingLimitSetting.pointFixed
            : votingLimitSetting.pointRatio;

    delete votingLimitSetting.pointFixed;
    delete votingLimitSetting.pointRatio;

    this.props.postVotingLimit(votingLimitSetting);

    this.setState({
      isSave: true,
    });
  }

  render() {
    const {
      voting_limit,
      pointFixed,
      pointRatio,
      only_limit_ballot_A,
      exchange_mark_type,
    } = this.state.votingLimitSetting;

    return (
      <AdminLayout>
        <Layout>
          <div className="app-heading">
            <AdminContentHeader text="Hạn mức bình chọn" />
          </div>
          <div className="app-content-1">
            <div>
              <ManagerVote
                data={{votingLimit: voting_limit, onlyA: only_limit_ballot_A}}
                handleChangeSection={this.handleChangeSection.bind(this)}
              />
              <ManagerPoint
                data={{
                  pointFixed,
                  pointRatio,
                  exchangeMarkType: exchange_mark_type,
                }}
                handleChangeSection={this.handleChangeSection.bind(this)}
              />
            </div>
            <div className="clear" />
          </div>
          <div className="text-right app-footer">
          <Button
            type="default"
            className="bg-default"
            style={{ marginRight: '1rem' }}
            onClick={this.handleClear.bind(this)}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            className="bg-primary"
            onClick={this.handleSave.bind(this)}
            loading={this.state.isFetching}
          >
            Lưu
          </Button>
          </div>
        </Layout>
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  votingLimit: _get(state, 'votingLimit.votingLimit', {}),
  isFetching: _get(state, 'votingLimit.isFetching', false),
  error: _get(state, 'votingLimit.error', {}),
});

const mapDispatchToProps = dispatch => ({
  postVotingLimit: votingLimit => dispatch({ type: POST_VOTING_LIMIT, votingLimit }),
  getVotingLimit: () => dispatch({ type: GET_VOTING_LIMIT_DETAIL }),
});

VotingLimitContainer.propTypes = propTypes;
VotingLimitContainer.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(VotingLimitContainer);