import React from 'react'

function Note(props) {
  function handleClick(){
    props.deleteNoteFunction(props.id)
  }
  return (
    <div className='note'>
        <strong><p style={{"margin":"2px"}}>{props.title}</p></strong>
        <p>{props.content}</p>
        <button style={{"margin":"2px"}} onClick={handleClick}>❌</button>
    </div>
  )
}

export default Note
