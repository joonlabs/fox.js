export class Utils {

    /**
     * Prints an info to the console, but only once
     */
    static info() {
        if (Utils.infoMessages.indexOf(arguments[0]) === -1) {
            Utils.infoMessages.push(arguments[0])
            console.info(...arguments)
        }
    }

    /**
     * Prints a warning to the console, but only once
     */
    static warn() {
        if (Utils.warnedMessages.indexOf(arguments[0]) === -1) {
            Utils.warnedMessages.push(arguments[0])
            console.warn(...arguments)
        }
    }

    /**
     * Prints an error to the console, but only once
     */
    static error() {
        if (Utils.errorMessages.indexOf(arguments[0]) === -1) {
            Utils.errorMessages.push(arguments[0])
            console.warn(...arguments)
        }
    }

    /**
     * Prints an error to the console, but only once
     */
    static isWebGLAvailable() {
        if (Utils.storage.webGLEnabled !== undefined) {
            return Utils.storage.webGLEnabled
        }
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('webgl')
        if (ctx) {
            Utils.storage.webGLEnabled = true
        } else {
            Utils.storage.webGLEnabled = false
        }
        return Utils.storage.webGLEnabled
    }
}

Utils.infoMessages = []
Utils.warnedMessages = []
Utils.errorMessages = []
Utils.storage = {
    webGLEnabled: undefined
}