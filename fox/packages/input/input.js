import {Touch} from './touch.js'
/**
* The Input is the game engine's default input system and provides information about cursor, keyboard, touch and gamepad inputs 
*
* @class Input
*/
export class Input{
    /**
     * Fetches the available gamepads from the browser and updates them internally 
     * @method updateGamePads
     * @return {void}
     */
    static updateGamePads(){
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let gamepads_ = []
        for(let gamepad of gamepads){
            if(gamepad==null) continue
            gamepads_.push(gamepad)
        }
        if(gamepads_!=Input.inputs.gamepads) Input.inputs.gamepads=gamepads_
    }
    
    /**
     * Checks if gamepad with given idx is connected
     * @method hasGamePad
     * @param {number} idx Index of the gamepad
     * @return {boolean}
     */
    static hasGamePad({idx}={}){
        return Input.getGamePad({idx:idx})!=undefined
    }
    
    /**
     * Returns a gamepad for input reading
     * @method getGamePad
     * @param {number} idx Index of the gamepad
     * @return {object}
     */
    static getGamePad({idx}={}){
        return Input.inputs.gamepads[idx];
    }
    
    /**
     * Checks if a specific key (by identifier, e.g. 'Input.keys.Space', or index) is pressed
     * @method isKeyDown
     * @param {number} key Keycode of key
     * @return {boolean}
     */
    static isKeyDown({key}={}){
        return Input.keydown.hasOwnProperty(key) && Input.keydown[key]
    }
    
    /**
     * Returns all touches for input reading
     * @method getTouches
     * @return {object[]}
     */
    static getTouches(){
        return Input.inputs.touches
    }
}

Input.keys = {"Space": 32, "Backspace": 8,"Tab": 9,"Enter": 13,"Shift": 16,"Ctrl": 17,"Alt": 18,"Pause/Break": 19,"Caps Lock": 20,"Esc": 27,"Page Up": 33,"Page Down": 34,"End": 35,"Home": 36,"Left": 37,"Up": 38,"Right": 39,"Down": 40,"Insert": 45,"Delete": 46,"0": 48,"1": 49,"2": 50,"3": 51,"4": 52,"5": 53,"6": 54,"7": 55,"8": 56,"9": 57,"A": 65,"B": 66,"C": 67,"D": 68,"E": 69,"F": 70,"G": 71,"H": 72,"I": 73,"J": 74,"K": 75,"L": 76,"M": 77,"N": 78,"O": 79,"P": 80,"Q": 81,"R": 82,"S": 83,"T": 84,"U": 85,"V": 86,"W": 87,"X": 88,"Y": 89,"Z": 90,"Left WinKey": 91,"Right WinKey": 92,"Select": 93,"NumPad 0": 96,"NumPad 1": 97,"NumPad 2": 98,"NumPad 3": 99,"NumPad 4": 100,"NumPad 5": 101,"NumPad 6": 102,"NumPad 7": 103,"NumPad 8": 104,"NumPad 9": 105,"NumPad *": 106,"NumPad +": 107,"NumPad -": 109,"NumPad .": 110,"NumPad /": 111,"F1": 112,"F2": 113,"F3": 114,"F4": 115,"F5": 116,"F6": 117,"F7": 118,"F8": 119,"F9": 120,"F10": 121,"F11": 122,"F12": 123,"Num Lock": 144,"Scroll Lock": 145,";": 186,"=": 187,",": 188,"-": 189,".": 190,"/": 191,"`": 192,"[": 219,"\\": 220,"]": 221,"'": 222}
Input.keydown = {}
Input.inputs = {
    "touches" : [],
    "gamepads" : []
}
Input.cursor = {
        "isdown" : false,
        "x" : 0,
        "y" : 0,
    }

window.addEventListener("keydown", function(e){ Input.keydown[e.keyCode] = true })
window.addEventListener("keyup", function(e){ delete Input.keydown[e.keyCode] })

//cursor input
window.addEventListener("mousedown", function(e){ 
    Input.cursor.isdown = true
    Input.cursor.x = e.clientX
    Input.cursor.y = e.clientY
})
window.addEventListener("mouseup", function(e){ 
    Input.cursor.isdown = false 
})
window.addEventListener("mousemove", function(e){ 
    Input.cursor.x = e.clientX
    Input.cursor.y = e.clientY
})

//touch input
window.addEventListener("touchstart", function(e){
    for(let touch of e.touches){
        Input.inputs.touches.push(new Touch({identifier:touch.identifier, x:touch.clientX, y:touch.clientY}))
    }
})
window.addEventListener("touchmove", function(e){
    for(let touch of e.touches){
        Input.inputs.touches.filter(t => t.identifier==touch.identifier)[0].position = {x:touch.clientX,y:touch.clientY}
    }
})
window.addEventListener("touchend", function(e){
    for(let touch of e.changedTouches){
        let touch_ = Input.inputs.touches.filter(t => t.identifier==touch.identifier)[0]
        Input.inputs.touches.splice(Input.inputs.touches.indexOf(touch_),1)
    }
})
window.addEventListener("touchcancel", function(e){
    for(let touch of e.changedTouches){
        let touch_ = Input.inputs.touches.filter(t => t.identifier==touch.identifier)[0]
        Input.inputs.touches.splice(Input.inputs.touches.indexOf(touch_),1)
    }   
})