import {Vectors} from '../vectors/index.js'
import {Utils} from '../utils/index.js'

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

        this.dimensions = {
            "width": width,
            "height": height,
        }

        this.z = z || 0

        this.rotation = rotation || 0
        this.rotationPosition = rotationPosition || new Vectors.Vec2D({x: parseInt(width / 2), y: parseInt(height / 2)})
        this.tag = tag

        this.settings = {
            "collision": {
                "targets": undefined
            }
        }

        this.components = {}

        this.layer = undefined

        this.debug = {
            enabled: debug != undefined,
            hitbox: (debug != undefined && debug.hitbox != undefined && debug.hitbox)
        }
    }

    /**
     * Sets the gameobject's layer reference
     * @param layer
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
     * Is called every time the game updates. #TO_BE_OVERRIDEN
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}) {
        for (let component of Object.values(this.components)) {
            if (typeof component.onCalc === "function") {
                component.onCalc({
                    timestep: timestep,
                    object: this
                })
            }
        }
    }

    /**
     * Calls the onBeforeRender method in all components
     * @param {Renderer} renderer Renderer to be used
     */
    onBeforeRender({renderer}) {
        for (let component of Object.values(this.components)) {
            if (typeof component.onBeforeRender === "function") {
                component.onBeforeRender({
                    object: this,
                    renderer: renderer
                })
            }
        }
    }

    /**
     * Calls the onAfterRender method in all components
     * @param {Renderer} renderer Renderer to be used
     */
    onAfterRender({renderer}) {
        for (let component of Object.values(this.components)) {
            if (typeof component.onAfterRender === "function") {
                component.onAfterRender({
                    object: this,
                    renderer: renderer
                })
            }
        }
    }

    /**
     * Is called after every time the game updated.
     * @param {number} x X position of the object
     * @param {number} y Y position of the object
     * @param {number} width Width of the object
     * @param {number} height Height of the object
     * @param {Renderer} renderer Renderer to be rendered with
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({x, y, width, height, renderer, framebuffer}) {

    }

    /**
     * Adds a component to the game object
     * @param {string} name Name of the component
     * @param {object} component Component that should be added
     * @return {void}
     */
    addComponent({name, component} = {}) {
        // default the name if not set to componentX
        name = name || "component" + Object.keys(this.components).length.toString()

        this.components[name] = component

        if (typeof component.onInit === "function") {
            component.onInit({object: this})
        }
    }

    /**
     * Returns a component by it's name
     * @param {string} name Name of the component
     * @returns {*}
     */
    getComponent({name}) {
        return this.components[name]
    }

    /**
     * Removes a component to the game object
     * @param {string} name Name of the component to be removed
     * @return {void}
     */
    removeComponent({name} = {}) {
        delete this.components[name]
        if (typeof component.onDestroy === "function") {
            component.onDestroy({object: this})
        }
    }
}