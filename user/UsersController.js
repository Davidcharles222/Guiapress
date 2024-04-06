const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{
            users: users
        })
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user == undefined){
            
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/")
            })

        }else{
            res.redirect("/admin/users/create")
        }
    })
})

router.get("/admin/users/edit/:id", (req, res) => {
    var id = req.params.id

    User.findByPk(id).then(user => {
        if(user != ""){
            res.render("admin/users/edit",{
                user: user
            })
        }else{
            res.redirect("/admin/users")
        }
    }).catch(err => {
        res.redirect("/admin/users")
    })
})

router.post("/users/update", (req, res) => {
    var email = req.body.email
    var id = req.body.id

    User.update({email: email}, {where: {id: id}}).then(()=>{
        res.redirect("/admin/users")
    })
})

router.post("/users/delete", (req, res) => {
    var id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where: {id: id}
            }).then(()=> {
                res.redirect("/admin/users")
            })

        }else{
            res.redirect("/admin/users")
        }
    }else{
        res.redirect("/admin/users")
    }
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {

        if(user != undefined){
            //validar senha > comparando senha atual com dbdados
            var correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }

                res.redirect("/admin/articles")

            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    }).catch(err => {
        res.redirect("/login")
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router