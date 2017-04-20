'use strict';

let mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  SALT_WORK_FACTOR = 10;

let AdminSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  email: {type: String, index: {unique: true}},
  password: {type: String, select: false}
});

//presave for admin model
AdminSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      }
    );
  });
});

//compare password
AdminSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Admin', AdminSchema);