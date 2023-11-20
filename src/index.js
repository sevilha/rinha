import dotenv from "dotenv";
import express from "express";
import PessoaFactory from "./factory/pessoaFactory.mjs";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/test", (req, res) => {
  res.send("hello world");
});

app.post("/pessoas", async (req, res) => {
  const pessoas = req.body;
  const pessoaFactory = await PessoaFactory.createInstace();
  const inserted = await pessoaFactory.insert(pessoas);
  console.log("Inserted ", inserted);
  if (!inserted) {
    res.status(422);
    res.send();
    return;
  }
  res.status(200);
  res.send(inserted);
});

app.get("/pessoas/:id", async (req, res) => {
  const pessoaFactory = await PessoaFactory.createInstace();
  const id = req.params.id;
  const pessoa = await pessoaFactory.findById(id);
  res.send(pessoa);
});

app.get("/pessoas", async (req, res) => {
  const pessoaFactory = await PessoaFactory.createInstace();
  const term = req.query.t;
  if (term) {
    const pessoa = await pessoaFactory.findByTerm(term);
    res.send(pessoa);
    return;
  } else {
    const pessoas = await pessoaFactory.find();
    res.send(pessoas);
  }
});

app.get("/contagem-pessoas", async (req, res) => {
  const pessoaFactory = await PessoaFactory.createInstace();
  const count = await pessoaFactory.find().length;
  res.send(count);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
