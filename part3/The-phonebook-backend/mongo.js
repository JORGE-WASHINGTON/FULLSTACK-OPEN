const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.gwznd.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date(),
  });

  contact.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 4) {
  console.log("Please provide name and number");
  mongoose.connection.close();
} else if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}
