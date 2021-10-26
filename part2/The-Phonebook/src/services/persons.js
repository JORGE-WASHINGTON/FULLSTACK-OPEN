import axios from 'axios'

const baseUrl = 'api/persons'

const getAllContacts = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addContact = (personObject) => {
    const request = axios.post(baseUrl, personObject)
    return request.then(response => response.data)
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const editContact = (id, personObject) => {
    const request = axios.put(`${baseUrl}/${id}`, personObject)
    return request.then(response => response.data)
}

export default { getAllContacts, deleteContact, addContact, editContact }