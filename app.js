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
                res.locals.success_msg = req.flash("sucess_msg")
                res.locals.error_msg = req.flash("error_msg")
    next()
})


    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');

// Mongoose
        mongoose.connect("mongodb://localhost/blogapp").then(()=> {
            console.log("Conectado ao mongo");
        }).catch((err)=>{
            console.log("Erro ao se conectar"+err);
        })
    
// Public
        app.use(express.static(path.join(__dirname,"public")))


// Rotas
app.get('/', (req, res) =>{
    res.send('Rota Principal')
})
    app.get('/posts', (req, res) =>{
        res.send("Lista de Posts")
})

app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, ()=> {
    console.log("Servidor Ligado!");
})
