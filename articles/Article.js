const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category")
const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    categoriaId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})
Category.hasMany(Article);//Uma categoraia tem muitos artigos
Article.belongsTo(Category);//Um artigo pertence a uma categoria

module.exports = Article;