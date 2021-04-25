import {Collider} from './collider.js'

/**
 * The RectangleCollider represents a specific type of collider. It's shape is (obviously) a rectangle.
 *
 * @class RectangleCollider
 */
export class RectangleCollider extends Collider {
    /**
     * Construct method of the object
     * @param {object} offset Offset vector of the collider from it's parent Object
     * @param {number} width Width of the collider
     * @param {number} height Height of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} parentObject Reference to the parent object
     * @param {object} debug Debug options (hitbox)
     * @returns RectangleCollider
     */
    constructor({offset, width, height, rotation, rotationPosition, parentObject, debug} = {}) {
        super({
            offset: offset,
            width: width,
            height: height,
            rotation: rotation,
            rotationPosition: rotationPosition,
            parentObject: parentObject,
            debug: debug
        })
    }

    /**
     * Render method of the RectangleCollider
     * @param {object} object Parent object for rendering purposes (e.g. Sprite)
     * @param {Renderer} renderer Renderer to be used
     * @returns {void}
     */
    onAfterRender({object, renderer}) {
        if (this.debug.hitbox) {
            let x = this.position.x + this.offset.x
            let y = this.position.y + this.offset.y

            renderer.strokeRect({
                x: x,
                y: y,
                width: this.dimensions.width,
                height: this.dimensions.height,
                color: "#de5a1f",
                rotation: this.rotation,
                rotationPosition: this.rotationPosition,
                lineWidth: 2
            })
        }
    }

    /**
     * Returns the positions of the (rotated) corners of the RectangleCollider
     * @returns {object}
     */
    getCorners(_this = this) {
        let center = _this.position.add({vector: _this.rotationPosition})
        return {
            "upperLeft": {
                x: center.x + ((_this.position.x - center.x) * Math.cos(_this.rotation) - (_this.position.y - center.y) * Math.sin(_this.rotation)),
                y: center.y + ((_this.position.x - center.x) * Math.sin(_this.rotation) + (_this.position.y - center.y) * Math.cos(_this.rotation))
            },
            "upperRight": {
                x: center.x + ((_this.position.x + _this.dimensions.width - center.x) * Math.cos(_this.rotation) - (_this.position.y - center.y) * Math.sin(_this.rotation)),
                y: center.y + ((_this.position.x + _this.dimensions.width - center.x) * Math.sin(_this.rotation) + (_this.position.y - center.y) * Math.cos(_this.rotation))
            },
            "lowerLeft": {
                x: center.x + ((_this.position.x - center.x) * Math.cos(_this.rotation) - (_this.position.y - center.y + _this.dimensions.height) * Math.sin(_this.rotation)),
                y: center.y + ((_this.position.x - center.x) * Math.sin(_this.rotation) + (_this.position.y - center.y + _this.dimensions.height) * Math.cos(_this.rotation))
            },
            "lowerRight": {
                x: center.x + ((_this.position.x + _this.dimensions.width - center.x) * Math.cos(_this.rotation) - (_this.position.y - center.y + _this.dimensions.height) * Math.sin(_this.rotation)),
                y: center.y + ((_this.position.x + _this.dimensions.width - center.x) * Math.sin(_this.rotation) + (_this.position.y - center.y + _this.dimensions.height) * Math.cos(_this.rotation))
            }
        }
    }
}