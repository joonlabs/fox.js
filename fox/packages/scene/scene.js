import {ObjectManager} from '../objectmanager/index.js'
/**
* The Scene class provides the holder object for grouping a set of layers and objects, that are combined together into a scene
*
* @class Scene
*/
export class Scene{
    /**
     * Construct method of the object
     * @method constructor
     * @returns Scene
     */
    constructor(){
        this.objectmanager = new ObjectManager()
        this.layers = []
    }
    
    /**
     * Adds a layer to the scene
     * @method addLayer
     * @param {object} layer Layer to be added 
     * @returns {void}
     */
    addLayer({layer}={}, _this=this){
        _this.layers.push(layer)
    }
    
    /**
     * Triggers the calc method of all of it's objects
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @method calc
     * @returns {void}
     */
    calc({timestep}={}, _this=this){
        _this.objectmanager.calc({timestep:timestep})
    }
    
    /**
     * Triggers the calc method of all of it's layer's shaders
     * @param {object} app Application element passed to the function for reading project data
     * @method calc
     * @returns {void}
     */
    calcShaders({app}={}, _this=this){
        for(let layer of _this.layers){ layer.calcShaders() }
    }
    
    /**
     * Clears all internal offscreen-canvases
     * @param {object} app Application element passed to the function for reading project data
     * @method clear
     * @return void
     */
    clear({app}={}, _this=this){
        for(let layer of _this.layers){ layer.clear() }
    }
    
     /**
      * Renders the intern offscreen-canvases to the global game canvas
      * @param {object} app Application element passed to the function for reading project data
      * @method render
      * @return void
      */
    render({app}={}, _this=this){
        app.project.rendering.renderer.clearRect({x:0, y:0, width: app.project.width, height: app.project.height, ctx: app.project.rendering.ctx})
        for(let layer of _this.layers){ 
            // TODO: change this with the Renderer.drawImage() method
            app.project.rendering.renderer.renderTexture({texture:layer.canvas, x:0, y:0, rotation:0, ctx:app.project.rendering.ctx})
        }
    }
    
     /**
      * Enables the postProcess function in all layers of the scene
      * @param {object} app Application element passed to the function for reading project data
      * @method postProcess
      * @return void
      */
    postProcess({app}={}, _this=this){
        for(let layer of _this.layers){ layer.postProcess({app:app}) }
    }
}