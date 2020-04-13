function startKeyboard(){
    console.log('startKeyboard()');

    const keyboardDOM = document.getElementById('keyboard'); //Container for the HTML elements

    const key = class{
        constructor(note, octave, color, keyCode, keyChar, index){
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
        new key('c',4,'white',65, 'A', 0),
        new key('c#',4,'black',87, 'W', 0),
        new key('d',4,'white',83, 'S', 1),
        new key('d#',4,'black',69, 'E', 1),
        new key('e',4,'white',68, 'D', 2),
        new key('f',4,'white',70, 'F', 3),
        new key('f#',4,'black',84, 'T', 3),
        new key('g',4,'white',71, 'G', 4),
        new key('g#',4,'black',89, 'Y', 4),
        new key('a',4,'white',72, 'H', 5),
        new key('a#',4,'black',85, 'U', 5),
        new key('b',4,'white',74, 'J', 6),
        new key('c',5,'white',75, 'K', 7),
        new key('c#',5,'black',79, 'O', 7),
        new key('d',5,'white',76, 'L', 8),
    ]

    keys.forEach((key,index) => {
        //Create DOM key for each one
        const domKey = document.createElement('div');
        domKey.className = `keyboard__key ${key.color}__key`;
        domKey.dataset.keycode = key.keyCode;
        domKey.id = key.keyCode;
        domKey.style = (key.color === 'white') ? `left: calc(50px * ${key.index}); z-index: 0;` : `left: calc(35px + 50px * ${key.index}); z-index: 1;`;
        console.log(domKey);
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
        '65': false, 
        '83': false,
        '68': false,
        '70': false,
        '71': false,
        '72': false,
        '74': false,
        '75': false,
        '76': false,
        '87': false,
        '69': false,
        '89': false,
        '85': false,


    }

    function keyDown(e){
        
        //If already pressed, stop
        if(pressedKeys[e.keyCode]){ return }
        else pressedKeys[e.keyCode] = true;  

        console.log('key down:', e.keyCode);
        //Find the matching key element and highlight
        const key = document.getElementById(e.keyCode);
        console.log(key);
        if(key){
            key.classList.add('pressed');
        }
    }

    function keyUp(e){
        console.log('key up:', e.keyCode);
        //Find matching element and un-highlight
        const key = document.getElementById(e.keyCode);
        key && key.classList.remove('pressed');
        pressedKeys[e.keyCode] = false;
    }


    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

}