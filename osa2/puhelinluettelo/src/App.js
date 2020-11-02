// 2.18+
import React, { useEffect, useState } from 'react'
import personService from './services/web'

const Person = ({ person, handleDelete }) => {
    return (
        <div>
            {person.name} {person.number} 
            <button onClick={handleDelete}>delete</button>
        </div>
    )
}

const Filter = ({ onChange }) => {
    return (
        <p>
            filter shown with <input onChange={onChange} />
        </p>
    )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const HandleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const HandleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const HandleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) =>{
      event.preventDefault()
      const personObject = {
          name: newName,
          number: newNumber
      }

      if (newName.length===0 || newNumber.length===0){
          alert('Name and number must not be empty!')
      } else {
        let names = persons.map( person => person.name)
        // Lisätään jos ei ole valmiiksi taulukossa
        if (names.includes(personObject.name)){
          setNewName('')
          if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)){
            const person = persons.find( n => n.name === personObject.name)
            const changedPerson = {...person, number: personObject.number}
            personService
              .update(changedPerson.id, changedPerson)
              .then( returnedPerson => {
                setPersons(persons.map( person => person.name !== changedPerson.name ? person : returnedPerson))
              })
          }
        } else {
          personService
            .create(personObject)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNewName('')
            })
        }
        setNewNumber('')
      }
  }

  const handleDeleteOf = name => {
    const person = persons.find( n => n.name === name)
    if( window.confirm(`Delete ${person.name}?`)){
      personService.deleteNode(person.id)
      setPersons(persons.filter(n => n.name !== name))
    }
  }

  // Mitkä numerot näytetään
  const phonesToShow = (newFilter.length === 0) 
    ? persons 
    : persons.filter( person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={HandleFilterChange}/>
      <h2>Add new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={HandleNameChange}/><br/>
          number: <input value={newNumber} onChange={HandleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {phonesToShow.map( person =>
            <Person 
              key={person.name} 
              person={person}
              handleDelete={() => handleDeleteOf(person.name)}
            />
      )}
    </div>
  )

}

export default App