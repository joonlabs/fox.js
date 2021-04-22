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
     * @method constructor
     * @param {number} x X-position of the rectangle
     * @param {number} y Y-position of the rectangle
     * @param {number} width Width of the rectangle
     * @param {number} height Height of the rectangle
     * @param {number} rotation Rotation of the rectangle
     * @param {object} rotationPosition Rotation position vector of the rectangle relative to itself
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together
     * @param {object} color Color of the circle's fill
     * @param {object} collider Collider of the circle
     * @param {number} z Depth information for sorting in layer
     * @param {object} debug Debug options (hitbox)
     * @returns Rectangle
     */
    constructor({x, y, width, height, rotation, rotationPosition, layer, tag, color, collider, z, debug} = {}) {
        super({
            x: (x == undefined ? 0 : x),
            y: (y == undefined ? 0 : y),
            width: (width == undefined ? 100 : width),
            height: (height == undefined ? 100 : height),
            rotation: rotation,
            rotationPosition: rotationPosition,
            layer: layer,
            z: z,
            tag: tag
        })

        this.color = color == undefined ? new Color() : color
        this.debug = {
            enabled: debug != undefined,
            hitbox: (debug != undefined && debug.hitbox != undefined && debug.hitbox)
        }
    }


    /**
     * Is called every time the game updates. Calls it's components calc methods.
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep} = {}, _this = this) {
        for (let component of _this.components) {
            if (typeof component.onCalc === "function") component.onCalc({timestep: timestep, object: _this})
        }
    }

    /**
     * Is called every time the game updates, after the calc. Calls it's components render methods.
     * @method render
     * @param {number} x X-position to be drawn (by camera)
     * @param {number} y Y-position to be drawn (by camera)
     * @param {object} camera Camera object that caused the method
     * @param {object} renderer Renderer that will render the object
     * @returns {void}
     */
    render({x, y, width, height, camera, renderer} = {}, _this = this) {
        for (let component of _this.components) {
            if (typeof component.onBeforeRender === "function") component.onBeforeRender({
                x: x,
                y: y,
                width: width,
                height: height,
                camera: camera,
                renderer: renderer,
                object: _this
            })
        }

        let rotationPosition = _this.rotationPosition

        renderer.fillRect({
            x: x,
            y: y,
            width: width,
            height: height,
            color: _this.color,
            rotation: _this.rotation,
            rotationPosition: rotationPosition,
            ctx: _this.layer.ctx
        })

        if (_this.collider != undefined) _this.collider.render({x, y, camera})

        for (let component of _this.components) {
            if (typeof component.onAfterRender === "function") component.onAfterRender({
                x: x,
                y: y,
                width: width,
                height: height,
                camera: camera,
                renderer: renderer,
                object: _this
            })
        }
    }
}