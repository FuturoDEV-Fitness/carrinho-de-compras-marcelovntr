const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "1234",
  database: "lab_commerce",
});

class ClientController {
  async criar(request, response) {
    try {
      const dados = request.body;

      if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
        return response.json({
          mensagem: "nome, email, CPF e contatos são dados obrigatórios!",
        });
      }

      const buscaCpfEmail = conexao.query(
        `SELECT * FROM clients 
        where email = $1 OR cpf = $2`,
        [dados.email, dados.cpf]
      );

      if (buscaCpfEmail.rows.length > 0) {
        return response.status(401).json({mensagem: "email ou CPF fornecido já cadastrado!"})
      }

      const clientSent = await conexao.query(
        `INSERT INTO clients (name, email, cpf, contact)
        VALUES(
        $1, $2, $3, $4) returning*`,
        [dados.nome, dados.email, dados.cpf, dados.contact]
      );
      response.status(201).json(clientSent.rows[0]);
    } catch (error) {
      response
        .status(500)
        .json({ mensagem: "Houve um erro inesperado no cadastro!" });
    }
  }

  async listar(request, response) {}

  async atualizar(request, response) {}

  async apagar(request, response) {}
}

module.exports = new ClientController();