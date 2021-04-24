import {Renderers} from '../../packages/renderers/index.js'
import {Input} from '../../packages/input/index.js'
import {Stats} from '../../packages/stats/index.js'

/**
 * Represents the main game engine class. An application instance is responsible for creatig and holding the game, loop, etc.
 * @class Application
 */
export class Application {
    /**
     * Construct method of the object
     * @returns Application
     */
    constructor({width, height, renderer, logFPS} = {}) {
        let _this = this

        this.scenes = {
            all: [],
            active: undefined,
            activeName : undefined
        }

        //settings
        this.project = {
            "width": width,
            "height": height,
            "logFPS": logFPS || false,
            "pixelated": true,
            "renderer": renderer || new Renderers.Canvas2D(),
            // for rendering offscreen canvases to the view, the Canvas2D renderer is recommended,
            // as webgl in safari and firefox can not mirror the canvas element directly into the buffer
            // and for this reason drawing canvases takes way more time than in the canvas2d api. this may
            // change when OffscreenCanvas() becomes supported in those browsers or this problem is adressed directly.
        }

        this.frames = {
            "frame": 0,
        }

        this.fps = {
            "starttime": undefined,
            "rate": 1000 / 60,
            "deltatime": 0,
            "timestep": 1,
            "maxskippingframes": 5
        }

        if (logFPS) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        // create rendering canvas
        this.project.renderer.init({
            width: width,
            height: height
        })
        this.view = this.project.renderer.getCanvas()

        //start rendering
        window.requestAnimationFrame(function (timestamp) {
            _this.render(timestamp, _this)
        })
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
    render(timestamp, _this = this) {
        //calc fps rate
        if (_this.fps.starttime === undefined) {
            _this.fps.starttime = timestamp
            _this.fps.lastFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate)
        } else {
            let currentFrame = Math.round((timestamp - _this.fps.starttime) / _this.fps.rate);
            _this.fps.deltatime = (currentFrame - _this.fps.lastFrame) * (1000 / 60);
            _this.fps.timestep = Math.min(_this.fps.deltatime / _this.fps.rate, _this.fps.maxskippingframes)
            _this.fps.lastFrame = currentFrame
        }

        // TODO: check every timestep needed?
        Input.updateGamePads()

        if (_this.scenes.active !== undefined) {
            if (_this.project.logFPS) this.stats.begin()

            // calc the next frame
            _this.scenes.active.calc({timestep: _this.fps.timestep})

            // render the camera-views to the offscreen canvases
            _this.scenes.active.render({app: _this})

            if (_this.project.logFPS) this.stats.end()
        }
        window.requestAnimationFrame(function (t) {
            _this.render(t, _this)
        })
    }

    /**
     * Adds a scene to the engine's scenes
     * @param {string} name name of the scene to be added
     * @param {object} scene Scene to be added
     * @returns {void}
     */
    addScene({name, scene} = {}) {
        scene.setApplication({application: this})
        this.scenes.all[name] = scene
    }

    /**
     * Sets a given scene as the active one
     * @param {string} name Name of the scene to be activated
     * @returns {void}
     */
    loadScene({name} = {}) {
        // init scene
        this.scenes.all[name].destroy()
        this.scenes.all[name].init()

        // set active scene
        this.scenes.active = this.scenes.all[name]
        this.scenes.activeName = name
    }

    destroyCurrentScene(){
        if(this.scenes.activeName){
            this.scenes.all[this.scenes.activeName].destroy()
        }
    }

    /**
     * Re-inits the current scene
     */
    reloadCurrentScene(){
        // init scene
        this.scenes.active.destroy()
        this.scenes.active.init()
    }
}