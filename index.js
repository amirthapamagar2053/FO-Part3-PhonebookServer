const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const { text, response, json } = require("express");
const App = express();

App.use(cors());
App.use(express.static("build"));
App.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

App.get("/api/persons", (req, res) => {
  res.send(persons);
});

App.get("/info", (req, res) => {
  let today = new Date();
  res.setHeader("content-type", "text/plain");
  res.send(`Phonebook has info for ${persons.length} people
${today}`);
});

App.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const currentid = persons.find((x) => x.id === id);
  if (currentid) res.send(currentid);
  else res.status(404).send("404 Not Found");
});

App.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((x) => x.id !== id);
});

App.post(
  "/api/persons",
  morgan(":method :url :status :response-time ms :body"),
  (req, res) => {
    let myIncomingData = req.body;
    myIncomingData.id = Math.floor(Math.random() * 60);

    if (
      myIncomingData.number === undefined ||
      myIncomingData.name === undefined ||
      persons.map((x) => x.name).includes(myIncomingData.name)
    )
      res.send({ error: "name must be unique" });
    else {
      persons.push(myIncomingData);
      res.status(201).json(myIncomingData);
    }
  }
);
const PORT = process.env.PORT || 3001;

App.listen(PORT, () => console.log(`starting the dev server on ${PORT}`));