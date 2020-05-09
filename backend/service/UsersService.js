'use strict';

const mongoose = require('mongoose');
const problem = require('../utils/problem');
const UserModel = mongoose.model('User', require('../models/User').User);

/**
 * Delete User Account
 *
 * id String 
 * no response value expected for this operation
 **/
exports.delete_users_id = async function(id, accessingUser) {
    let user = null;

    try {
        user = await UserModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve user.");
    }

    if (!user)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "User not found.");

    if (!user.grantsAccessTo(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to delete.");
    
    try {
        await UserModel.deleteOne(user);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to delete user.");
    }
}


/**
 * Get User Information
 *
 * id String 
 * returns User
 **/
exports.get_users_id = async function(id, accessingUser) {
    let user = null;

    try {
        user = await UserModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve user.");
    }

    if (!user)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "User not found.");

    if (!user.grantsAccessTo(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to access.");

    return user.toResultFormat();
}


/**
 * Register User Account
 *
 * body User  (optional)
 * returns User
 **/
exports.post_users = async function(body) {
    try {
        body.created_at = new Date;
        body.updated_at = new Date;
        const user = new UserModel(body);
        await user.save();
        return user;
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to create user!");
    }
}


/**
 * Update User Account
 *
 * body User  (optional)
 * id String 
 * returns User
 **/
exports.put_users_id = async function(body, id, accessingUser) {
    let user = null;
    try {
        user = await UserModel.findById(id);
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to retrieve user.");
    }
        
    if (!user)
        throw new problem.Problem(problem.E_NOT_FOUND,
            "User not found.");

    if (!user.grantsAccessTo(accessingUser))
        throw new problem.Problem(problem.E_FORBIDDEN,
            "User does not have permission to update.");

    user.email = body.email;
    user.full_name = body.full_name;
    user.roles = body.roles;
    user.updated_at = new Date;

    try {
        await user.save();        
    } catch (error) {
        throw new problem.Problem(problem.E_SERVER_FAULT,
            "Failed to update user.");
    }

    return user.toResultFormat();
}