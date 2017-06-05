const mongoose = require( 'mongoose' );
const bcrypt = require('bcryptjs');
// prevent mpromise deprecation warning
mongoose.Promise = global.Promise;

let Account = new mongoose.Schema( {
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
} );
Account.statics = {

};
Account.methods = {
    validPassword: function( password ) {
        return bcrypt.compareSync(password, this.password);
    }
};
Account.pre('save', function(next) {
  if(this.password) {
      let salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});
Account.pre('update', function(next) {
  if(this.password) {
      let salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});
module.exports = mongoose.model( 'Account', Account );
