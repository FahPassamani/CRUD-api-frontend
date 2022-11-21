const { response } = require('express')
var Userdb = require('../model/model')

//Create
exports.create = (req, res) => {
    if(!req.body){
        res.status(400).send({message:"Não pode ser vazio"})
        return
    }

    const user = new Userdb({
        name: req.body.name,
        cpf: req.body.cpf,
        email: req.body.email,
        tel: req.body.tel
    })

    //Save
    user.save(user).then(data => {
        //res.send(data)
        res.redirect('/api')
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algum erro ocorreu na operaçao de criaçao"
        })
    })
}

//Return all/single
exports.find = (req, res) => {

    if(req.query.id){
        const id = req.query.id

        Userdb.findById(id).then(data => {
            if(!data){
                res.status(404).send({message: "Usuario nao encontrado com o nome" + name})
            }else{
                res.send(data)
            }
        }).catch(err => {
            res.status(500).send({message: "Erro"})
        })
    }else{
        Userdb.find().then(user => {
            res.send(user)
        }).catch(err => {
            res.status(500).send({message: err.message || "Ocorreu um erro ao buscar informação"})
        })
    }
}

//Update
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({message: "Não pode ser vazio"})
    }

    const name = req.params.name
    Userdb.findOneAndUpdate(name, req.body).then(data => {
        if(!data){
            res.status(404).send({message: `Não pode atualizar o usuario ${name}. Usuário não encontrado`})
        }else{
            res.send(data)
        }
    }).catch(err => {
        res.status(500).send({message: "Erro ao fazer Update"})
    })
}

//Delete
exports.delete = (req, res) => {
    const name = req.params.name
    Userdb.findOneAndDelete(name).then(data => {
        if(!data){
            res.status(404).send({message: `Não pode deletar o usuario ${name}. Algo esta errado`})
        }else{
            res.send({message: "Usuario excluido com sucesso!"})
        }
    }).catch(err => {
        res.status(500).send({message: "Não foi possivel excluir o usuario"})
    })
}