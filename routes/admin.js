const express = require("express")
const router = express.Router()

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

module.exports = router