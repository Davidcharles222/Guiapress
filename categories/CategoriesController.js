const slugify = require("slugify");
const express = require("express");
const router = express.Router();
const Category = require("./Category");

router.get("/admin/categories/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/new", {
            categories: categories
        })
    })
});

router.post("/categories/save", (req, res) => {
    var title = req.body.title
    if(title !== ''){
        
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {
            categories: categories
        })
    })
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=> {
                res.redirect("/admin/categories")
            })
        }else{ // NÃO FOR UM NÚMERO
            res.redirect("/admin/categories")
        }
    }else{// NULL
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category => {
        if(category != ""){
            res.render("admin/categories/edit", {
                category: category
            })
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", (req, res) => {
    var title = req.body.title
    var id = req.body.id

    Category.update({title: title, slug: slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router;