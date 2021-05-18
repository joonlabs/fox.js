import {Renderers} from '../../packages/renderers/index.js'
import {Input} from '../../packages/input/index.js'
import {Stats} from '../../packages/stats/index.js'
import {Utils} from "../utils/index.js"

/**
 * Represents the main game engine class. An application instance is responsible for creatig and holding the game, loop, etc.
 * @class Application
 */
export class Application {
    /**
     * Construct method of the object
     * @returns Application
     */
    constructor({width, height, renderer, logFPS, minFrameTime} = {}) {
        let _this = this

        this.scenes = {
            all: [],
            active: undefined,
            activeName: undefined
        }

        //settings
        this.project = {
            "width": width,
            "height": height,
            "logFPS": logFPS || false,
            "pixelated": true,
            "renderer": renderer
                || (Utils.isWebGLAvailable() ? new Renderers.WebGL() : new Renderers.Canvas2D()),
        }

        this.frames = {
            frame: 0,
            minFrameTime: minFrameTime !== undefined ? Math.floor(1000 / minFrameTime) : undefined,
            lastTimestamp: undefined
        }

        this.time = {
            startTime: undefined,
            deltaTime: 0,
            timestep: 1
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
        if (_this.time.startTime === undefined) {
            _this.time.startTime = timestamp
            _this.frames.lastTimestamp = timestamp
        } else {
            let deltaTime = timestamp - _this.frames.lastTimestamp
            _this.frames.lastTimestamp = timestamp
            _this.time.deltaTime += deltaTime

            if (_this.time.minFrameTime !== undefined && _this.time.deltaTime < _this.frames.minFrameTime) {
                window.requestAnimationFrame(function (t) {
                    _this.render(t, _this)
                })
                return
            }

            _this.time.timestep = _this.time.deltaTime / (1000 / 60)
        }

        // TODO: check every timestep needed?
        Input.updateGamePads()

        if (_this.scenes.active !== undefined) {
            if (_this.project.logFPS) this.stats.begin()

            // calc the next frame
            _this.scenes.active.calc({timestep: _this.time.timestep})

            // render the camera-views to the offscreen canvases
            _this.scenes.active.render({app: _this})

            if (_this.project.logFPS) this.stats.end()
        }

        // reset delta time
        _this.time.deltaTime = 0

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
        this.destroyCurrentScene()

        // init scene
        this.scenes.all[name].init({renderer: this.project.renderer})

        // set active scene
        this.scenes.active = this.scenes.all[name]
        this.scenes.activeName = name
    }

    /**
     * Destructs the current scene
     */
    destroyCurrentScene() {
        if (this.scenes.activeName) {
            this.scenes.all[this.scenes.activeName].destroy()
        }
    }

    /**
     * Re-inits the current scene
     */
    reloadCurrentScene() {
        // destroy current scene
        this.destroyCurrentScene()

        // init current scene again
        this.scenes.active.init({renderer: this.project.renderer})
    }

    /**
     * Re-inits the current scene
     */
    getCurrentSceneName() {
        // init scene
        return this.scenes.activeName
    }
}