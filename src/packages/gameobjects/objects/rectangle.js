import {GameObject} from '../gameobject.js'
import {Vectors} from '../../vectors/index.js'
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
     * @returns Rectangle
     */
    constructor({x, y, width, height, rotation, rotationPosition, tag, color, z} = {}) {
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
    }

    /**
     * Is called every time the game updates, after the calc. Calls it's components render methods.
     * @param {number} x X Coordinate
     * @param {number} y Y Coordinate
     * @param {Renderer} renderer Renderer to be rendered with
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be used
     */
    render({x, y, renderer, framebuffer} = {}) {
        this.onBeforeRender({renderer: renderer})

        framebuffer.renderRectangle({
            x: x,
            y: y,
            width: this.dimensions.width,
            height: this.dimensions.height,
            color: this.color,
            rotation: this.rotation,
            rotationPosition: this.rotationPosition,
        })

        this.onAfterRender({renderer: renderer})
    }
}