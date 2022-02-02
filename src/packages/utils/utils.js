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
        Utils.storage.webGLEnabled = !!ctx;
        return Utils.storage.webGLEnabled
    }

    /**
     * Shallow compares two objects. Iff every property of both objects are equal then true is returned.
     * If either parameter is not an object then false is returned.
     * If both objects contain no properties then true is returned.
     *
     * @param obj1
     * @param obj2
     * @returns {boolean} All object properties are equal
     */
    static shallowEquals(obj1, obj2) {
        if (!(obj1 instanceof Object && obj2 instanceof Object)) return false

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        return keys1.length === keys2.length && keys1.every((key) => obj1[key] === obj2[key])
    }
}

Utils.infoMessages = []
Utils.warnedMessages = []
Utils.errorMessages = []
Utils.storage = {
    webGLEnabled: undefined
}