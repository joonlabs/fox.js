import {Renderers} from '../../packages/renderers/index.js'
import {Input} from '../../packages/input/index.js'
import {Stats} from '../../packages/stats/index.js'
import {Utils} from "../utils/index.js"

/**
 * Represents the main game engine class. An application instance is responsible for creating and holding the game, loop, etc.
 * @class Application
 */
export class Application {
    /**
     * Construct method of the object
     * @returns Application
     */
    constructor({width, height, renderer, logFPS, minFrameTime} = {}) {
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
            this.stats.addPanel(new Stats.LabelPanel("Renderer", "black", "white", this.project.renderer.constructor.name))
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        // create rendering canvas
        this.project.renderer.init({
            width: width,
            height: height
        })
        this.view = this.project.renderer.getCanvas()

        this.renderCallback = this.render.bind(this)

        //start rendering
        window.requestAnimationFrame(this.renderCallback)
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
     * Renders the current scene and is usually called according to the monitor's refresh rate (e.g. 60, 120 or 144 times per second)
     * @returns {void}
     */
    render(timestamp) {
        //calc fps rate
        if (this.time.startTime === undefined) {
            this.time.startTime = timestamp
            this.frames.lastTimestamp = timestamp
        } else {
            let deltaTime = timestamp - this.frames.lastTimestamp
            this.frames.lastTimestamp = timestamp
            this.time.deltaTime += deltaTime

            if (this.time.minFrameTime !== undefined && this.time.deltaTime < this.frames.minFrameTime) {
                window.requestAnimationFrame(this.renderCallback)
                return
            }

            this.time.timestep = this.time.deltaTime / (1000 / 60)
        }

        // TODO: check every timestep needed?
        Input.updateGamePads()

        if (this.scenes.active !== undefined) {
            if (this.project.logFPS) this.stats.begin()

            // calc the next frame
            this.scenes.active.calc({timestep: this.time.timestep})

            // render the camera-views to the offscreen canvases
            this.scenes.active.render({app: this})

            if (this.project.logFPS) this.stats.end()
        }

        // reset delta time
        this.time.deltaTime = 0

        window.requestAnimationFrame(this.renderCallback)
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