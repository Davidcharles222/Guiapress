const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");//somente logado consigo entrar nas rotas listadas

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]//consigo acessar lista de categorias >> pela relacionamento criado
    }).then(articles => {
        res.render("admin/articles/index", {
            articles: articles
        })
    })
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {
            categories: categories
        })
    })
});

router.post("/articles/save",adminAuth,(req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoriaId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete",adminAuth, (req, res) => {
    var id = req.body.id
    if(id != 'undefined'){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id: id
                }
            }).then(()=> {
                res.redirect("/admin/articles")
            })
        }else{ // NÃO FOR UM NÚMERO
            res.redirect("/admin/articles")
        }
    }else{// NULL
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id",adminAuth, (req, res) => {
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/")
    }

    Article.findByPk(id).then(article => {
        if(article != ""){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                })
            })
        }else{
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
    })
})

router.post("/articles/update",adminAuth, (req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category
    var id = req.body.id

    Article.update({title: title, body: body,categoriaId: category, slug: slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(() => {
        res.redirect("/")
    })
})

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 1
    }else{
        offset = parseInt(page) * 3
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset, // quantas vzs quero apareça na pagina
        order: [
            ["id","DESC"]
        ]
    }).then(articles => {

        var next
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        
        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{
                result: result,
                categories: categories
            })
        })

    })

})


module.exports = router;