const express = require("express")
const router = express.Router()

// Rota principal para o painel adm
router.get('/',(req, res) => {
    res.send("Página Principal do painel ADM")
})

router.get('/posts',(req, res) => {
    res.send("Página de Posts")
})

router.get("/categoria",(req, res) =>{
    res.send("Página de Categoria")
})


module.exports = router