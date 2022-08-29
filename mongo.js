const mongoose = require("mongoose");

// if (process.argv.length < 5) {
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }

const password = process.argv[2];

const url = `mongodb+srv://amirthapa:${password}@cluster0.cllc002.mongodb.net/Phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length > 3) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });

      return person.save();
    })
    .then((result) => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook
        `);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
if (process.argv.length === 3) {
  mongoose.connect(url).then((result) => {
    Person.find({}).then((result) => {
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    });
  });
}
