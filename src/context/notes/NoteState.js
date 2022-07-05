import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=> {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    //Get all notes
    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
          });
          const json = await response.json();
        //   console.log(json);
          setNotes(json);
    }


    // Add a Note
    const addNote = async (title, description, tag)=> {
        // TODO api call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
          });
          const note = await response.json(); // parses JSON response into native JavaScript objects
        //   console.log(json)

        // const note = {
        //     '_id' : '62be07c9bed00cb83bfa2a97',
        //      'user' : '62bca6af67658b52145253abc',
        //      'title' : "My-Title Added",
        //      'description' : "Please sleep early",
        //      'tag' : "personal",
        //      'date' : '2022-07-30T20:30:01.375+00:00',
        //      '__v' : '0'
        //  };
        setNotes(notes.concat(note));
    }

    // Delete a Note
    const deleteNote = async (id)=> {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
          });
          await response.json();
        //   console.log(json);
        // console.log("item deleted with note id"+id);
        const newNotes = notes.filter((note) => {return note._id !== id})
        setNotes(newNotes);
    }

    // Edit a Note
    const editNote = async (id,title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
          });
          response.json(); // parses JSON response into native JavaScript objects

          let newNotes = JSON.parse(JSON.stringify(notes));
        for(let index=0;index<notes.length;index++){
            const element = notes[index]
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
            
        }
        setNotes(newNotes);
    }
    
    return (
        <NoteContext.Provider value  = {{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState