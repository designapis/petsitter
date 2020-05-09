'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.User = new Schema({
    email: String,
    password: String,
    full_name: String,
    created_at: Date,
    updated_at: Date,
    roles: [ String ]
});

exports.User.methods.grantsAccessTo = function (accessingUser) {
    // Users can only be viewed by themselves or admin
    return (this._id.equals(accessingUser._id)
        || accessingUser.roles.indexOf("Admin") > -1);
};

exports.User.methods.hasRole = function (role) {
    return (this.roles.indexOf(role) > -1);
};

exports.User.methods.toResultFormat = function() {
    return {
        id : this._id,
        email : this.email,
        full_name : this.full_name,
        roles : this.roles,
        created_at : this.created_at,
        updated_at : this.updated_at
    };
};