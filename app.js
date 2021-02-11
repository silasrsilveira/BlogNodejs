//Carregando módulos

    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path');
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

// Configurações
    //Sessão
        app.use(session({
            secret: "blogappnodejs",
            resave: true,
            saveUninitialized: true
        }))

// Flash
        app.use(flash())
        
//Middleware (Duas variaves Globais)
        app.use((req, res, next) => {
         res.locals.success_msg = req.flash('success_msg')
         res.locals.error_msg = req.flash('error_msg')
         next()
})


// Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

// Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');

// Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp").then(()=> {
            console.log("Conectado ao mongo");
        }).catch((err)=>{
            console.log("Erro ao se conectar"+err);
        })
    
// Public
        app.use(express.static(path.join(__dirname,"public")))


// Rotas
app.get('/', (req, res) =>{
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens}) 
    }).catch((err) =>{
        req.flash("error_msg", "Erro Interno")
        res.redirect("/404")
    })
  
app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) =>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Essa postagem não Existe")
            res.redirect("/")
        }
    }).catch((err) => {
            req.flash("error_msg", "Erro Interno")
            res.redirect("/")
        })
})

app.get("/404", (req, res) => {
    res.send("Erro 404!")
})

})
app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("./categorias/index", {categorias: categorias})
            }).catch((err) => {
            req.flash("error_msg", "Erro ao listar categorias")
            res.redirect("/")
})

})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){

            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

            }).catch((err) => {
                req.flash("error_msg", "Erro ao listar os posts!")
                res.redirect("/")
            })
            
        }else{
            req.flash("error_msg", "Essa categoria não Existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar a pag desta categoria")
        res.redirect("/")
    })
})


app.use('/admin', admin)


// Outros
const PORT = 8081
app.listen(PORT, ()=> {
    console.log("Servidor Ligado!");
})

