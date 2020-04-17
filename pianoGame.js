
const pianoGame = (function runPianoGame() {

    if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');
    } else {
        alert('Your broswer does not support WebMIDI, please use an updated version of Google Chrome or Firefox in order to use this application.');
    }
    var scale, firstChord, secondChord, thirdChord, fourthChord, chordsArray;
    var currentIndex = 0;
    var inputtedNotes = [];
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
        console.log(midiAccess);

        var inputs = midiAccess.inputs;
        var outputs = midiAccess.outputs;
    }

    function onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
    }

    WebMidi.enable(function () {

        // Viewing available inputs and outputs
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        // Retrieve an input by name, id or index
        var input = WebMidi.inputs[0];
        // OR...
        // input = WebMidi.getInputById("1809568182");
        // input = WebMidi.inputs[0];

        //If no device found
        if(!input) return;

        // Listen for a 'note on' message on all channels
        input.addListener('noteon', 'all',
            function (e) {
                console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
                addNoteToArray(e.note.name + e.note.octave);
                console.log("inputtedNotes = ", inputtedNotes);
            }
        );
        input.addListener('noteoff', 'all',
            function (e) {
                console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
                removeNoteFromArray(e.note.name + e.note.octave);
                console.log("inputtedNotes = ", inputtedNotes);
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
        console.log(inputtedNotes);
        if (inputMatchesChord()) {
            document.getElementById("correctResponse").innerText = "Correct, move to the next chord";
            chordsArray[currentIndex].color = "green";
            currentIndex += 1;
            if(currentIndex >= chordsArray.length){
                currentIndex = 0;
                generate4RandomChords();
            }
            renderChords();
        }
    }

    function inputMatchesChord() {
        console.log("chordsArray[currentIndex].noteArray.sort() ", chordsArray[currentIndex].noteArray.sort().toString());
        console.log("inputtedNotes.sort() = ", inputtedNotes.sort().toString())
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
        console.log(inputtedNotes);

    }


    function chooseScale(scaleName) {
        if (scaleName === "C Major Scale") {
            scale = ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4"];//"b/4", "c/5", "d/5", "e/5", "f/5", "g/5", "a/5", "b/5"];
        }
        //Goal with this function
        //Parameter is a string
        //String examples: C Minor scale, C Major scale
        //if(str == "C Minor Scale")
        //return C minor scale notes
    }

    function randomChord(scaleVar) {
        var editScale = [...scaleVar]; //Spread operator
        console.log(editScale);

        //editScale = getNoteFromEditScale(editScale)[1];

        //TODO:
        //Make all of this code block below one function,
        //Function return an array of 3 notes
        firstArray = getNoteFromEditScale(editScale);
        firstNote = firstArray[0];
        editScale = firstArray[1];
        secondArray = getNoteFromEditScale(editScale);
        secondNote = secondArray[0];
        editScale = secondArray[1];
        thirdArray = getNoteFromEditScale(editScale);
        thirdNote = thirdArray[0];
        editScale = thirdArray[1];
        console.log("The random chord is " + firstNote + secondNote + thirdNote);
        //Fill modified scale
        chooseScale("C Major Scale");

        return {
            noteArray: [firstNote, secondNote, thirdNote],
            color: "black",
        }
    }

    function getNoteFromEditScale(editScaleVar) {
        var tempEditScaleVar = [...editScaleVar];
        console.log(tempEditScaleVar.length);
        var firstIndex = Math.floor(Math.random() * (tempEditScaleVar.length));
        console.log(firstIndex);
        var note = tempEditScaleVar[firstIndex];
        tempEditScaleVar.splice(firstIndex, 1);
        return [note, tempEditScaleVar];
    }

    function generate4RandomChords() {
        firstChord = randomChord(scale);
        secondChord = randomChord(scale);
        thirdChord = randomChord(scale);
        fourthChord = randomChord(scale);
        chordsArray = [firstChord, secondChord, thirdChord, fourthChord];
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

        var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        //Voice needs enough notes to fill the amount of beats
        //The duration of each note needs to add up to the number of beats

        var chords = [
            { clef: "treble", keys: [firstChord.noteArray[0], firstChord.noteArray[1], firstChord.noteArray[2]], duration: 'q' },
            { clef: "treble", keys: [secondChord.noteArray[0], secondChord.noteArray[1], secondChord.noteArray[2]], duration: 'q' },
            { clef: "treble", keys: [thirdChord.noteArray[0], thirdChord.noteArray[1], thirdChord.noteArray[2]], duration: 'q' },
            { clef: "treble", keys: [fourthChord.noteArray[0], fourthChord.noteArray[1], fourthChord.noteArray[2]], duration: 'q' },
        ];
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

