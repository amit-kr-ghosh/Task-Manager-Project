import React, { useEffect, useState, useRef } from "react";
import { BiSolidSave, BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Dialog from "./SrNoDialog/Dialog";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";

const Note = (props) => {
  const { val, notes, setNotes, toast } = props;
  const [dialog, setDialog] = useState({ isLoading: false });
  const [text, setText] = useState(val.noteText);
  const textareaRef = useRef();
  const idRef = useRef();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  const deleteNote = (id) => {
    setDialog({ isLoading: true });
    idRef.current = id;
  };

  const areYouSure = (yes) => {
    if (yes) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/note/deleteNote/${idRef.current}`)
        .catch((err) => console.log(err));
      setNotes(notes.filter((note) => idRef.current !== note.id));
      setDialog({ isLoading: false });
      toast.success("Deleted Successfully");
    } else {
      setDialog({ isLoading: false });
    }
  };

  const saveNote = async (id) => {
    let note = notes.find((obj) => obj.id === id);
    let found;
    await axios
      .get(`${process.env.REACT_APP_API_URL}/note/getNote`)
      .then((res) => {
        found = res.data.find((obj) => obj.id === id);
      })
      .catch((err) => console.log(err));
    if (!found) {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/note/postNote`, note)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    update(id);
  };

  const update = (id) => {
    axios.patch(`${process.env.REACT_APP_API_URL}/note/updateNote/${id}`, {
      newText: text,
    });
    toast.success("Saved Successfully");
  };

  const typing = (e) => {
    setText(e.target.value);
  };

  const focusBtn = () => {
    textareaRef.current.focus();
  };

  // 🔥 AI Autocomplete with toast feedback
const handleAutocomplete = async () => {
  try {
    toast.info("Generating suggestion...");
    
    // Make the API request to generate a suggestion
    const res = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "", 
      },
      body: JSON.stringify({
        model: "command",
        prompt: text,
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const suggestion = data.generations[0]?.text || ""; // Get the AI suggestion

    // Replace the current text with the AI suggestion
    setText(suggestion);
    toast.success("AI suggestion added!");
  } catch (err) {
    console.error("Cohere API error:", err);
    toast.error("Failed to get AI suggestion 😢");
  }
};



  // Trigger Ctrl + Space
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      handleAutocomplete();
    }
  };

  return (
    <>
      <div className="note-body">
        {dialog.isLoading && <Dialog areYouSure={areYouSure} />}
        <div className="note-head">
          <button className="note-bt" onClick={() => saveNote(val.id)}>
            <BiSolidSave color="#f7efe5" size={20} />
          </button>
          <button className="note-bt" onClick={focusBtn}>
            <BiEdit color="#f7efe5" size={20} />
          </button>
          <button onClick={() => deleteNote(val.id)} className="note-bt">
            <AiFillDelete color="#f7efe5" size={20} />
          </button>
        </div>
        <h3 id="note-title">{`${val.title}`}</h3>
        <textarea
          ref={textareaRef}
          value={text}
          spellCheck="false"
          onChange={typing}
          onKeyDown={handleKeyDown}
          onFocus={(event) =>
            event.currentTarget.setSelectionRange(
              event.currentTarget.value.length,
              event.currentTarget.value.length
            )
          }
          placeholder="Type your note and press Ctrl + Space for AI suggestion"
          className="note-textarea"
        ></textarea>
        <div className="note-foot">
          <h3 className="date">{`${val.date}`}</h3>
          <h3 className="time">{`${val.time}`}</h3>
        </div>
      </div>
    </>
  );
};

export default Note;
