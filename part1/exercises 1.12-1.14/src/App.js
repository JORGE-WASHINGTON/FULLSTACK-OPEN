import React, { useState } from 'react'
import Button from './components/Button'


function App() {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  ///States
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  /// State handler functions
  const randomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const vote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  ///Helper function to determine most votes

  const mostVotes = votes.reduce((a, b) => {
    return Math.max(a, b)
  });


  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {votes[selected]} votes</p>

      <div>
        <Button text='Vote' onClick={vote} />
        <Button text='Next anecdote' onClick={randomAnecdote} />
      </div>

      <div>
        <h1>Anecdote with most votes</h1>
        {mostVotes !== 0 ? <p>{anecdotes[votes.indexOf(mostVotes)]}</p> : ''}
        {mostVotes !== 0 ? <p>has {mostVotes} votes</p> : ''}
      </div>
    </div>
  );
}

export default App;
