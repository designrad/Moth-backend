'use strict';

let mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

let UserSchema = mongoose.Schema({
    name: {type: String},
    mail: {type: String, index: {unique: true}},
    password: {type: String, select: false}
});

UserSchema.pre('save', function(next) {
    let user = this;
// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

// generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            }
        );
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);