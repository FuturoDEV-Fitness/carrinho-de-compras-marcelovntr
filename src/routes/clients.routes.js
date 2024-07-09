const { Router } = require("express");
const ClientController = require("../controllers/ClientController")


const clientsRoutes = new Router();


clientsRoutes.post("/", ClientController.criar);
clientsRoutes.get("/", ClientController.listar)
clientsRoutes.put("/", ClientController.atualizar)
clientsRoutes.delete("/", ClientController.apagar)

module.exports = clientsRoutes;
