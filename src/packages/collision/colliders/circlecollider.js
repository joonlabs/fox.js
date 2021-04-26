import {Collider} from './collider.js'

/**
 * The CircleCollider represents a specific type of collider. It's shape is (obviously) a circle.
 *
 * @class CircleCollider
 */
export class CircleCollider extends Collider {
    /**
     * Construct method of the object
     * @param {number} x X-position of the collider
     * @param {number} y Y-position of the collider
     * @param {object} offset Offset vector of the collider from it's parent Object
     * @param {number} radius Radius of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} parentObject Reference to the parent object
     * @param {object} debug Debug options (hitbox)
     * @returns CircleCollider
     */
    constructor({x, y, offset, radius, rotation, rotationPosition, parentObject, debug} = {}) {
        super({
            x: x,
            y: y,
            offset: offset,
            width: radius * 2,
            height: radius * 2,
            rotation: rotation,
            rotationPosition: rotationPosition,
            parentObject: parentObject,
            debug: debug
        })
    }

    /**
     * Render method of the CircleCollider
     * @param {object} object Parent object for rendering purposes (e.g. Sprite)
     * @param {Renderer} renderer Renderer to be used
     * @returns {void}
     */
    onAfterRender({object, renderer}) {
        if (this.debug.hitbox) {
            let x = this.position.x + this.offset.x
            let y = this.position.y + this.offset.y

            renderer.strokeCircle({
                x: x,
                y: y,
                radius: this.dimensions.width / 2,
                angleStart: 0,
                angleEnd: Math.PI * 2,
                color: "#de5a1f",
                rotation: this.rotation,
                rotationPosition: this.rotationPosition,
                lineWidth: 2
            })
        }
    }
}