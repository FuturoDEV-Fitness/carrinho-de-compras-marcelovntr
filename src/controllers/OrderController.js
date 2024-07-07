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
      /*
   "client_id": ""
   "adress": ""
   "obeservations": ""
   "products": [
      {
          "product_id": ""
          "amount": ""
          }
   ]
  body JÁ VEM COM QUASE TODAS INFORMAÇÕES, FALTA O TOTAAAAAAL 
  ---em vez de inserir o total diretamente: chave produto com array de objetos contendo os produtos
  */
  
      let total = 0;
      dados.products.forEach(async (item) => {
        const produtoAtual = await conexao.query(
          `SELECT price from products
          where id = $1`,
          [item.product_id] // <-- NÃO SERIA SÓ ID???????????????????????????????
        );
        total = total + produtoAtual.rows[0].price * item.amount;
        console.log(total);
      });
  
      const pedidoEfetuado = await conexao.query(
        `INSERT INTO orders (client_id, address, observations, total)
      VALUES($1, $2, $3, $4) returning*`,
        [dados.client_id, dados.address, dados.observations, total] //< mudar p/ valor genérico para testar
      );
  
      dados.products.forEach(async (items) => {
        //esta query foi added só para testar pq o foreach seria necessário
        const produtoAtual = await conexao.query(
          `SELECT price from products
          where id = $1`,
          [items.product_id] // <-- NÃO SERIA SÓ ID???????????????????????????????
        );
        //esta acima deste comentário
  
        conexao.query(
          `INSERT INTO orders_items (orders_id, products_id, amount, price)
  VALUES($1, $2, $3, $4) returning*`,
          [
            pedidoEfetuado.rows[0].id,
            items.product_id,
            items.amount,
            produtoAtual.rows[0].price,
          ]
        );
      });
    } 
    
    catch (error) {
      response.status(400).json({mensagem: "Erro ao criar pedido!"})
    }

  }
}

module.exports = new OrderController();
