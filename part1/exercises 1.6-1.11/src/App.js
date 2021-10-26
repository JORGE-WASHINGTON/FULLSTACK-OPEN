import React, { useState } from 'react'
import Button from './components/Button'
import Statsheader from './components/Statsheader'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)  

  const goodHandle = () => setGood(good+1)
  const neutralHandle = () => setNeutral(neutral+1)
  const badHandle = () => setBad(bad+1)

  //Average and Percentage logic
  ////////////////////////////////////////////
  const all = good+bad+neutral
  const percentage = () => {
    let percentage =  good/all * 100    
    return percentage
  }
  
  const average = () => {
    let sum = good-bad    
    let average = sum/all
    
    return average
  }

  ////////////////////////////////////////////

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' onClick={goodHandle}/>
      <Button text ='neutral' onClick={neutralHandle}/>
      <Button text='bad' onClick={badHandle}/>
      <Statsheader all={all} good={good} bad={bad} neutral={neutral}
      average={average()} percentage={percentage()}  />    
      
    </div>
  )
}

export default App
