'use strict';

const mongoose = require('mongoose');
const problem = require('../utils/problem');
const JobModel = mongoose.model('Job', require('../models/Job').Job);
const JobApplicationModel = mongoose.model('JobApplication',
    require('../models/JobApplication').JobApplication);

/**
 * Create a job application
 *
 * body JobApplication  (optional)
 * id String 
 * returns JobApplication
 **/
exports.create_job_application = async function(body, id, accessingUser) {
    let job = null;
    try {
        job = await JobModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job.");
    }

    if (!job)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job not found.");
    
    if (!job.canBeAppliedToBy(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User is not allowed to apply for this job.");

    body.job_id = id;
    body.user_id = accessingUser._id;
    const jobApplication = new JobApplicationModel(body);

    try {
        await jobApplication.save();
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to save job application.");
    }

    return jobApplication;
}


/**
 * Delete application
 *
 * id String 
 * no response value expected for this operation
 **/
exports.delete_job_application = async function(id, accessingUser) {
    let jobApplication = null;
    try {
        jobApplication = await JobApplicationModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job application.");
    }

    if (!jobApplication)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job application not found.");

    if (!jobApplication.canBeEditedBy(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to delete.");
    
    try {
        await JobApplicationModel.deleteOne(jobApplication);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to delete job application.");
    }
}


/**
 * Remove Job
 *
 * id String 
 * no response value expected for this operation
 **/
exports.delete_jobs_id = async function(id, accessingUser) {
    let job = null;
    try {
        job = await JobModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job.");
    }

    if (!job)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job not found.");
    
    if (!job.canBeEditedBy(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to delete.");
  
    try {
        await JobModel.deleteOne(job);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to delete job.");
    }
}


/**
 * Get all applications for this job.
 *
 * id String 
 * returns List
 **/
exports.get_applications_by_job_id = async function(id) {
    let results = null;
    try {
        results = await JobApplicationModel.find({ job_id : id });
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job applications.");
    }

    let items = [];
    for (let r = 0; r < results.length; r++)
        items.push(results[r].toResultFormat());
      
    return items;
}


/**
 * Get a list of Job Applications that are associated with this user.
 *
 * id String 
 * returns List
 **/
exports.get_job_applications_for_user = async function(id) {
    let results = null;
    try {
        results = await JobApplicationModel.find({ user_id : id });
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job applications.");
    }

    const items = await Promise.all( results.map(res => res.toResultFormat()))
    return items
}


/**
 * List available jobs
 *
 * limit Integer Limits the number of results the endpoint returns. (optional)
 * offset String Skips these many items from the response. (optional)
 * returns inline_response_200
 **/
exports.get_jobs = async function(limit, offset) {
    let totalItems = null;
    let results = null;
    try {
        totalItems = await JobModel.countDocuments();
        results = await JobModel.find({}, null, { skip : offset, limit : limit });
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve jobs.");
    }

    const items = await Promise.all(
      results.map(res => res.toResultFormat())
    )

    return {
        hasMore : ((offset ? offset : 0) + items.length < totalItems),
        items : items,
        total_items : totalItems
    };
}


/**
 * Get a list of Jobs that are associated with this user.
 * - **TODO** Find out about returing arrays directly (without being wrapped in an envelope). 
 *
 * id String 
 * returns List
 **/
exports.get_jobs_for_user = async function(id) {
    let results = null;
    try {
        results = await JobModel.find({ creator_user_id : id });
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve jobs.");
    }

    let items = [];
    for (let r = 0; r < results.length; r++)
        items.push(await results[r].toResultFormat());
      
    return items;
}


/**
 * Get Job Details
 *
 * id String 
 * returns Job
 **/
exports.get_jobs_id = async function(id) {  
    let job = null;
    try {
        job = await JobModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job.");
    }

    if (!job)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job not found.");

    return await job.toResultFormat();
}


/**
 * Post new Job
 *
 * body Job  (optional)
 * returns Job
 **/
exports.post_jobs = async function(body, accessingUser) {
    if (!accessingUser.hasRole('PetOwner'))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User must have PetOwner role to post a job.");

    body.created_at = new Date;
    body.updated_at = new Date;
    body.creator_user_id = accessingUser._id;
    const job = new JobModel(body);

    try {
        await job.save();
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to create job!");
    }

    return job;
}


/**
 * Update Job Details
 *
 * body Job  (optional)
 * id String 
 * returns Job
 **/
exports.put_jobs_id = async function(body, id, accessingUser) {
    let job = null;
    try {
        job = await JobModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job.");
    }

    if (!job)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job not found.");

    if (!job.canBeEditedBy(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User is not allowed to edit job.");

    job.description = body.description;
    job.starts_at = body.starts_at;
    job.ends_at = body.ends_at;
    job.activities = body.activities;
    job.dog = body.dog;
    job.updated_at = new Date;

    try {
        await job.save();
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to update job.");
    }

    return await job.toResultFormat();
}


/**
 * Update application details
 *
 * body JobApplication Update the application details (optional)
 * id String 
 * returns List
 **/
exports.update_job_application = async function(body, id, accessingUser) {
    let jobApplication = null;
    try {
        jobApplication = await JobApplicationModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve job application.");
    }

    if (!jobApplication)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "Job application not found.");

    if (!jobApplication.canBeEditedBy(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to delete.");

    jobApplication.status = body.status;

    try {
        await jobApplication.save();
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to update job.");
    }

    return jobApplication.toResultFormat();
}

