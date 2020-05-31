import {Color} from '../color/index.js'
/**
* The Random class provides several,randomly generated, data types for the game (engine)
*
* @class Random
*/
export class Random{
    /**
     * Returns a random float between min (incl.) and max (excl.)
     * @method range
     * @param {number} min Minimum in range (incl.)
     * @param {number} max Maximum in range (excl.)
     * @returns {number}
     */
    static range({min, max}={min:0, max:1}){
        return Math.random() * (max - min) + min;
    }
    
    /**
     * Returns a random integer between min (incl.) and max (incl.)
     * @method rangeInt
     * @param {number} min Minimum in range (incl.)
     * @param {number} max Maximum in range (incl.)
     * @returns {number}
     */
    static rangeInt({min, max}={min:0, max:1}){
        return parseInt(Math.random() * (max+1 - min) + min);
    }
    
    
    /**
     * Returns a random color width / or without alpha channel
     * @method color
     * @param {boolean} useAlpha Alpha channel used in color or not
     * @returns Color
     */
    static color({useAlpha}={useAlpha:false}){
        return new Color({
            r:Random.rangeInt({min:0, max:255}),
            g:Random.rangeInt({min:0, max:255}),
            b:Random.rangeInt({min:0, max:255}),
            a: useAlpha ? Random.range({min:0, max:1}) : 1
        })
    }
}