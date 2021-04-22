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
            "mode" : Camera.modes.ORIGIN,
            "zoom" : zoom || 1
        }
        
        this.followingGameObject = undefined
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
        _this.followingGameObject = object
    }
    
    /**
     * Renders all objects tho the layer(s)
     * @method render
     * @returns {void}
     */
    render({app, layers}={}, _this=this){

        let render_offset = {
            "x" : (_this.settings.mode==Camera.modes.CENTER) ? -_this.viewport.width/2*(1/_this.settings.zoom) : 0,
            "y" : (_this.settings.mode==Camera.modes.CENTER) ? -_this.viewport.height/2*(1/_this.settings.zoom) : 0,
        }
        
        //add offset by viewport
        render_offset.x -= _this.viewport.x*(1/_this.settings.zoom)
        render_offset.y -= _this.viewport.y*(1/_this.settings.zoom)
        
        if(_this.followingGameObject!=undefined){
            render_offset.x += _this.followingGameObject.position.x + _this.followingGameObject.dimensions.width/2
            render_offset.y += _this.followingGameObject.position.y + _this.followingGameObject.dimensions.height/2
        }
            
        //object manager based rendering of sprites
        for(let layer of layers){
            layer.render({
                offset : {
                    x : -render_offset.x + this.coordinates.x,
                    y : -render_offset.y + this.coordinates.y
                },
                zoom : this.settings.zoom,
                camera : this
            })
        }
    }
}
Camera.modes = {
    "CENTER" : "center",
    "ORIGIN" : "origin"
}