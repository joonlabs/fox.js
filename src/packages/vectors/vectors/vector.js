import {Vec2D} from './vec2d.js';

/**
 * The Vector class provides the blueprint and methods for vector operations
 *
 * @class Vector
 */
export class Vector {
    /**
     * Construct method of the object
     * @method constructor
     * @returns Vector
     */
    constructor() {
    }

    /**
     * Adds two vectors
     * @method add
     * @param {object} vector Vector to be added
     * @param {object} _this reference to itself
     * @returns {object}
     */
    add({vector} = {}, _this = this) {
        if (vector.constructor.name !== "Vec2D" || _this.constructor.name !== "Vec2D") {
            console.warn("fox: vector: you're trying to add at least one object that is not a vector. this operation failed.");
            return;
        }
        return new Vec2D({x: vector.x + _this.x, y: vector.y + _this.y})
    }

    /**
     * Subtracts two vectors
     * @method sub
     * @param {object} vector Vector to be subtracted
     * @param {object} _this reference to itself
     * @returns {object}
     */
    sub({vector} = {}, _this = this) {
        if (vector.constructor.name !== "Vec2D" || _this.constructor.name !== "Vec2D") {
            console.warn("fox: vector: you're trying to subtract at least one object that is not a vector. this operation failed.");
            return;
        }
        return new Vec2D({x: _this.x - vector.x, y: _this.y - vector.y})
    }

    /**
     * Perfomes the hadamard product of two vectors
     * @method hadamard
     * @param {object} vector Vector to be hadamard multiplied with
     * @param {object} _this reference to itself
     * @returns {object}
     */
    hadamard({vector} = {}, _this = this) {
        return new Vec2D({x: vector.x * _this.x, y: vector.y * _this.y})
    }

    /**
     * Perfomes the dot product of two vectors
     * @method dot
     * @param {object} vector Vector to be "dotted" with
     * @param {object} _this reference to itself
     * @returns {object}
     */
    dotProduct({vector} = {}, _this = this) {
        return (vector.x * _this.x + vector.y * _this.y)
    }

    /**
     * Adds a Scalar to a vector
     * @method addScalar
     * @param {number} scalar Scalar to be added
     * @param {object} _this reference to itself
     * @returns {object}
     */
    addScalar({scalar} = {}, _this = this) {
        return new Vec2D({x: scalar + _this.x, y: scalar + _this.y})
    }

    /**
     * Adds a Scalar to a vector
     * @method subScalar
     * @param {number} scalar Scalar to be subtracted
     * @param {object} _this reference to itself
     * @returns {object}
     */
    subScalar({scalar} = {}, _this = this) {
        return new Vec2D({x: _this.x - scalar, y: _this.y - scalar})
    }

    /**
     * Multiplies a Scalar with a vector
     * @method multScalar
     * @param {number} scalar Scalar to be multiplied with
     * @param {object} _this reference to itself
     * @returns {object}
     */
    multScalar({scalar} = {}, _this = this) {
        return new Vec2D({x: scalar * _this.x, y: scalar * _this.y})
    }
}