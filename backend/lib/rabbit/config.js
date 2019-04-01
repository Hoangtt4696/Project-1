let path = require('path');
let businessSyncVoteUpdatePoint = require(path.resolve('./modules/admin/vote/business/vote-update-point.js'));
let businessVote = require(path.resolve('./modules/admin/vote/business/vote.js'));

const rabbit_config = global.config.rabbit_config.queue
module.exports = {
  'sync_sum_vote_point': {
    ...rabbit_config['sync_sum_vote_point'],
    func: async (data) => {
      let bus = new businessSyncVoteUpdatePoint(data.dataVotePoint, data.user).updatePoint();
      return !bus.error;
    }
  },
  'sync_create_vote': {
    ...rabbit_config['sync_create_vote'],
    func: async (data) => {
      let bus = new businessVote(data.user, data.data);
      bus.insert();
      return !bus.error;
    }
  }
}