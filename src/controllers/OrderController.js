const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "1234",
  database: "lab_commerce",
});

class OrderController{

async criar(request, response){
const dados = request.body
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
---em vez de inserir o tal diretamente: chave produto com array de objetos contendo os produtos
*/


let total = 0
dados.products.forEach(async (item) => {
    const produtoAtual = await conexao.query(
        `SELECT price from products
        where id = $1`,
        [item.product_id] // <-- NÃO SERIA SÓ ID???????????????????????????????
    )
    total = total + (produtoAtual.rows[0].price * item.amount)
    console.log(total)
});


}

}

module.exports = new OrderController()