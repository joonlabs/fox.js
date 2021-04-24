/**
 * The Color class represents a color in rgba format.
 *
 * @class Color
 */
export class Color {
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} r Red value of the color (0-255)
     * @param {number} g Green value of the color (0-255)
     * @param {number} b Blue value of the color (0-255)
     * @param {number} a Alpha value of the color (0-1)
     * @returns Color
     */
    constructor({r, g, b, a} = {}) {
        this.r = r || 0
        this.g = g || 0
        this.b = b || 0
        this.a = a === undefined ? 1 : a
    }

    /**
     * Returns the String definition of a color
     * @method toString
     * @returns {string}
     */
    toString(_this = this) {
        return `rgba(${_this.r},${_this.g},${_this.b},${_this.a})`;
    }
}