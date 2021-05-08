import {ObjectManager} from '../../objectmanager/index.js'
import {Random} from "../../random/index.js";
import {Utils} from "../../utils/index.js";

/**
 * The Layer represents the canvas that is added to the document's dom
 *
 * @class Layer
 */
export class Layer {
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns Layer
     */
    constructor({width, height} = {}) {
        //dimensions
        this.dimensions = {
            "width": width,
            "height": height,
        }

        this.id = Random.ID()

        this.scene = undefined

        //game stuff
        this.objectmanager = new ObjectManager()
    }

    getId() {
        return this.id
    }

    /**
     * Is called by the scene, when the scene is initialized
     */
    init() {

    }

    destroy() {
        this.objectmanager.destroy()
    }

    /**
     * Sets the layer's scene reference
     * @param scene
     */
    setScene({scene}) {
        this.scene = scene
    }

    /**
     * Returns the layer's scene reference
     * @returns {Scene}
     */
    getScene() {
        return this.scene
    }

    /**
     * Is called in every loop, up to 60 times a second
     */
    calc({timestep}) {
        this.objectmanager.calc({timestep: timestep})
    }

    /**
     * Is called in every loop after the calc method
     */
    render({offset, camera, framebuffer}) {
        for (let obj of this.objectmanager.getObjects()) {
            obj.render({
                x: offset.x + obj.position.x,
                y: offset.y + obj.position.y,
                width: obj.dimensions.width,
                height: obj.dimensions.height,
                camera: camera,
                framebuffer: framebuffer,
                renderer: this.renderer
            })
        }
    }

    /**
     * Is called every time before the render method is called and clears the whole canvas
     * @return {void}
     */
    clear(_this = this) {
        //this.renderer.clear()
    }

    /**
     * Adds an object to the layer.
     * @param {string} name Name of the object
     * @param {object} object Object to be added
     */
    addObject({name, object}) {
        /// notify object about it's new holding layer
        object.setLayer({
            layer: this
        })

        // default the name if not set to objectX
        name = name || "object" + Object.keys(this.objectmanager.objects).length.toString()

        // add object to objectmanager
        this.objectmanager.addObject({
            name: name,
            object: object
        })
    }

    /**
     * Returns an object by it's name
     * @param {string} name Name of the objects
     * @returns {any}
     */
    getObject({name}) {
        return this.objectmanager.getObject({name: name})
    }

    /**
     * Removes a given object from layer
     * @param {string} name Name of the object to be removed
     * @return {void}
     */
    removeObject({name}) {
        delete this.objectmanager.removeObject({name: name})
    }
}