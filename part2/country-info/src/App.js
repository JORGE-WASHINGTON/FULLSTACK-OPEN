import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([]) //Countries will be fetched from restcountries API
  const [query, setQuery] = useState('') //country search value
  const [weather, setWeather] = useState([]) //Weather for the selected country capital
  const [dataFetched, setDataFetched] = useState(false) //sets to true when the weather data is fetched so i can then render it

  const api_key = process.env.REACT_APP_API_KEY // Api key saved secretly in a .env file, added to .gitignore

  const handleQuery = (e) => setQuery(e.target.value) //sets the query state to whats passed in the input field
  const filter = countries.filter((country) => country.name.common.toUpperCase().includes(query.toUpperCase())) //array with filtered countries based on the query state

  //fetches countries data on the first render
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  //fetches weather data when the filter array has only one country
  useEffect(() => {
    console.log('effect');
    const filter = countries.filter((country) => country.name.common.toUpperCase().includes(query.toUpperCase()))
    if (filter.length === 1) {
      axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${filter[0].capital[0]}`)
        .then(response => {
          setWeather(response.data)
          setDataFetched(true)
        })
    }
  }, [query]) //Whenever the query states changes this useEffect hook will be called and if the condition is met will then fetch data


  return (
    <div>
      <label>Find Countries
      <input type="text" value={query} onChange={handleQuery} />
      </label>
      { <div>
        {/*default render for when the filter array has only one country*/}
        {filter.length === 1 ? filter.map((country, i) =>
          <div key={i}>
            <h1>{filter[0].name.common}</h1>
            <p>capital: {filter[0].capital}</p>
            <p>population: {filter[0].population}</p>
            <h3>Languages</h3>
            <ul>
              {Object.values(filter[0].languages)
                .map((language, i) => <li key={i}>{language}</li>)}
            </ul>
            <img style={{ width: '150px', height: '150px' }} src={`${filter[0].flags.svg}`} alt="flag" />
            <h3>Weather in {filter[0].capital}</h3>
            {dataFetched ?
              <p style={{ fontWeight: 'bold' }}>Temperature: {weather.current.temperature} Celsius</p>
              : ''}
            {dataFetched ?
              <img style={{ width: '150px', height: '150px' }} src={`${weather.current.weather_icons}`} alt="weatherIcon" />
              : ''}
            {dataFetched ?
              <p style={{ fontWeight: 'bold' }}>Wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
              : ''}
          </div>)
          : ''}

        {/*default render for when the filter array has more than 10 countries*/}
        {filter.length > 10 && query !== '' ? <p>Too many matches, specify another filter</p> : ''}

        {/*default render for when the filter array has 10 or less countrys but not one*/}
        {filter.length <= 10 && filter.length > 1 ? filter.map((country, i) =>
          <li key={i}>{country.name.common} <button onClick={(id = i) => setQuery(filter[i].name.common)} >show</button></li>)
          : ''}
      </div>}
    </div>

  );
}

export default App;
