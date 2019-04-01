'use strict';

const path = require('path');
const BaseController = require(path.resolve('./core/controller/base'));
const helperClass = require(path.resolve('./helper/class'));
const ModelVotePoint = require('../model/vote-point');
const BusinessVotePoint = require('../../vote-point/business/vote-point');

class VotePointController extends BaseController {
    constructor(req, res, next, id) {
        super(req, res, next, id);
    }

    /**
     * @description create vote point
     */
    async create() {
        let bus = new BusinessVotePoint(this._body, this._user);
        let votePoint = await bus.upsert();
        if (bus.error) {
            return this.renderError(bus.message);
        }
        return this.renderJson(votePoint);
    }
    /**
     * @description get all vote point
     */
    async list() {
        let votes = await ModelVotePoint.select(this._query);
        if (ModelVotePoint.error) {
            return this.renderError(ModelVotePoint.message);
        }
        return this.renderJson({
            total: votes.length,
            items: votes
        });
    }
}

module.exports = helperClass.exportClassMethod(VotePointController, [
    'create',
    'list'
]);
