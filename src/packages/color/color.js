/**
 * The Color class represents a color in rgba format.
 *
 * @class Color
 */
export class Color {
    r;
    g;
    b;
    a;

    /**
     * Construct method of the object
     * @method constructor
     * @param {number} [r] Red value of the color (0-255)
     * @param {number} [g] Green value of the color (0-255)
     * @param {number} [b] Blue value of the color (0-255)
     * @param {number} [a] Alpha value of the color (0-1)
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

    /**
     * Returns the objects values as an RGBA list
     * @returns {[number, number, number, number]} An RGBA list
     */
    asRGBAList() {
        return [this.r, this.g, this.b, this.a]
    }

    /**
     * Returns the normalized objects values as an RGBA list
     * Both colors and the alpha value are between 0 and 1
     * Mostly used for WebGL
     * @returns {[number, number, number, number]} An RGBA list
     */
    asNormalizedRGBAList() {
        return [this.r / 255, this.g / 255, this.b / 255, this.a]
    }

    /**
     * Returns the objects values as an RGB list
     * @returns {[number, number, number]} An RGB list
     */
    asRGBList() {
        return [this.r, this.g, this.b]
    }

    /**
     * Clones the color and returns a new Color-object
     * @returns {Color}
     */
    clone() {
        return new Color({
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a,
        })
    }
}