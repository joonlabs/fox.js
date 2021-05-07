import {Vectors} from '../vectors/index.js'
import {Utils} from '../utils/index.js'

/**
 * Represents a Camera for rendering the scene.
 * @class
 */
export class Camera {
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the camera
     * @param {number} y Y-position of the camera
     * @param {object} viewport Viewport of the camera (x, y, width, height)
     * @param {number} zoom Zoom level of the camera
     * @returns Camera
     */
    constructor({x,y,viewport,zoom}={viewport:{}}){
        this.coordinates = new Vectors.Vec2D({x:x, y:y})
        this.viewport = {
            x : viewport.x || 0,
            y : viewport.y || 0,
            width : viewport.width,
            height : viewport.height,
        }
        this.settings = {
            "mode" : Camera.modes.CENTER,
            "zoom" : zoom || 1
        }
        
        this.followingObject = undefined
    }

    /**
     * Initializes the camera
     * @param renderer {Renderer} The renderer that should be used by this camera
     */
    init({renderer}) {
        this.renderer = renderer
        this.cameraBuffer = renderer.createFramebuffer({width: this.viewport.width, height: this.viewport.height})
    }
    
    /**
     * Shakes the camera.
     * @method shake
     * @returns {void}
     */
    shake({min, max, duration, smoothout}={}){
        // TODO: make shake frame based -> component system?
        let x_ = _this.coordinates.x
        let y_ = _this.coordinates.y
        let counter = 0
        let _this = this
        let shake = setInterval(function(){
            counter += 16
            _this.coordinates = {
                "x": x_,
                "y": y_,
            }
            
            _this.coordinates.x += parseInt(((Math.random()<.5?-1:1)*min+Math.random()*(max-min))*((smoothout==true) ? ((duration-duration*(counter/duration))/duration)**2 : 1))
            _this.coordinates.y += parseInt(((Math.random()<.5?-1:1)*min+Math.random()*(max-min))*((smoothout==true) ? ((duration-duration*(counter/duration))/duration)**2 : 1))
        },16)
        setTimeout(function(){console.log("END");clearInterval(shake);_this.coordinates = {"x": x_,"y": y_,}},duration)
    }
    
    /**
     * Initiates the project with given preferences
     * @param {object} object Object that is followed by the camera. The object needs a position vector.
     * @returns {void}
     */
    followObject({object}={}){
        this.followingObject = object
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
            width: this.viewport.width * this.settings.zoom,
            height: this.viewport.height * this.settings.zoom,
        })
    }

    /**
     * Renders all objects tho the layer(s)
     * @returns {void}
     */
    render({app, layers}={}){

        let render_offset = {
            "x" : 0,
            "y" : 0,
        }

        if(this.followingObject!==undefined){
            render_offset.x += this.followingObject.position.x - this.viewport.x
            render_offset.y += this.followingObject.position.y - this.viewport.y

            if(this.settings.mode === Camera.modes.CENTER){
                render_offset.x -= this.viewport.width / 2 + this.followingObject.dimensions.width / 2
                render_offset.y -= this.viewport.height / 2 + this.followingObject.dimensions.width / 2
            }
        }

        this.cameraBuffer.clear()
        //object manager based rendering of sprites
        for(let layer of layers){
            layer.render({
                offset : {
                    x : -render_offset.x,
                    y : -render_offset.y
                },
                camera : this,
                framebuffer: this.cameraBuffer
            })
        }
    }
}
Camera.modes = {
    "CENTER" : 0,
    "ORIGIN" : 1
}