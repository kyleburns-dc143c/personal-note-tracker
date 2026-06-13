const notes = [];

/* Update the view with existing notes when app loads */
fetch("http://localhost:8000/notes/", {
    method: "GET",
    data: {},
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(response => response.json())
.then(json => {
    oldNotes = document.getElementById("old-notes");
    
    json.forEach(note => {
        oldNotes.innerHTML += `<p class='note'>${note["text"]}</p>`;
        oldNotes.innerHTML += `<p>Date created: ${note["dateCreated"]}</p>`;
    })
})

function saveNote() {
    /* Add the new note to the 'database' */
    const newNote = {};

    newNote["text"] = document.getElementById("note").value;
    newNote["dateCreated"] = new Date();

    if (newNote["text"] != "") {
        notes.push(newNote);
    }

    /* Update the displayed notes */
    document.getElementById("old-notes").innerHTML = "";
    
    const oldNotes = document.getElementById("old-notes");

    notes.forEach(note => {
        oldNotes.innerHTML += `<p class='note'>${note["text"]}</p>`;
        oldNotes.innerHTML += `<p>Date created: ${note["dateCreated"].toString()}</p>`;
    });

    /* Clear the textarea for the next note */
    document.getElementById("note").value = "";
}

function saveNoteToDB() {
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
        const oldNotes = document.getElementById("old-notes");
        
        oldNotes.innerHTML += `<p class='note'>${json["text"]}</p>`;
        oldNotes.innerHTML += `<p>Date created:${json["dateCreated"]}</p>`;

        document.getElementById("note").value = "";
    });
}