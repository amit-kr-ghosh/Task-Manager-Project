import React, { useEffect } from "react";
import { FaHandPointRight } from "react-icons/fa";
import axios from "axios";

const MainNote = ({ notes, setNotes }) => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/note/getNote`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, [setNotes]);

  return (
    <>
      <div className="scroller">
        <div className="content-note scroller-inner">
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <span id="scroller-con-col">
              " Effortlessly Organize Your Thoughts."
            </span>
            <br />
            <br />
            Elevate your note-taking game, one click at a time
          </div>

          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>

            <span id="scroller-con-col">
               Capture ideas, set reminders, and stay organized
            </span>
           <br />
           <br />
            Some of your recently added Notes ...
            
            <br />
            <FaHandPointRight size={30} style={{ marginLeft: "50%" }} />
          </div>
          {notes.map((eachNote) => (
            <textarea
              value={eachNote.noteText}
              id="dash-note-con"
              key={eachNote.id}
              readOnly
            ></textarea>
          ))}
        </div>
        {/* <button className="dash-goto-bt">+</button> */}
      </div>
    </>
  );
};

export default MainNote;
