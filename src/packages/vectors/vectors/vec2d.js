import {Vector} from './vector.js'
import {Utils} from "../../utils/utils.js";

/**
 * The Vec2D class represents a 2D Vector with a x and y coordinate
 *
 * @class Vec2D
 */
export class Vec2D extends Vector {
    x;
    y;

    static ZERO = Object.freeze(new Vec2D())
    static ONE = Object.freeze(new Vec2D({x: 1, y: 1}))

    static UP = Object.freeze(new Vec2D({y: 1}))
    static DOWN = Object.freeze(new Vec2D({y: -1}))
    static LEFT = Object.freeze(new Vec2D({x: 1}))
    static RIGHT = Object.freeze(new Vec2D({x: -1}))

    get width() {
        return this.x
    }

    get height() {
        return this.y
    }

    set width(value) {
        this.x = value
    }

    set height(value) {
        this.y = value
    }

    /**
     * Construct method of the Vec2D class
     * @method constructor
     * @param {number} [x] x value of the vector
     * @param {number} [y] y value of the vector
     * @param {number} [width] Alias for the x value of the vector
     * @param {number} [height] Alias for the y value of the vector
     * @returns Vec2D
     */
    constructor({x, y, width, height} = {}) {
        super()
        this.x = x || width || 0
        this.y = y || height || 0
    }

    /**
     * Clones the vector and returns a new Vec2D-object
     * @returns {Vec2D}
     */
    clone() {
        return new Vec2D({x: this.x, y: this.y})
    }

    /**
     * Returns the biggest component
     * @returns {number}
     */
    max() {
        return Math.max(this.x, this.y)
    }

    /**
     * Returns the smallest component
     * @returns {number}
     */
    min() {
        return Math.min(this.x, this.y)
    }

    /**
     * Adds two vectors
     * @method add
     * @param {Vec2D} vector Vector to be added
     * @returns {Vec2D}
     */
    add({vector} = {}) {
        if (vector.constructor.name !== "Vec2D") {
            Utils.warn("fox: vector: you're trying to add at least one object that is not a Vec2D. this operation failed.")
            return
        }
        return new Vec2D({x: vector.x + this.x, y: vector.y + this.y})
    }

    /**
     * Subtracts two vectors
     * @method sub
     * @param {Vec2D} vector Vector to be subtracted
     * @returns {Vec2D}
     */
    sub({vector} = {}) {
        if (vector.constructor.name !== "Vec2D") {
            Utils.warn("fox: vector: you're trying to subtract at least one object that is not a Vec2D. this operation failed.")
            return
        }
        return new Vec2D({x: this.x - vector.x, y: this.y - vector.y})
    }

    /**
     * Performs the hadamard product of two vectors
     * @method hadamard
     * @param {Vec2D} vector Vector to be hadamard multiplied with
     * @returns {Vec2D}
     */
    hadamard({vector} = {}) {
        if (vector.constructor.name !== "Vec2D") {
            Utils.warn("fox: vector: you're trying calculate the hadamard product of at least one object that is not a Vec2D. this operation failed.")
            return
        }
        return new Vec2D({x: vector.x * this.x, y: vector.y * this.y})
    }

    /**
     * Performs the dot product of two vectors
     * @method dot
     * @param {Vec2D} vector Vector to be "dotted" with
     * @returns {number}
     */
    dotProduct({vector}) {
        if (vector.constructor.name !== "Vec2D") {
            Utils.warn("fox: vector: you're trying to calculate the dot product of at least one object that is not a Vec2D. this operation failed.")
            return
        }
        return (vector.x * this.x + vector.y * this.y)
    }

    /**
     * Adds a scalar to a vector
     * @method addScalar
     * @param {number} scalar Scalar to be added
     * @returns {Vec2D}
     */
    addScalar({scalar}) {
        return new Vec2D({x: scalar + this.x, y: scalar + this.y})
    }

    /**
     * Subtracts a scalar from a vector
     * @method subScalar
     * @param {number} scalar Scalar to be subtracted
     * @returns {Vec2D}
     */
    subScalar({scalar}) {
        return new Vec2D({x: this.x - scalar, y: this.y - scalar})
    }

    /**
     * Multiplies a scalar with a vector
     * @method multScalar
     * @param {number} scalar Scalar to be multiplied with
     * @returns {Vec2D}
     */
    multScalar({scalar}) {
        return new Vec2D({x: scalar * this.x, y: scalar * this.y})
    }
}