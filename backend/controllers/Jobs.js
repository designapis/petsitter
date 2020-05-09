'use strict';

var utils = require('../utils/writer.js');
var Jobs = require('../service/JobsService');

function getUserId(id, accessingUser) {
  if (id == '@me')
    // Convert shorthand ID to user
    return accessingUser._id;
  else
    // Use as-is
    return id;
}

module.exports.create_job_application = function create_job_application (req, res, next, body, id) {
  Jobs.create_job_application(body, id, req.user)
    .then(function (response) {
      res.set("Location", "/jobs/" + id + "/applications/" + response._id);
      res.status(201);
      res.end("");
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.delete_job_application = function delete_job_application (req, res, next, id) {
  Jobs.delete_job_application(id, req.user)
    .then(function () {
      res.status(204).end("");
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.delete_jobs_id = function delete_jobs_id (req, res, next, id) {
  Jobs.delete_jobs_id(id, req.user)
    .then(function () {
      res.status(204).end("");
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_applications_by_job_id = function get_applications_by_job_id (req, res, next, id) {
  Jobs.get_applications_by_job_id(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_job_applications_for_user = function get_job_applications_for_user (req, res, next, id) {
  Jobs.get_job_applications_for_user(getUserId(id, req.user))
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_jobs = function get_jobs (req, res, next, limit, offset) {
  Jobs.get_jobs(limit, offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_jobs_for_user = function get_jobs_for_user (req, res, next, id) {
  Jobs.get_jobs_for_user(getUserId(id, req.user))
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_jobs_id = function get_jobs_id (req, res, next, id) {
  Jobs.get_jobs_id(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.post_jobs = function post_jobs (req, res, next, body) {
  Jobs.post_jobs(body, req.user)
    .then(function (response) {
      res.set("Location", "/jobs/" + response._id);
      res.status(201);
      res.end("");
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.put_jobs_id = function put_jobs_id (req, res, next, body, id) {
  Jobs.put_jobs_id(body, id, req.user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.update_job_application = function update_job_application (req, res, next, body, id) {
  Jobs.update_job_application(body, id, req.user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};
