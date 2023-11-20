import pg from "pg";
const { Pool } = pg;

export default class Database {
  retryConnectionTimes = 3;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432"),
      max: 25,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 10000,
    });
  }

  async connect() {
    try {
      console.info(`Connecting to db ${process.env.DB_NAME}`);
      await this.pool.connect();
      console.info(`Connected  to db ${process.env.DB_NAME}`);
      console.info(`Creating table "pessoas" if not exists`);
      await this.createDatabase();
      return this;
    } catch (error) {
      if (this.retryConnectionTimes > 0) {
        this.retryConnectionTimes--;
        setTimeout(() => {
          this.connect();
          console.error(
            `An error occured when connecting retrying connection on 3 secs. Error: ${error}`
          );
        }, 3000);
        return;
      }
      throw new Error(
        `Failed to connect to database: ${process.env.POSTGRES_DB}`
      );
    }
  }

  async createDatabase() {
    return this.pool.query(`
          CREATE EXTENSION IF NOT EXISTS pg_trgm;
  
          CREATE OR REPLACE FUNCTION generate_searchable(_nome VARCHAR, _apelido VARCHAR, _stack JSON)
              RETURNS TEXT AS $$
              BEGIN
              RETURN _nome || _apelido || _stack;
              END;
          $$ LANGUAGE plpgsql IMMUTABLE;
  
          CREATE TABLE IF NOT EXISTS pessoas (
              id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
              apelido TEXT UNIQUE NOT NULL,
              nome TEXT NOT NULL,
              nascimento DATE NOT NULL,
              stack JSON,
              searchable text GENERATED ALWAYS AS (generate_searchable(nome, apelido, stack)) STORED
          );
  
          CREATE INDEX IF NOT EXISTS idx_pessoas_searchable ON public.pessoas USING gist (searchable public.gist_trgm_ops (siglen='64'));
  
          CREATE UNIQUE INDEX IF NOT EXISTS pessoas_apelido_index ON public.pessoas USING btree (apelido);
        `);
  }

  async query(query, value) {
    if(value) {
      return this.pool.query(query, value);
    }

    return this.pool.query(query);
  }
}
