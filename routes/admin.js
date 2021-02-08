const express = require("express")
const router = express.Router()

//Importando mongoose
const mongoose = require("mongoose")
require ("../models/Categoria")
const Categoria = mongoose.model("categorias")

// Rota principal para o painel adm
router.get('/',(req, res) => {
    res.render("admin/index")
})

router.get('/posts',(req, res) => {
    res.send("Página de Posts")
})

router.get("/categorias",(req, res) =>{
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria salva com sucesso");
    }).catch((err) =>{
        console.log("Erro ao salvar categoria"+err);
    })

})

module.exports = router