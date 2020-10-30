import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Quote = ({ text, votes }) => {
  return (
    <p>
      {text}<br/>
      has {votes} votes
    </p>
  )
}

const PopularQuote = ({ quotes, popular, votes })=> {
  if (popular === -1){
    return (
      <p>
        No quotes with votes!
      </p>
    )
  }
  return (
    <p>
      {quotes[popular]}<br/>
      has {votes[popular]} votes
    </p>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [popular, setPopular] = useState(-1)

  const changeAnecdote = () => {
    setSelected(Math.floor(Math.random() * props.anecdotes.length))
  }

  const changeVote = () => {
    const copy = { ...votes }
    if (selected in votes){
      copy[selected] += 1
    } else {
      copy[selected] = 0
    }
    setVotes(copy)

    let p = popular
    if (p===-1){
      p = selected
    } else {
      if( copy[selected] > copy[p] ){
        p = selected
      }
    }
    console.log(copy[selected])
    setPopular(p)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Quote text={props.anecdotes[selected]} votes={votes[selected]}/>
      <Button onClick={changeVote} text='vote'/>
      <Button onClick={changeAnecdote} text='next anecdote'/>
      <h1>Anecdote with most votes</h1>
      <PopularQuote quotes={props.anecdotes} popular={popular} votes={votes}/>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)