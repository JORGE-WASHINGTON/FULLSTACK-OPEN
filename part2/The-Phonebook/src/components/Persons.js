const Persons = ({ nameFilter, persons, deleteContact }) => {
  return (
    <ul>
      {nameFilter === '' ? persons.map((person, i) =>
        <li key={i}>
          {person.name} {person.number}
          <button onClick={() => deleteContact(person.id, person.name)}>delete</button>
        </li>)
        : persons.filter((person) => {
          return person.name.toUpperCase().includes(nameFilter.toUpperCase())
        }).map((person, i) =>
          <li key={i}>
            {person.name} {person.number}
            <button onClick={() => deleteContact(person.id, person.name)}>delete</button>
          </li>)}
    </ul>
  )
}

export default Persons
