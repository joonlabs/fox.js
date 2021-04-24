import {Touch} from './touch.js'

/**
 * The Input is the game engine's default input system and provides information about cursor, keyboard, touch and gamepad inputs
 *
 * @class Input
 */
export class Input {
    /**
     * Fetches the available gamepads from the browser and updates them internally
     * @return {void}
     */
    static updateGamePads() {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let gamepads_ = []
        for (let gamepad of gamepads) {
            if (gamepad == null) continue
            gamepads_.push(gamepad)
        }
        if (gamepads_ !== Input.inputs.gamepads) Input.inputs.gamepads = gamepads_
    }

    /**
     * Checks if gamepad with given idx is connected
     * @param {number} idx Index of the gamepad
     * @return {boolean}
     */
    static hasGamePad({idx} = {}) {
        return Input.getGamePad({idx: idx}) !== undefined
    }

    /**
     * Returns a gamepad for input reading
     * @param {number} idx Index of the gamepad
     * @return {object}
     */
    static getGamePad({idx} = {}) {
        return Input.inputs.gamepads[idx];
    }

    /**
     * Checks if a specific key (by identifier, e.g. 'a', or index) is pressed
     * @param {string} key Keycode of key
     * @return {boolean}
     */
    static isKeyDown({key} = {}) {
        return Input.keydown.hasOwnProperty(key) && Input.keydown[key]
    }

    /**
     * Returns all touches for input reading
     * @return {object[]}
     */
    static getTouches() {
        return Input.inputs.touches
    }
}

Input.keydown = {}
Input.inputs = {
    "touches": [],
    "gamepads": []
}
Input.cursor = {
    "isdown": false,
    "x": 0,
    "y": 0,
}

window.addEventListener("keydown", function (e) {
    Input.keydown[e.key] = true
})
window.addEventListener("keyup", function (e) {
    delete Input.keydown[e.key]
})

//cursor input
window.addEventListener("mousedown", function (e) {
    Input.cursor.isdown = true
    Input.cursor.x = e.clientX
    Input.cursor.y = e.clientY
})
window.addEventListener("mouseup", function (e) {
    Input.cursor.isdown = false
})
window.addEventListener("mousemove", function (e) {
    Input.cursor.x = e.clientX
    Input.cursor.y = e.clientY
})

//touch input
window.addEventListener("touchstart", function (e) {
    for (let touch of e.touches) {
        Input.inputs.touches.push(new Touch({identifier: touch.identifier, x: touch.clientX, y: touch.clientY}))
    }
})
window.addEventListener("touchmove", function (e) {
    for (let touch of e.touches) {
        Input.inputs.touches.filter(t => t.identifier === touch.identifier)[0].position = {
            x: touch.clientX,
            y: touch.clientY
        }
    }
})
window.addEventListener("touchend", function (e) {
    for (let touch of e.changedTouches) {
        let touch_ = Input.inputs.touches.filter(t => t.identifier === touch.identifier)[0]
        Input.inputs.touches.splice(Input.inputs.touches.indexOf(touch_), 1)
    }
})
window.addEventListener("touchcancel", function (e) {
    for (let touch of e.changedTouches) {
        let touch_ = Input.inputs.touches.filter(t => t.identifier === touch.identifier)[0]
        Input.inputs.touches.splice(Input.inputs.touches.indexOf(touch_), 1)
    }
})