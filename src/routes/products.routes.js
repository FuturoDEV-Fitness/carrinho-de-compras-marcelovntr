const { Router } = require("express")
const ProductController = require("../controllers/ProductController")

const productsRoutes = new Router()

productsRoutes.post("/", ProductController.criar)
productsRoutes.get("/", ProductController.listarTodos)
productsRoutes.get("/:id", ProductController.listarUmDetalhado)
productsRoutes.put("/", ProductController.atualizar)
productsRoutes.delete("/", ProductController.apagar)


module.exports = productsRoutes