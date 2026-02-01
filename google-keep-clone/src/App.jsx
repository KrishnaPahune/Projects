import React, { useState } from "react";
import Header from "./components/Header";
import CreateNote from "./components/CreateNote";
import Note from "./components/Note";
import Footer from "./components/Footer";
import "./App.css";
function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote){
    setNotes((prevNotes) => {
      return(
        [...prevNotes,newNote]
      )
  })
  }

  function deleteNote(id){
    setNotes((prevNotes) => {
      return(
        notes.filter((note,index) => {
          return(
            index !== id
          )
        })
      )
    })
  }

  return (
    <div>
      <Header />
      <CreateNote addNoteFunction={addNote}/>
      <div className="notes">
        {notes.map((note, index) => {
          return <Note key={index} id={index} title={note.title} content={note.content} deleteNoteFunction={deleteNote} />;
        })}
      </div>
      <Footer />
    </div>
  );
}

export default App;
