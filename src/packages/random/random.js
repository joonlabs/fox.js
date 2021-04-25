import {Color} from '../color/index.js'

/**
 * The Random class provides several,randomly generated, data types for the game (engine)
 *
 * @class Random
 */
export class Random {
    /**
     * Returns a random float between min (incl.) and max (excl.)
     * @param {number} min Minimum in range (incl.)
     * @param {number} max Maximum in range (excl.)
     * @returns {number}
     */
    static range({min, max} = {min: 0, max: 1}) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random integer between min (incl.) and max (incl.)
     * @param {number} min Minimum in range (incl.)
     * @param {number} max Maximum in range (incl.)
     * @returns {number}
     */
    static rangeInt({min, max} = {min: 0, max: 1}) {
        return parseInt(Math.random() * (max + 1 - min) + min);
    }


    /**
     * Returns a random color width / or without alpha channel
     * @param {boolean} useAlpha Alpha channel used in color or not
     * @returns {Color}
     */
    static color({useAlpha} = {useAlpha: false}) {
        return new Color({
            r: Random.range({min: 0, max: 1}),
            g: Random.range({min: 0, max: 1}),
            b: Random.range({min: 0, max: 1}),
            a: useAlpha ? Random.range({min: 0, max: 1}) : 1
        })
    }

    /**
     * Returns a random ID as string
     * @constructor
     */
    static ID() {
        let array = new Uint32Array(8)
        window.crypto.getRandomValues(array)
        let str = ''
        for (let i = 0; i < array.length; i++) {
            str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4)
        }
        return str
    }
}