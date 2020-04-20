
const pianoGame = (function runPianoGame() {

    if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');
    } else {
        alert('Your broswer does not support WebMIDI, please use an updated version of Google Chrome or Firefox in order to use this application.');
    }
    var scale, firstChord, secondChord, thirdChord, fourthChord, chordsArray;
    var currentIndex = 0;
    var inputtedNotes = [];
    var chordsFromScale = [];
    var VF;
    var div;
    var renderer;
    var context;
    var stave;
    //If wanting to use other scales, make this string parameter a global variable
    chooseScale("C Major Scale");
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(midiAccess) {
        var inputs = midiAccess.inputs;
        var outputs = midiAccess.outputs;
    }

    function onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
    }

    WebMidi.enable(function () {

        // Viewing available inputs and outputs
        console.log("WebMidi.inputs:", WebMidi.inputs, "WebMidi.outputs:", WebMidi.outputs);

        // Retrieve an input by name, id or index
        var input = WebMidi.inputs[0];
        // OR...
        // input = WebMidi.getInputById("1809568182");
        // input = WebMidi.inputs[0];

        //If no device found
        if (!input) return;

        // Listen for a 'note on' message on all channels
        input.addListener('noteon', 'all',
            function (e) {
                console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
                addNoteToArray(e.note.name + e.note.octave);
            }
        );
        input.addListener('noteoff', 'all',
            function (e) {
                console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
                removeNoteFromArray(e.note.name + e.note.octave);
            }
        );

        // Listen to pitch bend message on channel 3
        input.addListener('pitchbend', 3,
            function (e) {
                console.log("Received 'pitchbend' message.", e);
            }
        );

        // Listen to control change message on all channels
        input.addListener('controlchange', "all",
            function (e) {
                console.log("Received 'controlchange' message.", e);
            }
        );

        // Remove all listeners for 'noteoff' on all channels
        //input.removeListener('noteoff');

        // Remove all listeners on the input
        //input.removeListener();

    });

    function addNoteToWebsite(note) {
        var currentText = document.getElementById("notesList").innerText;

        //console.log(currentText);
        //Example note: c/5
        note = note.toLowerCase();
        note = note.charAt(0) + "/" + note.charAt(1);
        currentText += " " + note;
        console.log("THE NOTE IS " + note);

        document.getElementById("notesList").innerText = currentText;
        document.getElementById("correctResponse").innerText = "";

        //document.getElementById("notesList").innerText = currentText;
    }

    function addNoteToArray(note) {
        addNoteToWebsite(note); //Display the notes in the DOM
        note = note.toLowerCase();
        note = note.charAt(0) + "/" + note.charAt(1);
        inputtedNotes.push(note);
        //Check if we match the chord
        if (inputMatchesChord()) {
            document.getElementById("correctResponse").innerText = "Correct, move to the next chord";
            chordsArray[currentIndex].color = "green";
            currentIndex += 1;
            //Determine if we finished all the notes)
            if (currentIndex >= chordsArray.length) {
                currentIndex = 0;
                generate4RandomChords();
            }
            //Change chord to green or draw new chords
            renderChords();
        }
    }

    function inputMatchesChord() {
        console.log("Looking for:", chordsArray[currentIndex].noteArray.sort().toString());
        if (inputtedNotes.sort().toString() == chordsArray[currentIndex].noteArray.sort().toString()) {
            console.log("CORRECT");
            return true;
        } else {
            console.log("incorrect");
            return false;
        }
    }

    function removeNoteFromWebsite(note) {
        //note = note.toLowerCase(); 
        note = note.toLowerCase().charAt(0) + "/" + note.charAt(1);
        var currentText = document.getElementById("notesList").innerText;
        document.getElementById("notesList").textContent = currentText.replace(note, '');
    }

    function removeNoteFromArray(note) {
        removeNoteFromWebsite(note); //Remove this note from the DOM
        var noteIndex = inputtedNotes.indexOf(note.toLowerCase().charAt(0) + "/" + note.charAt(1));
        if (noteIndex > -1) {
            inputtedNotes.splice(noteIndex, 1);
        }
    }


    function chooseScale(scaleName) {
        if (scaleName === "C Major Scale") { // 0 Sharps
            scale = ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4", "c/5", "d/5", "e/5", "f/5", "g/5", "a/5", "b/5"];
            //chordsFromScale = [["c/4", "f/4"], ["c/4", "e/4"], ["c/4", "e/4", "g/4"], ["f/4", "a/4"], ["d/4", "f/4", "a/4"], ["c/4", "e/4", "g/4", "b/4"], ["e/4", "g/4", "b/4"], ["e/4", "g/4", "a/4", "b/4"]];;
            generateChordsFromScale(scale); //This function changes chordsFromScale and fills it up with chords
        } else if (scaleName == "G Major Scale") { // 1 Sharp
            scale = ["g/4", "a/4", "b/4", "c/4", "d/4", "e/4", "f#/4", "g/5", "a/5", "b/5", "c/5", "d/5", "e/5", "f#/5"];
        }
        //Goal with this function
        //Parameter is a string
        //String examples: C Minor scale, C Major scale
        //if(str == "C Minor Scale")
        //return C minor scale notes
    }

    function randomChord(scaleVar) {
        //getNotesFromScale returns an array of 3 notes (RANDOMLY)
        //chordsFromScale is an array that comes with the scale, with all the popular chord combinations
        //const chord = getNotesFromScale(scaleVar, 3);
        chord = chordsFromScale[Math.floor(Math.random() * (chordsFromScale.length))];
        chord.sort(compareNotes); //Vexflow requires notes to be sorted (by verticality)
        //Fill modified scale
        chooseScale("C Major Scale");
        return {
            noteArray: chord,
            color: "black",
        }
    }

    //Precondition: scale has to be two octaves
    function generateChordsFromScale(scale) { //SIDENOTE this is assuming there are 7 NOTES in a scale (C to B in C major), most scales have seven but some do not!
        chordsFromScale = []; //I am using the chordsFromScale array here, 

        //First I create the octaves (Same notes)
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 7]]);
        }

        //Creating the thirds (I forget if this is the right musical term, two notes spaced apart)
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 2]]);
        }

        //Creating the fourths
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 3]]);
        }

        //Creating the fifths 
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 4]]);
        }

        //Creating the major fifth chords 
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 2], scale[i + 4]]);
        }

        //Creating the major sixth chords? (I forget the name of this chord type) 
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 2], scale[i + 5]]);
        }

        //Creating the sixths  
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 5]]);
        }

        //Creating the sevenths  
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 6]]);
        }

        //Creating the major seventh chords
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 2], scale[i + 4], scale[i + 6]]);
        }

        //Creating the major seventh chords (without a note in the middle)
        for (var i = 0; i < 7; i++) {
            chordsFromScale.push([scale[i], scale[i + 4], scale[i + 6]]);
        }

        console.log(chordsFromScale);

    }

    function compareNotes(a, b) {
        let aOctave = a.charAt(a.length - 1);
        let aNote = a.charAt(0);
        let bOctave = b.charAt(b.length - 1);
        let bNote = b.charAt(0);
        //First compare octaves then compare notes
        if (aOctave === bOctave) {
            //C --> D --> E --> F --> G --> A --> B
            const orderedNotes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
            if (orderedNotes.indexOf(bNote) > -1 && orderedNotes.indexOf(aNote) > -1) {
                return orderedNotes.indexOf(aNote) - orderedNotes.indexOf(bNote);
            } else {
                return 0;
            }
        }
        else if (aOctave < bOctave) {
            return -1
        } else {
            //aOctave > bOctave
            return 1;
        }
    };

    function getNotesFromScale(scale, int) {
        //scale is the array of possible notes in the scale
        //int is how many unique notes to grab
        var tempScale = [...scale];
        var chosenNotes = [];
        for (var i = 0; i < int; i++) {
            const randomIndex = Math.floor(Math.random() * (tempScale.length));
            const randomNote = tempScale[randomIndex];
            chosenNotes.push(randomNote);
            tempScale.splice(randomIndex, 1); //Remove this note from the temporary scale so it isn't chosen twice
        }
        return chosenNotes;
    }

    function generate4RandomChords() {
        firstChord = randomChord(scale);
        secondChord = randomChord(scale);
        thirdChord = randomChord(scale);
        fourthChord = randomChord(scale);
        chordsArray = [firstChord, secondChord, thirdChord, fourthChord];
        chordsArray.forEach(chord => console.log('The new chord is:', chord.noteArray));
    }

    function initialRender() {
        VF = Vex.Flow;
        div = document.getElementById('mainStaff');
        renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(500, 100);
        context = renderer.getContext();
        stave = new VF.Stave(0, 0, 500);
        // Creates a stave at position 10, 40 of width 400 on the canvas.
        stave.addClef("treble").addTimeSignature("4/4");
        stave.setContext(context).draw();
    }

    function renderChords(notesArray) {
        console.log('rendering!');
        //Clear previous chords/notes
        if (context) {
            context.clear();
            stave.setContext(context).draw(); //redraw Stave
        }
        var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        //Voice needs enough notes to fill the amount of beats
        //The duration of each note needs to add up to the number of beats

        var chords = chordsArray.map(chordObject => {
            return {
                clef: 'treble',
                keys: chordObject.noteArray.sort(compareNotes),
                duration: 'q'
            }
        });

        var stave_notes = chords.map(function (chord) { return new VF.StaveNote(chord); });
        //Example code below to set code to green
        //stave_notes[0].setStyle({ fillStyle: 'green', strokeStyle: 'green' });
        //stave_notes[0]
        //stave_notes[1]
        //index < currentChordIndex
        //stave_notes[0].setStyle({ fillStyle: 'green', strokeStyle: 'green' });
        stave_notes.forEach((stave_note, index) => { stave_note.setStyle({ fillStyle: chordsArray[index].color, strokeStyle: chordsArray[index].color }) });

        voice.addTickables(stave_notes);
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 500);


        voice.draw(context, stave);
    }
    initialRender();
    generate4RandomChords();
    renderChords();

    //Return Object: This object give us access to theese functions/objects from outside this function
    return {
        addNoteToArray: addNoteToArray,
        removeNoteFromArray: removeNoteFromArray,
    }

})();

