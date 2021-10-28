import React, { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notifications from "./components/Notifications.js";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAllContacts().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilter = (e) => setNameFilter(e.target.value);

  const addContact = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const alreadyAdded = persons.filter(
      (person) => person.name.toUpperCase() === personObject.name.toUpperCase()
    );

    if (alreadyAdded.length === 1) {
      window.confirm(
        `${alreadyAdded[0].name} is already added to phonebook, replace the old number with a new one?`
      );
      personService
        .editContact(alreadyAdded[0].id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== alreadyAdded[0].id ? person : returnedPerson
            )
          );
          setNotification(`${personObject.name} contact was updated`);
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })
        .catch((error) => {
          setNotification(
            `Information of ${alreadyAdded[0].name} has been removed from server`
          );
          setTimeout(() => {
            setNotification(null);
          }, 3000);
          setPersons(
            persons.filter((person) => person.id !== alreadyAdded[0].id)
          );
        });
    } else {
      personService.addContact(personObject).then((newContact) => {
        setPersons(persons.concat(newContact));
        setNewName("");
        setNewNumber("");
        setNotification(`Added ${personObject.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
    }
  };

  const deleteContact = (id, name) => {
    if (window.confirm(`delete ${name} contact?`)) {
      personService
        .deleteContact(id)
        .then((response) => {
          console.log(response);
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setNotification(`${name} was already removed`);
          setPersons(persons.filter((person) => person.id !== id));
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notifications message={notification} />
      <Filter onChange={handleFilter} />
      <h3>Add a New</h3>
      <PersonForm
        onSubmit={addContact}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        nameValue={newName}
        numberValue={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        nameFilter={nameFilter}
        persons={persons}
        deleteContact={deleteContact}
      />
    </div>
  );
};

export default App;
