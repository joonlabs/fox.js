import {Utils} from "../../utils/index.js";

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
     * Clones the vector and returns a new Vector-object
     * @returns {Vector}
     */
    clone() {
        // to be implemented by child class
    }

    /**
     * Returns the biggest component
     * @returns {number}
     */
    max() {
        // to be implemented by child class
    }

    /**
     * Returns the smallest component
     * @returns {number}
     */
    min() {
        // to be implemented by child class
    }

    /**
     * Adds two vectors
     * @method add
     * @param {Vector} vector Vector to be added
     * @returns {Vector}
     */
    add({vector} = {}) {
        // to be implemented by child class
    }

    /**
     * Subtracts two vectors
     * @method sub
     * @param {Vector} vector Vector to be subtracted
     * @returns {Vector}
     */
    sub({vector} = {}) {
        // to be implemented by child class
    }

    /**
     * Perfomes the hadamard product of two vectors
     * @method hadamard
     * @param {Vector} vector Vector to be hadamard multiplied with
     * @returns {Vector}
     */
    hadamard({vector} = {}) {
        // to be implemented by child class
    }

    /**
     * Perfomes the dot product of two vectors
     * @method dot
     * @param {Vector} vector Vector to be "dotted" with
     * @returns {Vector}
     */
    dotProduct({vector}) {
        // to be implemented by child class
    }

    /**
     * Adds a Scalar to a vector
     * @method addScalar
     * @param {number} scalar Scalar to be added
     * @returns {Vector}
     */
    addScalar({scalar}) {
        // to be implemented by child class
    }

    /**
     * Adds a Scalar to a vector
     * @method subScalar
     * @param {number} scalar Scalar to be subtracted
     * @returns {Vector}
     */
    subScalar({scalar}) {
        // to be implemented by child class
    }

    /**
     * Multiplies a Scalar with a vector
     * @method multScalar
     * @param {number} scalar Scalar to be multiplied with
     * @returns {Vector}
     */
    multScalar({scalar}) {
        // to be implemented by child class
    }
}