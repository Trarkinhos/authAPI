const routes = require('express').Router();
const Users = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

authRoutes = (req, res, next) => {

    const tokenHeader = req.headers['authorization']
    const token = tokenHeader && tokenHeader.split(' ')[1]

    if(!token){
        return res.status(500).json({ error: 'Token inválido' })
    }

    try {
        const secret = process.env.SECRET
        
        jwt.verify(token, secret)

        next()
    }
    catch(err) {
        res.status(500).json({ error: 'Token não encontrado' })
    }
}

routes.get('/', authRoutes, (req, res) => {
    res.send('Hello world!')
})

routes.post('/register', async (req, res) => {

    const { nome, email, senha, confirmar } = req.body

    if(!nome) return res.status(400).json({ error: 'Campo (nome) obrigatório' })
    if(!email) return res.status(400).json({ error: 'Campo (email) obrigatório' })
    if(!senha) return res.status(400).json({ error: 'Campo (senha) obrigatório' })
    if(!confirmar) return res.status(400).json({ error: 'Campo (confirmar) obrigatório' })

    if(confirmar !== senha) return res.status(400).json({ error: 'Os campos (senha) e (confirmar) precisam ser iguais' })

    const verificarEmail = await Users.findOne({ email: email })
    if(verificarEmail) return res.status(400).json({ error: 'Já existe um email igual a esse cadastrado, tente outro' })

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(senha, salt)

    const newUser = {
        nome, email, senha: hash
    }

    try {
        await Users.create(newUser)
        res.status(200).json({ sucess: 'Usuário foi cadastrado com sucesso!' })
    }
    catch (err) {
        res.status(500).json({ error: 'Houve um problemo com banco de dados, tente mais tarde'})
    }

})

routes.post('/login', async (req, res) => {

    const { email, senha } = req.body

    if(!email) return res.status(400).json({ error: 'Campo (email) obrigatório' })
    if(!senha) return res.status(400).json({ error: 'Campo (senha) obrigatório' })

    const dadosUser = await Users.findOne({ email: email })
    if(!dadosUser) return res.status(400).json({ error: 'Usuário não encontrado' })

    const validarSenha = await bcrypt.compare(senha, dadosUser.senha)
    if(!validarSenha) return res.status(400).json({ error: 'Senha incorreta' })

    try {
        
        const secret = process.env.SECRET
        const token = jwt.sign({
           id: dadosUser._id 
        }, secret)

        res.status(200).json({ sucess: 'Token cadastrado com sucesso!', token })
    }
    catch(err) {
        res.status(500).json({ error: 'Houve um erro com o banco de dados, tente mais tarde' })
    }

})

module.exports = routes;