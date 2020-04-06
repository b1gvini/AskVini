const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")


/**
 * <=% %> atribuir variável no html
 * <% if(condicional){%> condicionais
   <%}%>
 *
 <% produtos.forEach(function(produto){ %>
        <%= produto.nome %>
        <%= produto.preco %>
    <% }) %>

*/

//database

connection
    .authenticate()
    .then(() =>{
        console.log("Conexão com banco de Dados SUCESSO")
    }) 
    .catch((msgErro)=>{
        console.log(msgErro)
    })
//engine

app.set('view engine', 'ejs') //definindo engine para renderizar o HTML
app.use(express.static('public')) // definindo arquivos estaticos (css, server)

//bodyParser

app.use(bodyParser.urlencoded({extends: false}))
app.use(bodyParser.json())

//Rotas

app.get("/",(req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas => {
        res.render("index",{
            perguntas:perguntas
        })
    })
    
})

app.get("/perguntar",(req,res)=>{

    res.render("perguntar")
})

app.post("/salvar",(req,res)=>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id','DESC']]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas: respostas
                }) 
            })
        }else{
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.listen(3000,()=>{
    console.log("App Rodando")
})