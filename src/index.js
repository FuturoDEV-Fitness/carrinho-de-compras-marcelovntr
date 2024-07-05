const express = require('express')
const { Pool } = require("pg")
const clientsRoutes = require('./routes/clients.routes')
const productsRoutes = require('./routes/products.routes')

const app = express()
app.use(express.json())



  app.use('/clients', clientsRoutes)
  app.use('/products', productsRoutes)
 

const conexao = new Pool({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "1234",
    database: "lab_commerce",
  });
  

app.listen(3000, () => {
    console.log("Servidor OnLine!");
  });