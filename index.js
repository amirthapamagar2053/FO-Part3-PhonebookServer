const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/phonebook");
const App = express();
App.use(express.static("build"));
App.use(cors());
App.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

App.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    console.log("the result is", result);
    res.send(result);
  });
});

App.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  console.log("the person is", person);
  console.log(request.params.id);

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNote) => {
      console.log(updatedNote);
      response.send(updatedNote);
    })
    .catch((error) => next(error));
});

App.get("/info", (req, res) => {
  let today = new Date();
  res.setHeader("content-type", "text/plain");
  res.send(`Phonebook has info for ${Person.length} people
${today}`);
});

App.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

App.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id).then((result) => {
    res.status(204).end();
  });
});

App.post(
  "/api/persons",
  morgan(":method :url :status :response-time ms :body"),
  (req, res) => {
    console.log(req.body);
    let myIncomingData = req.body;
    myIncomingData.id = Math.floor(Math.random() * 60);
    Person.find({ name: myIncomingData.name }).then((result) => {
      if (result.length === 1) {
        res.json({ error: "name must be unique" });
      } else {
        console.log("the else entered");
        const person = new Person({
          name: myIncomingData.name,
          number: myIncomingData.number,
          id: myIncomingData.id,
        });
        person.save().then((result) => {
          console.log(result);
          res.send(result);
        });
      }
    });
  }
);

const PORT = process.env.PORT || 3001;

App.listen(PORT, () => console.log(`starting the dev server on ${PORT}`));

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];
