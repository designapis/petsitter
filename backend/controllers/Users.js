'use strict';

const utils = require('../utils/writer.js');
const Users = require('../service/UsersService');

function getId(id, accessingUser) {
  if (id == '@me')
    // Convert shorthand ID to user
    return accessingUser._id;
  else
    // Use as-is
    return id;
}

module.exports.delete_users_id = function delete_users_id (req, res, next, id) {
  Users.delete_users_id(getId(id, req.user), req.user)
    .then(function () {
      res.status(204).end("");
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.get_users_id = function get_users_id (req, res, next, id) {
  Users.get_users_id(getId(id, req.user), req.user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.post_users = function post_users (req, res, next, body) {
  Users.post_users(body)
    .then(function (response) {
      res.set("Location", "/users/" + response._id);
      res.status(201);
      res.end("");      
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};

module.exports.put_users_id = function put_users_id (req, res, next, body, id) {
  Users.put_users_id(body, getId(id, req.user), req.user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (problem) {
      problem.toResponse(res);
    });
};
