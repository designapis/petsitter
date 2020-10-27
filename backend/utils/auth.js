const base64 = require('base-64');
const problem = require('./problem');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User', require('../models/User').User);

exports.basicUserAuth = function(req, res, next) {
    if (!req.headers.hasOwnProperty('authorization')) {
        // No auth given, we assume here this is fine since OAS3 tools also
        // checks whether auth is required for a specific request
        next();
        return;
    }

    const authHeader = req.headers['authorization'].split(" ");
    if (authHeader.length != 2 || authHeader[0] != "Bearer") {
        (new problem.Problem(problem.E_BAD_REQUEST,
            "Malformed Authorization header."))
            .toResponse(res);
        return;
    }
    try {
        const credentials = base64.decode(authHeader[1]).split(":");
        if (credentials.length != 2)
            throw new Error;

        UserModel.findById(credentials[0]).then((user) => {
            if (user.password != credentials[1]) {
                (new problem.Problem(problem.E_UNAUTHORIZED,
                    "Invalid Authorization token."))
                    .toResponse(res);
                return;
            }
        
            // All is fine ...
            req.user = user;
            next();
        }).catch((e) => {
            (new problem.Problem(problem.E_UNAUTHORIZED,
                "Invalid Authorization token."))
                .toResponse(res);
            return;
        });
    } catch (e) {
        (new problem.Problem(problem.E_BAD_REQUEST,
            "Malformed Authorization token."))
            .toResponse(res);
        return;
    }    
};  