var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    email: { type: String, required: false },
    password: { type: String, required: false },
    name: { type: String },
    creationDate: { type: Date, default: Date.now },
    google: {
        id: { type: String, required: false },
        token: { type: String, required: false },
        name:  { type: String, required: false },
        email:  { type: String, required: false }
    }
});


// methods ======================
// generating a hash

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
