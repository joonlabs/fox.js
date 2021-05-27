import {Vectors} from '../vectors/index.js'
import {Utils} from '../utils/index.js'
import {Vec2D} from "../vectors/vectors/vec2d.js";
import {ComponentHolder} from "../component/index.js";

/**
 * The GameObject represents the basic object of the engine. All kind of sprites, etc. extend it
 *
 * @class GameObject
 */
export class GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the game object
     * @param {number} y Y-position of the game object
     * @param {number} width Width of the game object
     * @param {number} height Height of the game object
     * @param {number} rotation Rotation of the game object
     * @param {object} rotationPosition Rotation position vector of the Colligame objectder relative to it self
     * @param {string} tag Tag of the object for grouping multiple objects logically together
     * @param {number} z Depth information for sorting in layer
     * @param {object} debug Debug options (hitbox)
     * @returns CircleCollider
     */
    constructor({x, y, width, height, rotation, rotationPosition, tag, z, debug} = {}) {
        this.position = new Vectors.Vec2D({x: x, y: y})

        if (width === undefined || height === undefined) {
            Utils.warn("fox: gameobject: either a width or a height is missing, while creating this gameobject. keep in mind that this also sets the rotation position to (0,0).", this)
        }

        this.dimensions = new Vec2D({
            width: width,
            height: height
        })

        this.z = z || 0

        this.rotation = rotation || 0
        this.rotationPosition = rotationPosition || new Vectors.Vec2D({
            x: Math.floor(width / 2),
            y: Math.floor(height / 2)
        })
        this.tag = tag

        this.settings = {
            "collision": {
                "targets": undefined
            }
        }

        this.layer = undefined

        this.debug = {
            enabled: debug !== undefined,
            hitbox: (debug !== undefined && debug.hitbox !== undefined && debug.hitbox)
        }

        this.componentHolder = new ComponentHolder()
    }

    /**
     * Sets the gameobject's layer reference
     * @param {Layer} layer
     */
    setLayer({layer}) {
        this.layer = layer
    }

    /**
     * Returns the gameobject's layer reference
     * @returns {Layer}
     */
    getLayer() {
        return this.layer
    }

    /**
     * Is called after every time the game updated.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer}) {
        // to be implemented by child class
    }

    /**
     * Is called every time the game updates. #TO_BE_OVERRIDEN
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}) {
        this.componentHolder.onCalc({object: this, timestep})
    }

    /**
     * Calls the onBeforeRender method in all component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    onBeforeRender({offset, framebuffer}) {
        this.componentHolder.onBeforeRender({object: this, offset, framebuffer})
    }

    /**
     * Calls the onAfterRender method in all component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    onAfterRender({offset, framebuffer}) {
        this.componentHolder.onAfterRender({object: this, offset, framebuffer})
    }

    /**
     * Adds a component to the game object
     * @param {string} name Name of the component
     * @param {object} component Component that should be added
     * @return {void}
     */
    addComponent({name, component}) {
        this.componentHolder.addComponent({object: this, name, component})
    }

    /**
     * Removes a component from the game object
     * @param {string} name Name of the component to be removed
     * @return {void}
     */
    removeComponent({name} = {}) {
        this.componentHolder.removeComponent({object: this, name})
    }

    /**
     * Returns a component by it's name
     * @param {string} name Name of the component
     * @returns {*}
     */
    getComponent({name}) {
        return this.componentHolder.getComponent({name})
    }

    /**
     * Updates the z value and re-orders the objects in the layer
     * @param {number} z New Value for the z index
     */
    setZ({z}) {
        this.z = z
        this.layer.objectmanager.reorderObjects()
    }
}