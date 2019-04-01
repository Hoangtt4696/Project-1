'use strict';

//const _                         = require('lodash');
const path                      = require('path');
const BaseBusiness              = require(path.resolve('./core/business/base'));
const ModelVotePoint            = require('../../vote-point/model/vote-point');
const rabbitQueue               = require(path.resolve('./lib/rabbit/queue.js'));

module.exports = class VoteBusiness extends BaseBusiness {
    constructor(data, user) {
        super();
        this._data = data;
        this._user = user;
    }

    /**
     * @description insert data into database
     */
    async upsert() {
        let data = this._formatData();
        let votePoint = await ModelVotePoint.updated(data, 
            {
                vote_id: this._data.vote_id, 
                voter_id: this._data.voter_id,
                department_id: this._data.department_id
            }, 
            'Insert or Update Vote Point', null, true);
        
        if (ModelVotePoint.error) {
            return this._setError(ModelVotePoint.message);
        }
        
        this._updatePointForVote(votePoint);
        return votePoint;
    }
    
    /**
     * @description update point employee after insert vote point
     * @param  {object} votePoint
     */
    async _updatePointForVote(votePoint) {
        let data = {
            dataVotePoint: votePoint,
            user: this._user
        };

        try {
            rabbitQueue(data, 'sync_sum_vote_point');
        } catch (error) {
            console.log(error);
            this._setError('Update Point Error');
        }
    }

    _formatData() {
        let data        = this._data;
        data.voter_id    = this._user.employee_id;
        data.updated_at = new Date();
        
        return data;
    }
};