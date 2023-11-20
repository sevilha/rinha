export default class PessoaRepository {
  constructor({ dbConnection }) {
    this.dbConnection = dbConnection;
  }

  async find() {
    const { rows } = await this.dbConnection.query(`SELECT * FROM pessoas`);
    return rows;
  }

  async findById(id) {
    return await this.dbConnection.query(
      `SELECT * FROM pessoas WHERE id = $1;`,
      [id]
    );
  }

  async findByApelido(apelido) {
    const { rows } = await this.dbConnection.query(
      `SELECT * FROM pessoas WHERE apelido = $1;`,
      [apelido]
    );
    return rows || [];
  }

  async findByTerm(term) {
    const { rows } = await this.dbConnection.query(
      `SELECT * FROM pessoas WHERE searchable ILIKE $1 LIMIT 50;`,
      [`%${term}%`]
    );
    return rows;
  }

  async insert(values) {
    const { rows } = await this.dbConnection.query(
      `INSERT INTO pessoas (id, apelido, nome, nascimento, stack) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      values
    );
    return rows;
  }
}
