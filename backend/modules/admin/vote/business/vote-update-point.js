'use strict';

const _                         = require('lodash');
const path                      = require('path');
const BaseBusiness              = require(path.resolve('./core/business/base'));
const ModelVote                 = require('../model/vote');
const ModelVotePoint            = require('../../vote-point/model/vote-point');
const ModelVotingLimitSetting   = require('../../vote-setting/model/voting-limit-setting');

module.exports = class VoteUpdatePointBusiness extends BaseBusiness {
    constructor(dataVotePoint, user) {
        super();
        this._data = dataVotePoint;
        this._user = user;
    }
    /**
     * @description update point
     */
    async updatePoint() {
        let deparmentId = _.get(this._data, 'department_id', '');
        let voteId = _.get(this._data, 'vote_id', '');
        //get vote and list vote point
        let votes = await ModelVote.selectOne({_id: voteId});
        let lstVotePoint = await ModelVotePoint.select({vote_id: voteId, department_id: deparmentId});

        if (votes && lstVotePoint) {
            let objPointType = {};
            for (let i = 0; i < lstVotePoint.length; i++) {
                const lstPointEmployee = _.get(lstVotePoint[i], 'employee_point_list', []);
                for (let i = 0; i < lstPointEmployee.length; i++) {
                    let element = lstPointEmployee[i];
                    if (!objPointType.hasOwnProperty(element.employee_id)) {
                        objPointType[element.employee_id] = {};
                    }
                    
                    if (objPointType[element.employee_id].hasOwnProperty(element.point_level)) {
                        objPointType[element.employee_id][element.point_level] += 1;
                    } else {
                        objPointType[element.employee_id][element.point_level] = 1;
                    }
                }
            }

            let lstEmployee = votes.employee_list;
            for (let i = 0; i < lstEmployee.length; i++) {
                const employee = lstEmployee[i];
                if (employee.employee_department_vote === deparmentId
                    && objPointType.hasOwnProperty(employee.employee_id)) {
                    employee.point_type = objPointType[employee.employee_id];
                }
            }

            //update point
            await ModelVote.updated(votes, {_id: voteId}, 'update point for employee', null, true);
            if (ModelVote.error) {
                return this._setError(ModelVote.message);
            }
        }

        return true;
    }
};