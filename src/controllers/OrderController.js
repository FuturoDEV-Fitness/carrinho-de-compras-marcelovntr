const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "1234",
  database: "lab_commerce",
});

class OrderController {
  async criar(request, response) {

    try {
      const dados = request.body;
 
      const precos = await Promise.all(dados.products.map(async (item) => {
        const produtoAtual = await conexao.query(
            `SELECT price FROM products where id = $1`,
            [item.product_id] 
        );
        return produtoAtual.rows[0].price * item.amount;
    }));

    const total = precos.reduce((acc, atual) => acc + atual, 0);



      const pedidoEfetuado = await conexao.query(
        `INSERT INTO orders (client_id, address, observations, total)
      VALUES($1, $2, $3, $4) returning*`,
        [dados.client_id, dados.address, dados.observations, total] //< mudar p/ valor genérico para testar
      );

  await Promise.all(dados.products.map(async (item) => {
    const produtoAtual = await conexao.query(
      `SELECT price FROM products WHERE id = $1`,
      [item.product_id]
    );
      await conexao.query(
          `INSERT INTO orders_items (orders_id, products_id, amount, price)
  VALUES($1, $2, $3, $4) returning*`,
          [
            pedidoEfetuado.rows[0].id,
            item.product_id,
            item.amount,
            produtoAtual.rows[0].price, //MUDAR PRA TOTAL!!! e mudar para pedidoEfetuado.total OU só total(?)
          ]
        );
      
    } ))
    
    response.status(201).json({mensagem: "Pedido realizado!", total: pedidoEfetuado.rows[0].total})
  }catch (error) {
      response.status(400).json({mensagem: "Erro ao criar pedido!"})
    }

  }
}

module.exports = new OrderController();
