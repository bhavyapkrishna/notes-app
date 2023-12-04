import React, { useEffect, useState } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

type Note = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

    //add a note
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    useEffect(() => {
      const fetchNotes = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/notes");
          const notes: Note[] = await response.json();
          setNotes(notes);
        } catch (error) {
          console.log(error);
        }
      };

      fetchNotes();
    }, []);

    const handleNoteClick = (note:Note) => {
      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
    }

    const handleAddNote = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        const response = await fetch("http://localhost:4000/api/notes", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            title,
            content
          })
        });

        const newNote = await response.json();

        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");

      } catch (error) {
        console.log(error);
      }

      
    };

    const handleUpdateNote = async (event: React.FormEvent) => {
      event.preventDefault();

      if(!selectedNote) {
        return;
      }

      try {

        const response = await fetch(`http://localhost:4000/api/notes/${selectedNote.id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            title,
            content
          })
        });

        const updatedNote = await response.json();

        const updatedNotesList = notes.map((note) => 
        note.id === selectedNote.id
        ? updatedNote
        : note
        )

        setNotes(updatedNotesList);
        setTitle("");
        setContent("");
        setSelectedNote(null);

      } catch (error) {
        console.log(error);
      }
    };

    const handleCancel = () => {
      setTitle("");
      setContent("");
      setSelectedNote(null);
    }

    const handleDeleteNote = async (event: React.MouseEvent, noteId: number) => {
      event.stopPropagation();

      try {
        const response = await fetch(`http://localhost:4000/api/notes/${noteId}`, {
          method: "DELETE"
        });

        const updatedNotes = notes.filter(
          (note) => note.id != noteId
        );
  
        setNotes(updatedNotes);

      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div>
      <div className="header">
      <Box sx={{ flexGrow: 1, padding: 2}}>
        <AppBar position="static" sx={{borderRadius: 2}}>
          <Toolbar sx={{ justifyContent: 'center', position: 'relative', background: '#77e5a2', borderRadius: 2}}>
            <Typography sx={{ fontWeight: '600' }} variant="h6" component="div" color="black">
              Notekeeper
            </Typography>{' '}
          </Toolbar>
        </AppBar>
      </Box>
      </div>
      <div>
      <Box component="form" className = "note-form"
        onSubmit={(event) => 
        selectedNote
        ? handleUpdateNote(event)
        : handleAddNote(event)}>
        <input value={title} 
          onChange={(event) => setTitle(event.target.value)} 
          placeholder="Title" required />
        <textarea className="content-area" value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Enter Content" rows={5} required />
          {selectedNote ? (
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Add Note</button>
          )}
      </Box>
      </div>
    <div className="app-container">
    <div>
        <Typography />
      </div>
      <Box>
      <div className="notes-grid">
      {notes.map((note) => (
        <div className="note-item"
          onClick={() => handleNoteClick(note)}>
          <div className="notes-header">
            <button
              onClick={(event) => handleDeleteNote(event, note.id )}>x</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
      </Box>
    </div>
    </div>
  );
}

export default App;
