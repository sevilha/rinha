import Database from "../db/database.js";
import PessoaRepository from "../repository/pessoaRepository.mjs";
import PessoaService from "../service/pessoaService.mjs";

export default class PessoaFactory {
  static async createInstace() {
    const db = new Database();
    const connection = await db.connect();
    const repository = new PessoaRepository({ dbConnection: connection });
    const service = new PessoaService({ pessoaRepository: repository });

    return service;
  }
}
