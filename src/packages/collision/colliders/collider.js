import {Component} from '../../components/index.js'
import {Vectors} from '../../vectors/index.js'

/**
 * The Collider represents a hitbox for any gameobject that supports a collider. A Collider cannot be rendered,
 * shown, or added to a scene by itself, but needs a parent object in order to exist.
 * However, keep in mind that the x and y coordinates for a collider are passed by it's parentObject and cannot be set by yourself.
 *
 * @class Collider
 */
export class Collider extends Component {
    /**
     * Constructs the Collider Object
     *
     * @param {object} offset
     * @param {number} width
     * @param {number} height
     * @param {number} rotation
     * @param {number} rotationPosition
     * @param {object} parentObject
     * @param {object} debug
     * @return Collider
     */
    constructor({offset, width, height, rotation, rotationPosition, parentObject, debug} = {}) {
        super()

        offset = offset || new Vectors.Vec2D()
        this.offset = new Vectors.Vec2D({x: offset.x, y: offset.y})

        this.position = new Vectors.Vec2D()

        this.rotation = (rotation === undefined) ? 0 : rotation
        this.rotationPosition = (rotationPosition === undefined) ? new Vectors.Vec2D({
            x: parseInt(width / 2),
            y: parseInt(height / 2)
        }) : new Vectors.Vec2D({x: rotationPosition.x, y: rotationPosition.y})

        this.parentObject = parentObject

        this.dimensions = {
            "width": width,
            "height": height,
        }

        this.debug = {
            enabled: debug != undefined,
            hitbox: (debug != undefined && debug.hitbox != undefined && debug.hitbox)
        }
    }

    /**
     * Is called when the component is intatiated
     * @param {object} object
     * @return {void}
     */
    onInit({object} = {}, _this = this) {
        //override the default position with the position of the parentObject
        _this.position.x = object.position.x + _this.offset.x
        _this.position.y = object.position.y + _this.offset.y
    }

    /**
     * Is called whenever the next frame is calculated. The collider's position is updated by the position of the parent object.
     * @param {object} object
     * @return {void}
     */
    onCalc({timestep, object} = {}, _this = this) {
        _this.position = object.position.add({vector: _this.offset})
        _this.rotation = object.rotation
        _this.rotationPosition = object.rotationPosition.sub({vector: _this.offset})
    }
}