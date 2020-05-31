/**
* The Color class represents a color in rgba format.
*
* @class Color
*/
export class Color{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} r Red value of the color
     * @param {number} g Green value of the color
     * @param {number} b Blue value of the color
     * @param {number} a Alpha value of the color
     * @returns Color
     */
    constructor({r,g,b,a}={r:0,g:0,b:0,a:1}){
        this.r = r || 0
        this.g = g || 0
        this.b = b || 0
        this.a = a || 1
    }
    
    /**
     * Returns the String definition of a color
     * @method toString
     * @returns {string}
     */
    toString(_this=this){
        return `rgba(${_this.r},${_this.g},${_this.b},${_this.a})`;
    }
}