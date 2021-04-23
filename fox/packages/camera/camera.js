import {Vectors} from '../vectors/index.js'
/**
 * Represents a Camera for rendering the scene.
 * @class
 */
export class Camera{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the camera
     * @param {number} y Y-position of the camera
     * @param {object} viewport Vierport of the camera (x, y, width, height)
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
     * TODO: make shake frame based
     * @method shake
     * @returns {void}
     */
    shake({min, max, duration, smoothout}={}, _this=this){
        let x_ = _this.coordinates.x
        let y_ = _this.coordinates.y
        let counter = 0
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
     * @method followObject
     * @param {object} object Object that is followed by the camera. The object needs a position vector.
     * @returns {void}
     */
    followObject({object}={}, _this=this){
        _this.followingObject = object
    }
    
    /**
     * Renders all layers to the onscreen canvas
     * @method renderToScreen
     * @returns {void}
     */
    renderToScreen({app, layers}={}, _this=this){
        //console.log((this.viewport.width * this.settings.zoom - this.viewport.width)/2)
        let f = app.project.viewScaleFactor
        for (let layer of layers) {
            app.project.renderer.renderTexture({
                texture: layer.getCanvas(),
                x: this.coordinates.x * f,
                y: this.coordinates.y * f,
                rotation: 0,
                width: this.viewport.width * this.settings.zoom * f,
                height: this.viewport.height * this.settings.zoom * f,
                srcX: (this.viewport.x + (this.viewport.width * this.settings.zoom - this.viewport.width)/2 ) * f,
                srcY: (this.viewport.y + (this.viewport.height * this.settings.zoom - this.viewport.height)/2 ) * f,
                srcWidth: layer.dimensions.width * this.settings.zoom * f,
                srcHeight: layer.dimensions.height* this.settings.zoom * f
            })
        }
    }

    /**
     * Renders all objects tho the layer(s)
     * @method render
     * @returns {void}
     */
    render({app, layers}={}, _this=this){

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


        //object manager based rendering of sprites
        for(let layer of layers){
            layer.render({
                offset : {
                    x : -render_offset.x,
                    y : -render_offset.y
                },
                camera : this
            })
        }
    }
}
Camera.modes = {
    "CENTER" : 0,
    "ORIGIN" : 1
}