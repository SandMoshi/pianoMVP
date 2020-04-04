if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    alert('Your broswer does not support WebMIDI, please use an updated version of Google Chrome or Firefox in order to use this application.');
}
var scale, firstChord, secondChord, thirdChord, fourthChord, chordsArray, currentIndex;
currentIndex = 0;
chooseScale(true);
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

    console.log(currentText);
    currentText += " " + note;
    console.log(currentText);
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
    var currentText = document.getElementById("notesList").innerText;
    var ret = currentText.replace(note, '');
    document.getElementById("notesList").textContent = ret;
}

function chooseScale(scaleName) {
    if (scaleName) {
        scale = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"];
    }
}

function randomChord(scaleVar) {
    var editScale = scaleVar;
    console.log(editScale);

    //editScale = getNoteFromEditScale(editScale)[1];
    firstArray = getNoteFromEditScale(editScale);
    firstNote = firstArray[0];
    editScale = firstArray[1];
    secondArray = getNoteFromEditScale(editScale);
    secondNote = secondArray[0];
    editScale = secondArray[1];
    thirdArray = getNoteFromEditScale(editScale);
    thirdNote = thirdArray[0];
    editScale = thirdArray[1];
    //var firstNote = editScale[Math.floor(Math.random() * editScale.length)];
    //var secondNote = editScale[Math.floor(Math.random() * editScale.length)];
    //var thirdNote = editScale[Math.floor(Math.random() * editScale.length)];
    //var firstNote = editScale[Math.floor(Math.random() * editScale.length)];
    //var secondNote = editScale[Math.floor(Math.random() * editScale.length)];
    //var thirdNote = editScale[Math.floor(Math.random() * editScale.length)];
    console.log("The random chord is " + firstNote + secondNote + thirdNote);
    chooseScale(scaleVar);
    console.log(scaleVar);
    return [firstNote + " " + secondNote + " " + thirdNote, [firstNote, secondNote, thirdNote]];
}

function getNoteFromEditScale(editScaleVar) {
    var tempEditScaleVar = editScaleVar;
    console.log(tempEditScaleVar.length);
    var firstIndex = Math.floor(Math.random() * (tempEditScaleVar.length));
    console.log(firstIndex);
    var note = tempEditScaleVar[firstIndex];
    tempEditScaleVar.splice(firstIndex, firstIndex);
    return [note, editScaleVar];
}

function renderChord(notesArray) {

    const VF = Vex.Flow;

    var vf = new VF.Factory({
        renderer: { elementId: 'boo', width: 500, height: 200 }
    });

    var score = vf.EasyScore();
    var system = vf.System();
    firstChord = randomChord(scale);
    secondChord = randomChord(scale);
    thirdChord = randomChord(scale);
    fourthChord = randomChord(scale);
    chordsArray = [firstChord, secondChord, thirdChord, fourthChord];
    system.addStave({
        voices: [
            score.voice(score.notes('(' + firstChord[0] + ')/q, (' + secondChord[0] + '), (' + thirdChord[0] + '), (' + fourthChord[0] + ')', { stem: 'up' }))
            //score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
        ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
}

renderChord();
console.log(chordsArray);

