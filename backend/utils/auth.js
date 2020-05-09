const basicAuth = require('basic-auth');
const problem = require('./problem');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User', require('../models/User').User);

exports.basicUserAuth = function(req, res, next) {
    const user = basicAuth(req);

    if (!user || !user.name) {
        // No auth given, we assume here this is fine since OAS3 tools also
        // checks whether auth is required for a specific request
        next();
        return;
    }

    UserModel.find({ email : user.name }).then((results) => {
        if (results.length == 0 || results[0].password != user.pass) {
            (new problem.Problem(problem.E_UNAUTHORIZED,
                "Invalid username or password."))
                .toResponse(res);
            return;
        }

        // All is fine ...
        req.user = results[0];
        next();
    });
};  