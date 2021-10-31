require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const Contact = require('./models/contacts');

morgan.token('reqbody', (req, res) => JSON.stringify(req.body));

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] - :reqbody',
  ),
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get('/info', (request, response) => {
  const date = new Date();
  Contact.find({}).then((result) => {
    response.send(
      `<p>Phonebook has info for ${result.length} people <br> <br>
            ${date}`,
    );
  });
});

// Get all persons

app.get('/api/persons', (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

// Get one person

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Delete one person

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      if (result) {
        console.log(result);
        response.status(204).end();
      } else {
        console.log(result);
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Add person

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const contact = new Contact({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

// Update contact
app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, {
    new: true,
    runValidators: true,
  })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
