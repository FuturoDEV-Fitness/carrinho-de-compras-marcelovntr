const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "1234",
  database: "lab_commerce",
});

class ProductController {
  async criar(request, response) {
    try {
      const dados = request.body;

      if (!dados.name || !dados.category_id) {
        return response.json({
          mensagem: "nome e identificador da categoria são obrigatórios!",
        });
      }

     const produtoInserido = await conexao.query(
        `INSERT INTO products (name, amount, color, voltage, description, category_id)
        VALUES($1, $2, $3, $4, $5, $6) returning*`,
        [
          dados.name,
          dados.amount,
          dados.color,
          dados.voltage,
          dados.description,
          dados.category_id
        ]
      );
      response.status(201).json(produtoInserido.rows[0])
    } catch (error) {
      response
      .status(400)
      .json({ mensagem: "Erro inesperado ao cadastrar produto!" });
    }
   
  }

  async listarTodos(request, response) {
    try {
      const requisicaoProdutos = request.query

if(requisicaoProdutos.procura){
const listaFiltrada = await conexao.query(
`SELECT * FROM products
where name ilike $1 OR color ilike $1 OR description ilike $1`,
[`%${requisicaoProdutos.procura}%`]
)
response.json(listaFiltrada.rows)
}
else{
  const listaCompleta = await conexao.query(
    `SELECT * FROM products`
  )
  response.json(listaCompleta.rows)
}

    } catch (error) {
      response.status(404).json({mensagem:"Erro ao listar produtos!"})
    }
  }

  async atualizar(request, response) {}

  async apagar(request, response) {}
}

module.exports = new ProductController();
