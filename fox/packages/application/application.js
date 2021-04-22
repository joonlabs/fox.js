import {Renderers} from '../../packages/renderers/index.js'
import {Input} from '../../packages/input/index.js'

/**
 * Represents the main game engine class. An application instance is responsible for creatig and holding the game, loop, etc.
 * @class Application
 */
export class Application{
    /**
     * Construct method of the object
     * @returns Application
     */
    constructor({width, height, renderer, scaleToNativeFactor, logFPS}={}){
        let _this = this
        
        this.scenes = {
            all: [],
            active: undefined,
        }
        
        //settings
        this.project = {
            "width": width,
            "height": height,
            "scaleToNativeFactor": scaleToNativeFactor || 1,
            "logFPS": logFPS || false,
            "pixelated": true,
            "renderer" : renderer || new Renderers.WebGL(),
        }
        
        this.frames = {
            "frame" : 0,
        }
        
        this.fps = {
            "starttime" : undefined,
            "rate" : 1000/60,
            "deltatime" : 0,
            "timestep" : 1,
            "maxskippingframes" : 5
        }
        
        if(logFPS){
            //TODO -> log FPS
        }
        
        // create rendering canvas
        this.project.renderer.init({
            width: width,// * this.project.scaleToNativeFactor,
            height: height// * this.project.scaleToNativeFactor
        })
        this.view = this.project.renderer.getCanvas()

        //start rendering
        window.requestAnimationFrame(function(timestamp){_this.render(timestamp, _this)})
    }
    
    
    /**
     * Initiates the project with given preferences and creates the main canvas
     * @param {number} width Resolution width of the canvas(es)
     * @param {number} height Resolution height of the canvas(es)
     * @param {object} renderer Renderer object for the project
     * @param {boolean} logFPS Log the FPS at the windows' title
     * @param {boolean} pixelated Enable pixel perfect rendering and disable blurring of edges
     * @returns {void}
     */
    
    /**
     * Is called up to 60 times per second and calls the current scene's render 
     * @returns {void}
     */
    render(timestamp, _this=this){
        //calc fps rate
        if(_this.fps.starttime===undefined){
            _this.fps.starttime = timestamp
            _this.fps.lastFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate)
        }else{
            let currentFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate);
            //console.log((currentFrame - _this.fps.lastFrame) * (1000/60))
            _this.fps.deltatime = (currentFrame - _this.fps.lastFrame) * (1000/60);
            //console.log(_this.fps.deltatime)
            _this.fps.timestep = Math.min(_this.fps.deltatime / _this.fps.rate, _this.fps.maxskippingframes)
            _this.fps.lastFrame = currentFrame
        }

        // TODO: check every timestep needed?
        Input.updateGamePads()
        
        let run = false
        if(_this.scenes.active!==undefined){

            // calc the next frame
            _this.scenes.active.calc({timestep: _this.fps.timestep})

            // render the camera-views to the offscreen canvases
            _this.scenes.active.render({app: _this})

            //exit()
        }
        if(!run) {
            setTimeout(function(){window.requestAnimationFrame(function(t){_this.render(t, _this)})}, 0)
        }
    }
    
    /**
     * Adds a scene to the engines scenes
     * @param {object} scene Scene to be added 
     * @returns {void}
     */
    addScene({scene}={}, _this=this){
        _this.scenes.all.push(scene)
        _this.setActiveScene({scene:scene})
    }
    
    /**
     * Sets a given scene as the active one 
     * @param {object} scene Scene to be activated 
     * @returns {void}
     */
    setActiveScene({scene}={}, _this=this){
        _this.scenes.active = scene
    }
}