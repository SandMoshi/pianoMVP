if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    alert('Your broswer does not support WebMIDI, please use an updated version of Google Chrome or Firefox in order to use this application.');
}
var scale, firstChord, secondChord, thirdChord, fourthChord, chordsArray, currentIndex;
currentIndex = 0;
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

    // Listen for a 'note on' message on all channels
    input.addListener('noteon', 'all',
        function (e) {
            console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            addNoteToWebsite(e.note.name + e.note.octave);
        }
    );
    input.addListener('noteoff', 'all',
        function (e) {
            console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
            removeNoteToWebsite(e.note.name + e.note.octave);
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
    if (noteMatchesScale(currentText)) {
        document.getElementById("correctResponse").innerText = "Correct, move to the next chord";
        currentIndex += 1;
    } else {
        document.getElementById("notesList").innerText = currentText;
        document.getElementById("correctResponse").innerText = "";
    }
    //document.getElementById("notesList").innerText = currentText;
}

function noteMatchesScale(notesText) {
    console.log("notesText is = " + notesText);
    console.log("chordsArray[currentIndex] = " + chordsArray[currentIndex].toString());
    console.log("Top to bottom what computer is checking for ");
    console.log(chordsArray[currentIndex][1][0].toString());
    console.log(chordsArray[currentIndex][1][1].toString());
    console.log(chordsArray[currentIndex][1][2].toString());

    if (notesText.includes(chordsArray[currentIndex][1][0].toString())) {
        if (notesText.includes(chordsArray[currentIndex][1][1].toString())) {
            if (notesText.includes(chordsArray[currentIndex][1][2].toString())) {
                console.log("CORRECT CORRECT CORRECT");
                return true;
            } else {
                console.log("incorrect");
                return false;
            }
        } else {
            console.log("incorrect");
            return false;
        }
    } else {
        console.log("incorrect");
        return false;
    }
}

function removeNoteToWebsite(note) {
    //note = note.toLowerCase();
    note = note.toLowerCase().charAt(0) + "/" + note.charAt(1);
    var currentText = document.getElementById("notesList").innerText;
    var ret = currentText.replace(note, '');
    document.getElementById("notesList").textContent = ret;
}

function chooseScale(scaleName) {
    if (scaleName === "C Major Scale") {
        scale = ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4", "c/5", "d/5", "e/5", "f/5", "g/5", "a/5", "b/5"];
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
    return [firstNote + " " + secondNote + " " + thirdNote, [firstNote, secondNote, thirdNote]];
}

function getNoteFromEditScale(editScaleVar) {
    var tempEditScaleVar = [...editScaleVar];
    console.log(tempEditScaleVar.length);
    var firstIndex = Math.floor(Math.random() * (tempEditScaleVar.length));
    console.log(firstIndex);
    var note = tempEditScaleVar[firstIndex];
    tempEditScaleVar.splice(firstIndex, firstIndex);
    return [note, editScaleVar];
}

function renderChords(notesArray) {
    const VF = Vex.Flow;

    var div = document.getElementById('boo');
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(500, 500);
    var context = renderer.getContext();
    var stave = new VF.Stave(0, 0, 500);
    // Creates a stave at position 10, 40 of width 400 on the canvas.
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();
    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    //Voice needs enough notes to fill the amount of beats
    //The duration of each note needs to add up to the number of beats
    firstChord = randomChord(scale);
    secondChord = randomChord(scale);
    thirdChord = randomChord(scale);
    fourthChord = randomChord(scale);
    chordsArray = [firstChord, secondChord, thirdChord, fourthChord];
    var notes = [
        { clef: "treble", keys: [firstChord[1][0], firstChord[1][1], firstChord[1][2]], duration: 'q' },
        { clef: "treble", keys: [secondChord[1][0], secondChord[1][1], secondChord[1][2]], duration: 'q' },
        { clef: "treble", keys: [thirdChord[1][0], thirdChord[1][1], thirdChord[1][2]], duration: 'q' },
        { clef: "treble", keys: [fourthChord[1][0], fourthChord[1][1], fourthChord[1][2]], duration: 'q' },
    ];
    var stave_notes = notes.map(function (note) { return new VF.StaveNote(note); });
    //Example code below to set code to green
    //stave_notes[0].setStyle({ fillStyle: 'green', strokeStyle: 'green' });
    voice.addTickables(stave_notes);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 500);


    voice.draw(context, stave);


}

renderChords();
console.log(chordsArray);

