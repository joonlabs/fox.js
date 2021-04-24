/**
 * The Scene class provides the holder object for grouping a set of layers and cameras, that are combined together into a scene
 *
 * @class Scene
 */
export class Scene {
    /**
     * Construct method of the object
     * @method constructor
     * @returns Scene
     */
    constructor() {
        this.layers = []
        this.store = {}
        this.initialized = false
        this.application = undefined
        this.cameras = {
            all: [],
        }
        this.onInitFn = function(){}
        this.onDestroyFn = function(){}
    }

    /**
     * Is called when the scene is loaded by the application and inits all layers and their renderers
     */
    init(){
        if(typeof this.onInitFn === "function"){
            this.onInitFn()
        }
        for(let layer of this.layers){
            layer.init()
        }
        this.initialized = true
    }

    onInit({callback}){
        this.onInitFn = callback
    }

    destroy(){
        if(this.initialized){
            for(let layer of this.layers){
                layer.destroy()
            }
            if(typeof this.onDestroyFn === "function"){
                this.onDestroyFn()
            }

            // reset internal object holders
            this.layers = []
            this.store = {}
            this.initialized = false
            this.cameras = {
                all: [],
            }
        }
    }

    onDestroy({callback}){
        this.onDestroyFn = callback
    }

    /**
     * Sets the scene's app reference
     * @param application
     * @returns {Scene}
     */
    setApplication({application}) {
        this.application = application
        return this
    }

    /**
     * Returns the scene's app
     * @returns {*}
     */
    getApplication() {
        return this.application
    }

    /**
     * Adds a layer to the scene
     * @method addLayer
     * @param {object} layer Layer to be added
     * @returns {Scene}
     */
    addLayer({layer} = {}) {
        layer.setScene({scene: this})
        this.layers.push(layer)
        return this
    }

    /**
     * Triggers the calc method of all of it's objects
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @returns {Scene}
     */
    calc({timestep} = {}) {
        for (let layer of this.layers) {
            layer.calc({timestep})
        }
        return this
    }

    /**
     * Clears all internal offscreen-canvases
     * @return {Scene}
     */
    clear() {
        for (let layer of this.layers) {
            layer.clear()
        }
        return this
    }

    /**
     * Renders the intern offscreen-canvases
     * @param {object} app Application element passed to the function for reading project data
     * @returns {Scene}
     */
    render({app} = {}) {
        for (let camera of this.cameras.all) {
            // clear all layers
            for (let layer of this.layers) {
                layer.clear()
            }
            // render to all offscreen canvases
            camera.render({app: app, layers: this.layers})
            // render to the screen canvas
            camera.renderToScreen({app: app, layers: this.layers})
        }
        return this
    }

    /**
     * Adds a camera to the engines cameras
     * @param {object} camera Camera to be added
     * @returns {void}
     */
    addCamera({camera} = {}) {
        this.cameras.all.push(camera)
        return this
    }

    /**
     * Stores an item in the current scene
     * @param {string} name
     * @param {*} item
     * @returns {Scene}
     */
    storeItem({name, item}) {
        this.store[name] = item
        return this
    }

    /**
     * Returns a stored item from the scene's internal store
     * @param {string} name
     * @returns {*}
     */
    getStoredItem({name}) {
        return this.store[name]
    }

    /**
     * Returns all stored items
     * @returns {[*]}
     */
    getStoredItems() {
        return this.store
    }

    /**
     * Clears the scene's internal store
     * @returns {Scene}
     */
    clearStore() {
        this.store = {}
        return this
    }
}