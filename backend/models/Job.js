'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobApplicationModel = mongoose.model('JobApplication',
    require('./JobApplication').JobApplication);

exports.Job = new Schema({
    creator_user_id: Schema.ObjectId,
    worker_user_id: Schema.ObjectId,
    activities: [String],
    description: String,
    starts_at: Date,
    ends_at: Date,
    created_at: Date,
    updated_at: Date,
    dog: {
        name: String,
        size: String,
        years_old : Number,
        breed: String,
    }
});

exports.Job.methods.canBeEditedBy = function (accessingUser) {
    // Job can only be edited by its creator or admin
    return (this.creator_user_id.equals(accessingUser._id)
        || accessingUser.roles.indexOf("Admin") > -1);
};

exports.Job.methods.canBeAppliedToBy = function (accessingUser) {
    // Jobs can be applied to
    // - by users with role "PetSitter"
    // - who are not the creator
    return (!this.creator_user_id.equals(accessingUser._id)
        && accessingUser.roles.indexOf("PetSitter") > -1);
};

exports.Job.methods.toResultFormat = async function() {
    const applicationResults = await JobApplicationModel.find({ job_id : this._id });
    let applications = [];
    for (let r = 0; r < applicationResults.length; r++)
        applications.push(applicationResults[r].toResultFormat());

    return {
        id : this._id,
        creator_user_id : this.creator_user_id,
        worker_user_id : (this.worker_user_id ? this.worker_user_id : null),
        applications : applications,
        description : this.description,
        activities : this.activities,
        activities : this.activities,
        dog : this.dog,
        starts_at : this.starts_at,
        ends_at : this.ends_at,
        created_at : this.created_at,
        updated_at : this.updated_at
    };
};
