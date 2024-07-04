const {Pool} = require("pg")

const conexao = new Pool({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "1234",
    database: "lab_commerce",
  });

  class ProductController{

    async criar(request, response){
        const dados = request.body
    }

    async listar(request, response){

    }

    async atualizar(request, response){

    }

    async apagar(request, response){
      
    }
  }

  module.exports = new ProductController()