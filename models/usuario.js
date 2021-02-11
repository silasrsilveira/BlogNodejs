const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    // Campo 0 Não é admin 1 é admin
    eAdmin: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        require: true
    },
})



mongoose.model("usuarios", Usuario)