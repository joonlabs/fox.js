import {GameObjects} from '../gameobjects/index.js'
import {Color} from '../color/index.js'
import {GameObject} from '../gameobjects/gameobject.js'
import {Utils} from "../utils/index.js";

/**
 * The Particle Class controlls a particle over time, it's position, velocity and acceleration
 *
 * @class Particle
 */
export class Particle extends GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the particle
     * @param {number} y Y-position of the particle
     * @param {object} velocity Vector for start velocity
     * @param {object} acceleration Vector for start acceleration
     * @param {number} width Width of the collider
     * @param {number} height Height of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} renderObject Object to be renderd (eg. sprite, rectangle, circle, ...)
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together
     * @param {number} z Depth information for sorting in layer
     * @returns Particle
     */
    constructor({x, y, width, height, velocity, acceleration, rotation, rotationPosition, renderObject, tag, z} = {}) {
        super({
            x: x,
            y: y,
            width: width || 5,
            height: height || 5,
            rotation: rotation,
            rotationPosition: rotationPosition,
            z: z,
            tag: tag
        })

        this.velocity = {
            x: velocity && velocity.x ? velocity.x : 0,
            y: velocity && velocity.y ? velocity.y : 0,
        }
        this.acceleration = {
            x: acceleration && acceleration.x ? acceleration.x : 0,
            y: acceleration && acceleration.y ? acceleration.y : 0,
        }

        this.dead = true
        this.renderObject = renderObject || new GameObjects.Rectangle({
            x: this.position.x,
            y: this.position.y,
            width: 5,
            height: 5,
            color: new Color(),
            layer: this.layer
        })
    }

    /**
     * Is called every time the game updates. Calls it's component calc methods and updates it' position based on velocity and acceleration.
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @method calc
     * @return {void}
     */
    calc({timestep} = {}) {
        this.componentHolder.onCalc({object: this, timestep})

        this.position = {
            x: (this.position.x + this.velocity.x * timestep),
            y: (this.position.y + this.velocity.y * timestep),
        }
        this.velocity = {
            x: this.velocity.x + this.acceleration.x * timestep,
            y: this.velocity.y + this.acceleration.y * timestep,
        }
    }

    /**
     * Is called after every time the game updated.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        this.onBeforeRender({offset: offset, framebuffer: framebuffer})

        if (!this.renderObject instanceof GameObject) {
            Utils.warn("fox: particle: You're trying to render a particle, that has no render object. " +
                "please specify any kind of gameobject e.g. a rectangle")
        }else{
            this.renderObject.render({
                offset: offset,
                framebuffer: framebuffer
            })
        }

        this.onAfterRender({offset: offset, framebuffer: framebuffer})
    }
}