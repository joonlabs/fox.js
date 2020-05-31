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
    constructor({width, height, renderer, logFPS, pixelated}={}){
        let _this = this
        
        this.scenes = {
            all: [],
            active: undefined,
        }
        this.cameras = {
            all: [],
        }
        
        //settings
        this.project = {
            "width": undefined,
            "height": undefined,
            "logFPS": false,
            "pixelated": true,
            "rendering" : {
                renderer : undefined,
                canvas : undefined,
                ctx : undefined
            }
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
        
        this.project.width = width
        this.project.height = height
        this.project.logFPS = logFPS || false 
        this.project.rendering.renderer = renderer || new Renderers.Canvas2D()
        this.project.rendering.pixelated = pixelated || true
        
        if(logFPS){
            //init stats
            window.stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild( stats.dom );
        }
        
        //rendering canvas
        if(this.project.rendering.canvas) this.rendering.canvas.parentNode.removeChild(this.rendering.canvas)
        this.project.rendering.canvas = document.createElement("canvas")
        this.project.rendering.canvas.width = width
        this.project.rendering.canvas.height = height
        this.project.rendering.ctx = this.project.rendering.canvas.getContext("2d")
        this.project.rendering.ctx.imageSmoothingEnabled = !this.project.pixelated
        if(this.project.rendering.pixelated){
            this.project.rendering.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")
        }
        this.view = this.project.rendering.canvas
        
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
     * Is called up to 60 times per second and calls the current scene's calc 
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @returns {void}
     */
    calc({timestep}={}, _this=this){
        //_this.frames.frame += 1
        _this.scenes.active.calc({timestep: timestep})
    }
    
    /**
     * Is called up to 60 times per second and calls the current scene's render 
     * @returns {void}
     */
    render(timestamp, _this=this){
        if(window.stats) stats.begin();
        
        //calc fps rate
        if(_this.fps.starttime==undefined){
            _this.fps.starttime = timestamp
            _this.fps.lastFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate)
        }else{
            let currentFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate);
            console.log((currentFrame - _this.fps.lastFrame) * (1000/60))
            _this.fps.deltatime = (currentFrame - _this.fps.lastFrame) * (1000/60);
            _this.fps.timestep = Math.min(_this.fps.deltatime / _this.fps.rate, _this.fps.maxskippingframes)
            _this.fps.lastFrame = currentFrame
        }
        
        Input.updateGamePads()
        
        
        if(_this.scenes.active!=undefined){
            //clear all layers
            _this.scenes.active.clear({app:_this})
            
            //shader calculation
            _this.scenes.active.calcShaders({app:_this})
        
            //render content to offscreen canvases
            for(let camera of _this.cameras.all){ camera.render({app:_this}) }
            
            //post processing       
            _this.scenes.active.postProcess({app:_this})
            
            //render offscreen canvases to globaö canvas
            _this.scenes.active.render({app:_this})
            
            //calc the next frame
            _this.calc({timestep: _this.fps.timestep})
        }
        if(window.stats) stats.end()
        window.requestAnimationFrame(function(t){_this.render(t, _this)})
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
    
    
    
    /**
     * Adds a camera to the engines cameras
     * @param {object} camera Camera to be added 
     * @returns {void}
     */
    addCamera({camera}={}, _this=this){
        _this.cameras.all.push(camera)
    }
}