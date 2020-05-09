'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.JobApplication = new Schema({
    user_id: Schema.ObjectId,
    job_id: Schema.ObjectId,
    status: String
});

exports.JobApplication.methods.canBeEditedBy = function (accessingUser) {
    // Job Application can only be edited by its creator or admin
    return (this.user_id.equals(accessingUser._id)
        || accessingUser.roles.indexOf("Admin") > -1);
};

exports.JobApplication.methods.toResultFormat = function() {
    return {
        id : this._id,
        user_id : this.user_id,
        job_id : this.job_id,
        status : this.status
    };
};