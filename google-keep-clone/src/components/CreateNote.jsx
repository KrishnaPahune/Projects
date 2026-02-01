import React from 'react'
import { useState } from 'react';
function CreateNote(props) {
    const [newNote, setNewNote] = useState({
        title: "",
        content: ""
    });
    console.log(newNote)
    
    function handleChange(event){
        const {name, value} = event.target
        setNewNote((prev)=>{
            return(
                {
                 ...prev,
                 [name]: value
                }
            )
        })
    }

    function handleClick(event){
      event.preventDefault()
      props.addNoteFunction(newNote)
      setNewNote({
        title:'',
        content:''
      })
    }
  
  return (
    <div className='create-note'>
      <form>
        <input onChange={handleChange} name="title" type="text" placeholder="Title" value={newNote.title} />

        <textarea onChange={handleChange} name="content" rows="5" cols="30" placeholder="Take a note..." value={newNote.content}></textarea>
        
        <button type="" onClick={handleClick}>Add</button>
      </form>
    </div>
  )
}

export default CreateNote
