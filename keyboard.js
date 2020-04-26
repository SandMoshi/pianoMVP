
function startKeyboard() {
    console.log('startKeyboard()');

    const keyboardDOM = document.getElementById('keyboard'); //Container for the HTML elements

    const key = class {
        constructor(note, octave, color, keyCode, keyChar, index) {
            this.color = color;
            this.vexNote = `${note}/${octave}`;
            this.midiNote = `${note.toUpperCase()}${octave}`;
            this.realNote = `${note.toUpperCase()}${octave}`;
            this.keyCode = keyCode;
            this.keyChar = keyChar; //represents the letter of the keyboard key
            this.index = index;
        }
    }

    const keys = [
        //constructor(note, octave, color, keyCode, keyChar, index)
        new key('c', 4, 'white', 16, 'SHIFT', 0),
        new key('c#', 4, 'black', 9, 'TAB', 0),
        new key('d', 4, 'white', 65, 'A', 1),
        new key('d#', 4, 'black', 81, 'Q', 1),
        new key('e', 4, 'white', 83, 'S', 2),
        new key('f', 4, 'white', 68, 'D', 3),
        new key('f#', 4, 'black', 69, 'E', 3),
        new key('g', 4, 'white', 70, 'F', 4),
        new key('g#', 4, 'black', 82, 'R', 4),
        new key('a', 4, 'white', 71, 'G', 5),
        new key('a#', 4, 'black', 84, 'T', 5),
        new key('b', 4, 'white', 72, 'H', 6),
        new key('c', 5, 'white', 74, 'J', 7),
        new key('c#', 5, 'black', 85, 'U', 7),
        new key('d', 5, 'white', 75, 'K', 8),
        new key('d#', 5, 'black', 73, 'I', 8),
        new key('e', 5, 'white', 76, 'L', 9),
        new key('f', 5, 'white', 186, ';', 10),
        new key('f#', 5, 'black', 80, 'P', 10),
        new key('g', 5, 'white', 222, '\'', 11),
        new key('g#', 5, 'black', 219, '{', 11),
        new key('a', 5, 'white', 13, 'ENTER', 12),
        new key('a#', 5, 'black', 221, '}', 12),
        new key('b', 5, 'white', 220, '\\', 13),
    ]

    keys.forEach((key, index) => {
        //Create DOM key for each one
        const domKey = document.createElement('div');
        domKey.className = `keyboard__key ${key.color}__key button-${key.keyChar}`;
        domKey.dataset.keycode = key.keyCode;
        domKey.dataset.realnote = key.realNote;
        domKey.id = key.keyCode;
        domKey.style = (key.color === 'white') ? `left: calc(50px * ${key.index}); z-index: 0;` : `left: calc(35px + 50px * ${key.index}); z-index: 1;`;
        keyboardDOM.appendChild(domKey);

        const instruction = document.createElement('span');
        instruction.innerText = key.keyChar;
        instruction.className = 'key__instruction';
        domKey.appendChild(instruction);

        const label = document.createElement('span');
        label.innerText = key.realNote;
        label.className = 'key__label';
        domKey.appendChild(label);
    })

    const pressedKeys = {
        '16': false,
        '13': false,
        '219': false,
        '221': false,
        '220': false,
        '80': false,
        '222': false,
        '186': false,
        '73': false,
        '20': false,
        '65': false,
        '65': false,
        '68': false,
        '69': false,
        '70': false,
        '71': false,
        '72': false,
        '74': false,
        '75': false,
        '76': false,
        '81': false,
        '82': false,
        '83': false,
        '84': false,
        '85': false,
        '87': false,
        '89': false,
        '9': false,
    }

    function keyDown(e) {
        e.preventDefault();
        //If already pressed, stop
        if (pressedKeys[e.keyCode]) { return }
        else pressedKeys[e.keyCode] = true;

        //Find the matching key element and highlight
        const key = document.getElementById(e.keyCode);
        if (key) {
            key.classList.add('pressed');
        } else {
            return;
        }
        synth.triggerAttack(key.dataset['realnote']);
        //Adding note to noteArray
        pianoGame.addNoteToArray(key.dataset['realnote']);
    }

    function keyUp(e) {
        //Find matching element and un-highlight
        const key = document.getElementById(e.keyCode);
        if(!key) return;
        key && key.classList.remove('pressed');
        pressedKeys[e.keyCode] = false;
        synth.triggerRelease();
        //Removing note from array
        pianoGame.removeNoteFromArray(key.dataset['realnote']);
    }


    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);


    const synth = new Tone.Synth().toMaster();
}