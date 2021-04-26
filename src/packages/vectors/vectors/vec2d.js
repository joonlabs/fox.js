import {Vector} from './vector.js'

/**
 * The Vec2D class represents a 2D Vector with a x and y coordinate
 *
 * @class Vec2D
 */
export class Vec2D extends Vector {
    /**
     * Construct method of the object
     * @method constructor
     * @returns Vec2D
     */
    constructor({x, y} = {}) {
        super()
        this.x = x || 0
        this.y = y || 0
    }

    clone() {
        return new Vec2D({x: this.x, y: this.y})
    }
}