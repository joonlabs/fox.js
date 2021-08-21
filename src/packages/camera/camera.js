import {Vectors} from '../vectors/index.js'
import {Utils} from '../utils/index.js'
import {Vec2D} from "../vectors/vectors/index.js";
import {ComponentHolder} from "../component/componentHolder.js";

/**
 * Represents a Camera for rendering the scene.
 * @class
 */
export class Camera {
    coordinates;
    viewportPosition;
    viewportDimensions;
    settings;
    componentHolder;

    set position(value){
        this.viewportPosition.x = -value.x
        this.viewportPosition.y = -value.y
    }

    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the camera
     * @param {number} y Y-position of the camera
     * @param {object} viewport Viewport of the camera (x, y, width, height)
     * @param {number} [zoom] Zoom level of the camera
     * @returns Camera
     */
    constructor({x,y,viewport,zoom}={viewport:{}}){
        this.coordinates = new Vectors.Vec2D({x:x, y:y})

        this.viewportPosition = new Vec2D({
            x: -viewport.x || 0,
            y: -viewport.y || 0
        })
        this.viewportDimensions = new Vec2D({
            width: viewport.width,
            height: viewport.height
        })

        this.settings = {
            zoom : zoom || 1
        }

        this.componentHolder = new ComponentHolder()
    }

    /**
     * Initializes the camera
     * @param renderer {Renderer} The renderer that should be used by this camera
     */
    init({renderer}) {
        this.renderer = renderer
        this.cameraBuffer = renderer.createFramebuffer({width: this.viewportDimensions.width, height: this.viewportDimensions.height})
    }
    
    /**
     * Renders all layers to the onscreen canvas
     * @returns {void}
     */
    renderToScreen({app, layers}={}){
        app.project.renderer.getMainFramebuffer().renderTexture({
            texture: this.cameraBuffer,
            x: this.coordinates.x,
            y: this.coordinates.y,
            width: this.viewportDimensions.width * this.settings.zoom,
            height: this.viewportDimensions.height * this.settings.zoom,
        })
    }

    /**
     * Is called every time the game updates.
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}) {
        this.componentHolder.onCalc({object: this, timestep})
    }

    /**
     * Renders all objects tho the layer(s)
     * @returns {void}
     */
    render({app, layers}={}){
        this.componentHolder.onBeforeRender({object: this, offset: this.viewportPosition, framebuffer: this.cameraBuffer})

        this.cameraBuffer.clear()
        this.renderer.setCameraTransform({
            position: this.viewportPosition,
            scale: new Vec2D({x: 1, y: 1}),
            rotation: 0
        })
        //object manager based rendering of sprites
        for(let layer of layers){
            layer.render({
                offset : new Vec2D(),
                camera : this,
                framebuffer: this.cameraBuffer
            })
        }

        this.componentHolder.onBeforeRender({object: this, offset: this.viewportPosition, framebuffer: this.cameraBuffer})
    }

    /**
     * Adds a component to the game object
     * @param {string} name Name of the component
     * @param {object} component Component that should be added
     * @return {void}
     */
    addComponent({name, component}) {
        this.componentHolder.addComponent({object: this, name, component})
    }

    /**
     * Removes a component from the game object
     * @param {string} name Name of the component to be removed
     * @return {void}
     */
    removeComponent({name} = {}) {
        this.componentHolder.removeComponent({object: this, name})
    }

    /**
     * Returns a component by it's name
     * @param {string} name Name of the component
     * @returns {*}
     */
    getComponent({name}) {
        return this.componentHolder.getComponent({name})
    }
}