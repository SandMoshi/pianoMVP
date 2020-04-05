function startKeyboard(){
    console.log('startKeyboard()');

    const keyboardDOM = document.getElementById('keyboard'); //Container for the HTML elements

    const key = class{
        constructor(note, octave, color, keyCode, keyChar){
            this.color = color;
            this.vexNote = `${note}/${octave}`;
            this.midiNote = `${note.toUpperCase()}${octave}`;
            this.realNote = `${note.toUpperCase()}${octave}`;
            this.keyCode = keyCode;
            this.keyChar = keyChar; //represents the letter of the keyboard key
        }
    }

    const keys = [
        new key('c',4,'white',65, 'A'), 
        new key('d',4,'white',83, 'S'),
        new key('e',4,'white',68, 'D'),
        new key('f',4,'white',70, 'F'),
        new key('g',4,'white',71, 'G'),
        new key('a',4,'white',72, 'H'),
        new key('b',4,'white',74, 'J'),
        new key('c',5,'white',75, 'K'),
        new key('d',5,'white',76, 'L'),
    ]

    keys.forEach(key => {
        //Create DOM key for each one
        const domKey = document.createElement('div');
        domKey.className = `keyboard__key ${key.color}__key`;
        domKey.dataset.keycode = key.keyCode;
        domKey.id = key.keyCode;
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