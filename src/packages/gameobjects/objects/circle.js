import {GameObject} from '../gameobject.js'
import {Vectors} from '../../vectors/index.js'
import {Color} from '../../color/index.js'

/**
 * The Circle represents just a basic circle that can be tinted in a specific color
 *
 * @class Circle
 */
export class Circle extends GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the circle
     * @param {number} y Y-position of the circle
     * @param {number} width Width of the circle
     * @param {number} height Height of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition Rotation position vector of the circle relative to it self
     * @param {number} angleStart Starting angle of the circle's fill
     * @param {number} angleEnd Ending angle of the circle's fill
     * @param {string} tag Tag of the object fro grouping multiple objects logically together
     * @param {Color} color Color of the circle's fill
     * @param {number} z Depth information for sorting in layer
     * @returns Circle
     */
    constructor({x, y, width, height, rotation, rotationPosition, angleStart, angleEnd, tag, z, color} = {}) {
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

        this.angleStart = angleStart || 0
        this.angleEnd = angleEnd || Math.PI * 2

        this.color = color || new Color()
    }

    /**
     * Is called every time the game updates, after the calc. Calls it's components render methods.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        this.onBeforeRender({offset: offset, framebuffer: framebuffer})

        let x_ = this.position.x + this.dimensions.width / 2,
            y_ = this.position.y + this.dimensions.height / 2,
            radius = this.dimensions.width / 2

        framebuffer.renderCircle({
            x: x_,
            y: y_,
            radius: radius,
            rotation: this.rotation,
            rotationPosition: this.rotationPosition,
            angleStart: this.angleStart,
            angleEnd: this.angleEnd,
            color: this.color,
            ctx: this.layer.ctx
        })

        this.onAfterRender({offset: offset, framebuffer: framebuffer})
    }
}