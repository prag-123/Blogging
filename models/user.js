const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {generateHmacSignature} = require('../utils/crypto');
const { randomBytes } = require('node:crypto');

const userSchema = new Schema({
    fullname : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
        unique:true
    },  
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user',
        enum:['user', 'admin']
    },
    profilePicture: {
        type: String,
        default: '/default.jpg'
    }
}, { timestamps: true });

// Middleware to hash password before saving
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString('hex');
    user.salt = salt;
    user.password = generateHmacSignature(user.password, salt);
    next(); 
});

//db ->salt ->user.password

const User = mongoose.model('User', userSchema);

module.exports = User;