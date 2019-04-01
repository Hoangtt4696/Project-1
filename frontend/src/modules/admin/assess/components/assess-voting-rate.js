import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Col, Tag} from 'antd';
import {connect} from 'react-redux';

// import { GET_VOTING_LIMIT_DETAIL } from '../../../../actions/admin/voting-limit';


// const calculateLimits = (numsOfEmp, limitSetting) => {
//   const calculate = (method, value) => {
//     if (method === 'ROUND') {
//       return Math.round(value)
//     }
//     if (method === 'FLOOR') {
//       return Math.floor(value)
//     }
//     return Math.ceil(value)
//   }
//   const a = calculate(limitSetting.voting_limit[1].round_method, (numsOfEmp * limitSetting.voting_limit[1].limit / 100));
//   const b = calculate(limitSetting.voting_limit[2].round_method, (numsOfEmp * limitSetting.voting_limit[2].limit / 100));
//   const c = calculate(limitSetting.voting_limit[3].round_method, (numsOfEmp * limitSetting.voting_limit[3].limit / 100));
//   return  [a, b, c]
// }

const propTypes = {
  votingLimit: PropTypes.arrayOf(PropTypes.number),
  // getVotingLimit: PropTypes.func.isRequired,
  votingData: PropTypes.arrayOf(PropTypes.object),
  aSelected: PropTypes.number,
  bSelected: PropTypes.number,
  cSelected: PropTypes.number,
  isLimitInA: PropTypes.bool
};

class VotingRate extends Component {
  
  componentDidMount(){
    // this.props.getVotingLimit();
  }

  render() {
    const {aSelected, bSelected, cSelected} = this.props;
    const {votingLimit} = this.props;
    return (
      <Col span={12} className="text-right re-voting-rate2">
          <span className="padding-5">A <Tag className={aSelected >= votingLimit[0] ? 'vote-b' : 'vote-a'}>{aSelected}/{votingLimit[0]}</Tag></span>
          {/* {!this.props.isLimitInA &&
            <> */}
            <span className="padding-5">B <Tag className={bSelected >= votingLimit[1] ? 'vote-b' : 'vote-a'}>{bSelected}{isNaN(votingLimit[1]) ? '' : `/${votingLimit[1]}`}</Tag></span>
            <span className="padding-5">C <Tag className={cSelected >= votingLimit[2] ? 'vote-b' : 'vote-a'}>{cSelected}{isNaN(votingLimit[2]) ? '' : `/${votingLimit[2]}`}</Tag></span>
            {/* </>
          } */}
          {/* {this.props.isLimitInA &&
            <>
              <span className="padding-5">&nbsp;</span>
              <span className="padding-5">&nbsp;</span>
            </>
          } */}
      </Col>
    );
  }
}

VotingRate.propTypes = propTypes;

const mapStateToProps = state => ({
  votingData: state.createVoting.votingData.items,
})

const mapDispatchToProps = dispatch => ({
  // getVotingLimit: () => dispatch({ type: GET_VOTING_LIMIT_DETAIL })  
})

export default connect(mapStateToProps, mapDispatchToProps)(VotingRate);