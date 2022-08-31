const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/phonebook");
const App = express();
App.use(express.static("build"));
App.use(cors());
App.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

App.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      console.log("the result is", result);
      res.send(result);
    })
    .catch((error) => next(error));
});

App.put("/api/persons/:id", (request, res, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true },
    { new: true, runValidators: true, context: "query" } /*for validation*/
  )
    .then((updatedNote) => {
      updatedNote !== null ? res.send(updatedNote) : res.send("error");
    })
    .catch((error) => next(error));
});

App.get("/info", (req, res) => {
  let today = new Date();
  res.setHeader("content-type", "text/plain");
  res.send(`Phonebook has info for ${Person.length} people
${today}`);
});

App.get("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id); //the req.params.id is in string format and is handled by  Person.findById(req.params.id)
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

App.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

App.post(
  "/api/persons",
  morgan(":method :url :status :response-time ms :body"),
  (req, res, next) => {
    let myIncomingData = req.body;
    myIncomingData.id = Math.floor(Math.random() * 60);
    console.log(myIncomingData.id);
    if (!req.body.name || !req.body.number) {
      res.json({ error: "content missing" });
    } else {
      Person.find({ name: myIncomingData.name }).then((result) => {
        if (result.length === 1) {
          res.send("name must be unique");
        } else {
          const person = new Person({
            name: myIncomingData.name,
            number: myIncomingData.number,
            id: myIncomingData.id,
          });
          person
            .save()
            .then((result) => {
              console.log(result);
              res.send(result);
            })
            .catch((error) => next(error));
        }
      });
    }
  }
);
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log("error handler enterd");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("validation entered");
    return response.status(400).json({ error: error.message });
  }
};

App.use(errorHandler);

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
