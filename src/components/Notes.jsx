import { useEffect, useState } from "react";

function NewNote({ saveNoteToDB }) {
    return (
        <div id="new-note">
            <textarea id="note" name="note" rows="4" cols="70"></textarea>
            <br></br>
            <button type="button" onClick={saveNoteToDB}>Save</button>
        </div>
    );
}

function OldNote({ text, dateCreated }) {
    return (
        <div>
            <p className="note">{text}</p>
            <p>Date created: {dateCreated}</p>
        </div>
    );
}

export default function Notes() {
    const [oldNotes, setOldNotes] = useState([]);

    useEffect(() => {
        /* Update the view with existing notes only when app loads */
        fetch("http://localhost:8000/notes/", {
            method: "GET",
            data: {},
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {            
            const notesFromDb = [];

            json.forEach(note => {
                notesFromDb.push(<OldNote key={note["id"]} text={note["text"]} dateCreated={note["dateCreated"]} />);
            });

            setOldNotes(notesFromDb);
            });      
    }, []);

    function handleClick() {
        const newNote = {};

        newNote["id"] = Math.floor(Math.random() * 1000000);
        newNote["text"] = document.getElementById("note").value;
        newNote["dateCreated"] = (new Date()).toString();

        if (newNote["text"] == "") {
            return
        }

        fetch("http://localhost:8000/notes/", {
            method: "POST",
            body: JSON.stringify(newNote),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((json) => {
            setOldNotes([...oldNotes, <OldNote key={json["id"]} text={json["text"]} dateCreated={json["dateCreated"]} />])

            document.getElementById("note").value = "";
        });
    }

    return (
        <div id="notes-partition">
            <div id="old-notes">
                {oldNotes}
            </div>
            <NewNote saveNoteToDB={handleClick}/>
        </div>
    );
}