/**
 * The Scene class provides the holder object for grouping a set of layers and objects, that are combined together into a scene
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
        this.cameras = {
            all: [],
        }
    }

    /**
     * Adds a layer to the scene
     * @method addLayer
     * @param {object} layer Layer to be added
     * @returns {void}
     */
    addLayer({layer} = {}) {
        this.layers.push(layer)
    }

    /**
     * Triggers the calc method of all of it's objects
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @method calc
     * @returns {void}
     */
    calc({timestep} = {}) {
        for (let layer of this.layers) {
            layer.calc({timestep})
        }
    }

    /**
     * Clears all internal offscreen-canvases
     * @method clear
     * @return void
     */
    clear() {
        for (let layer of this.layers) {
            layer.clear()
        }
    }

    /**
     * Renders the intern offscreen-canvases
     * @param {object} app Application element passed to the function for reading project data
     * @method render
     * @return void
     */
    render({app} = {}) {
        //render content to offscreen canvases
        for(let camera of this.cameras.all){
            camera.render({app:app, layers: this.layers})
        }
    }

    /**
     * Renders the intern offscreen-canvases to the global game canvas
     * @param {object} app Application element passed to the function for reading project data
     * @method renderToScreen
     * @return void
     */
    renderToScreen({app} = {}) {
        for (let layer of this.layers) {
            app.project.renderer.renderTexture({
                texture: layer.getCanvas(),
                x: 0,
                y: 0,
                rotation: 0,
                width: layer.dimensions.width,
                height: layer.dimensions.height
            })
        }
    }

    /**
     * Enables the postProcess function in all layers of the scene
     * @param {object} app Application element passed to the function for reading project data
     * @method postProcess
     * @return void
     */
    postProcess({app} = {}, _this = this) {
        for (let layer of _this.layers) {
            layer.postProcess({app: app})
        }
    }

    /**
     * Adds a camera to the engines cameras
     * @param {object} camera Camera to be added
     * @returns {void}
     */
    addCamera({camera}={}){
        this.cameras.all.push(camera)
    }
}