import {GameObject} from '../gameobject.js'
import {Color} from '../../color/index.js'

/**
 * The Rectangle represents just a basic rectangle that can be tinted in a specific color
 *
 * @class Rectangle
 */
export class Rectangle extends GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the rectangle
     * @param {number} y Y-position of the rectangle
     * @param {number} width Width of the rectangle
     * @param {number} height Height of the rectangle
     * @param {number} rotation Rotation of the rectangle
     * @param {object} rotationPosition Rotation position vector of the rectangle relative to itself
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together
     * @param {Color} color Color of the circle's fill
     * @param {number} z Depth information for sorting in layer
     * @param {boolean} [borderWidth] How large the border of the rectangle should be. If not set, fill the whole rectangle
     * @returns Rectangle
     */
    constructor({x, y, width, height, rotation, rotationPosition, tag, color, z, borderWidth} = {}) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: rotation,
            rotationPosition: rotationPosition,
            z: z,
            tag: tag
        })

        this.color = color || new Color()
        this.borderWidth = borderWidth
    }

    /**
     * Is called every time the game updates, after the calc. Calls it's component render methods.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        this.onBeforeRender({offset: offset, framebuffer: framebuffer})

        let renderParams = {
            x: this.position.x + offset.x,
            y: this.position.y + offset.y,
            width: this.dimensions.width,
            height: this.dimensions.height,
            color: this.color,
            rotation: this.rotation,
            rotationPosition: this.rotationPosition,
            borderWidth: this.borderWidth
        }

        if (this.borderWidth === undefined) {
            framebuffer.fillRectangle(renderParams)
        } else {
            framebuffer.strokeRectangle(renderParams)
        }

        this.onAfterRender({offset: offset, framebuffer: framebuffer})
    }
}