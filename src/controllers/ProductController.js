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

      /****************************** VALIDAÇÕES: *************************** */

      if (!dados.name || !dados.category_id) {
        return response.json({
          mensagem: "nome e identificador da categoria são obrigatórios!",
        });
      }

      if (typeof dados.name !== "string") {
        return response.json({
          mensagem: "O nome deve ser uma string!",
        });
      }
      if (typeof dados.amount !== "number" || !Number.isInteger(dados.amount)) {
        return response.json({
          mensagem: "A quantidade deve ser um número inteiro!",
        });
      }
      if (dados.voltage !== "110" && dados.voltage !== "220") {
        return response.json({
          mensagem: "A voltagem deve ser 110 ou 220!",
        });
      }
      if (typeof dados.category_id !== "number" || !Number.isInteger(dados.category_id)) {
        return response.json({
          mensagem: "O id da categoria deve ser um número inteiro!",
        });
      }

     

      /***************************QUERIES ***************************/
      const produtoInserido = await conexao.query(
        `INSERT INTO products (name, amount, color, voltage, description, category_id, price)
        VALUES($1, $2, $3, $4, $5, $6, $7) returning*`,
        [
          dados.name,
          dados.amount,
          dados.color,
          dados.voltage,
          dados.description,
          dados.category_id,
          dados.price
        ]
      );
      response.status(201).json(produtoInserido.rows[0]);
    } catch (error) {
      response
        .status(400)
        .json({ mensagem: "Erro inesperado ao cadastrar produto!" });
    }
  }

  async listarTodos(request, response) {
    try {
      const requisicaoProdutos = request.query;

      if (requisicaoProdutos.procura) {
        const listaFiltrada = await conexao.query(
          `SELECT * FROM products
where name ilike $1 OR color ilike $1 OR description ilike $1`,
          [`%${requisicaoProdutos.procura}%`]
        );
        response.json(listaFiltrada.rows);
      } else {
        const listaCompleta = await conexao.query(`SELECT * FROM products`);
        response.json(listaCompleta.rows);
      }
    } catch (error) {
      response.status(404).json({ mensagem: "Erro ao listar produtos!" });
    }
  }

  async listarUmDetalhado(request, response) {
    try {
      const id = request.params.id;

      //MUDAR ESSA VERIFICAÇÃO!!!! tirar esse isNaN
      if (!id || isNaN(id) || id <= 0) {
        console.log("ID inválido:", id);
        return response.status(400).json({
          mensagem: "ID do produto é obrigatório e deve ser um número válido!",
        });
      }

      const produtoBuscado = await conexao.query(
        `SELECT * FROM products
  where id = $1`,
        [id]
      );

      if (produtoBuscado.rows.length === 0) {
        return response
          .status(404)
          .json({ mensagem: "O produto buscado não foi encontrado!" });
      }

      const produtoDetalhado = await conexao.query(
        `SELECT products.name AS produto, categories.name AS tipo, products.amount AS estoque, products.color AS cores, 
products.voltage AS voltagem, products.description AS descrição
FROM products
JOIN categories
ON products.category_id = categories.id
 WHERE products.id = $1`,
        [id]
      );
      //response.json(produtoBuscado.rows[0]);
      response.json(produtoDetalhado.rows[0]);
    } catch (error) {
      response
        .status(500)
        .json({ mensagem: "Erro inesperado ao buscar o produto desejado!" });
    }
  }
  async atualizar(request, response) {}

  async apagar(request, response) {}
}

module.exports = new ProductController();
