const express = require("express")
const router = express.Router()

//Importando mongoose
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

// Rota principal para o painel adm
router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de Posts")
})

router.get("/categorias", (req, res) =>{
    Categoria.find().sort({date: "desc"}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) => {
    
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido"})
    }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }
    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', "Categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

// Rota para editar categorias (ADICIONADO O LEAN)
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    }))
})

router.post("/categorias/edit", eAdmin, (req, res) =>{
 
Categoria.findOne({_id: req.body.id}).then((categoria) => {

    categoria.nome = req.body.nome
    categoria.slug = req.body.slug

    categoria.save().then((categoria) => {
        req.flash("success_msg", "Categoria criada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao salvar a categoria")
        res.redirect("/admin/categorias")
    })


}).catch((err) => {
    req.flash("error_msg", "Houve um erro ao editar a categoria!")
    res.redirect("/admin/categorias")
})

})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

//Postagem

router.get("/postagens", (req, res) => {

    Postagem.find().populate("categoria").sort({data: "desc"}).lean(true).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao Listar as Postagens")
        res.redirect("/admin")
       
    })

})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().sort({name: "DESC"}).lean(true).then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar o formulario")
        res.redirect("/admin")
    })
   
})

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []

    if(req.body.categoria == "0")
        erros.push({texto: "Categoria inválida, registre uma categoria"})

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }
})


router.get("/postagens/edit/:id", eAdmin, (req,res) =>{

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) =>{

        Categoria.find().lean(true).then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem}) 
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar o fomulário de edição")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar o fomulário de edição")
        res.redirect("/admin/postagens")
    })
   
})

router.post("/postagem/edit", eAdmin, (req, res) => {

    Postagem.findOne({_id: req.body.id}).then((postagem) =>{

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar a edição")
                res.redirect("/admin/postagens")
            })

    }).catch((err) => {  
      //PARA PRINTAR O ERRO  console.log(err)      
        req.flash("error_msg", "Erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })

})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
Postagem.deleteOne({id: req.body.id}).then(() =>{
    req.flash("success_msg", "POSTAGEM EXCLUÍDA COM SUCESSO")
    res.redirect("/admin/postagens")
        }).catch((err) => {  
                  //  console.log(error)      
                    req.flash("error_msg", "Erro ao salvar a edição")
                    res.redirect("/admin/postagens")
  })

})

module.exports = router