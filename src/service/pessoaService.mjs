import { v4 as uuid4 } from "uuid";

export default class PessoaService {
  constructor({ pessoaRepository }) {
    this.pessoaRepository = pessoaRepository;
  }

  async find() {
    return this.pessoaRepository.find();
  }

  async findById(id) {
    return this.pessoaRepository.findById(id);
  }

  async findByApelido(apelido) {
    return this.pessoaRepository.findByApelido(apelido);
  }

  async findByTerm(term) {
    return this.pessoaRepository.findByTerm(term);
  }

  async insert(pessoas) {
    return pessoas.map(async (pessoa) => {
      let { apelido, nome, nascimento, stack } = pessoa;
      if (apelido === null || apelido.length > 32) {
        return null;
      }
      if (nome === null || typeof nome !== "string" || nome.length > 100) {
        return null;
      }
      if (
        typeof nascimento !== "string" ||
        !!isNaN(parseInt(nascimento, "yyyy-MM-dd", new Date()))
      ) {
        return null;
      }
      const apelidoExists = await this.findByApelido(apelido);

      if (apelidoExists && apelidoExists.length > 0) {
        return null;
      }

      if (stack === undefined || stack === null || !Array.isArray(stack)) {
        stack = [];
      }
      stack = stack.filter(
        (s) => typeof s === "string" && s.length <= 32 && s.length > 0
      );
      
      const values = [
        uuid4(),
        apelido,
        nome,
        new Date(nascimento),
        JSON.stringify(stack),
      ];
      const rows = await this.pessoaRepository.insert(values);
      console.log("rows", rows);
      return rows
    });
  }
}
