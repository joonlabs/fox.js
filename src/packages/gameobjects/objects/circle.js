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
     * @param {number} diameter Radius of the circle
     * @param {number} [rotation] Rotation of the circle
     * @param {object} [rotationPosition] Rotation position vector of the circle relative to it self
     * @param {string} [tag] Tag of the object fro grouping multiple objects logically together
     * @param {Color} [color] Color of the circle's fill
     * @param {number} [z] Depth information for sorting in layer
     * @param {boolean} [borderWidth] How large the border of the circle should be. If not set, fill the whole circle
     * @returns Circle
     */
    constructor({x, y, diameter, rotation, rotationPosition, tag, z, color, borderWidth} = {}) {
        super({
            x: x,
            y: y,
            width: diameter,
            height: diameter,
            rotation: rotation,
            rotationPosition: rotationPosition,
            z: z,
            tag: tag
        })

        this.color = color || new Color()
        this.diameter = diameter
        this.borderWidth = borderWidth
    }

    /**
     * Is called every time the game updates, after the calc. Calls it's component render methods.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        this.onBeforeRender({offset: offset, framebuffer: framebuffer})

        let x_ = this.position.x + this.dimensions.width / 2,
            y_ = this.position.y + this.dimensions.height / 2


        let renderParams = {
            x: x_,
            y: y_,
            radius: this.diameter / 2,
            rotation: this.rotation,
            rotationPosition: this.rotationPosition,
            color: this.color,
            borderWidth: this.borderWidth
        }
        if (this.borderWidth === undefined) {
            framebuffer.fillCircle(renderParams)
        } else {
            framebuffer.strokeCircle(renderParams)
        }

        this.onAfterRender({offset: offset, framebuffer: framebuffer})
    }
}