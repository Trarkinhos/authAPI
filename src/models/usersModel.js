const mongoose = require('mongoose');

const Users = mongoose.model('user', {

    nome: {
        type: String,
        uppercase: true,
        required: true
    },
    
    email: {
        type: String,
        lowercase: true,
        required: true
    },

    senha: {
        type: String,
        required: true
    }

})

module.exports = Users;