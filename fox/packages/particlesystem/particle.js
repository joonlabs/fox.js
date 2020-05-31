import {GameObjects} from '../gameobjects/index.js'
import {Color} from '../color/index.js'
import {GameObject} from '../gameobjects/gameobject.js'
/**
* The Particle Class controlls a particle over time, it's position, velocity and acceleration   
*
* @class Particle
*/
export class Particle extends GameObject{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the particle
     * @param {number} y Y-position of the particle
     * @param {object} velocity Vector for start velocity
     * @param {object} acceleration Vector for start acceleration
     * @param {number} width Width of the collider
     * @param {number} height Height of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} renderObject Object to be renderd (eg. sprite, rectangle, circle, ...)
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together 
     * @param {number} z Depth information for sorting in layer
     * @returns Particle
     */
    constructor({x, y, width, height, velocity, acceleration, rotation, rotationPosition, renderObject, layer, tag, z}={}){
        super({
            x:x, 
            y:y, 
            width:width || 5, 
            height:height || 5, 
            rotation: rotation,
            rotationPosition: rotationPosition,
            layer:layer, 
            z: z,
            tag:tag
        })
        
        this.velocity = {
            x: velocity && velocity.x ? velocity.x : 0,
            y: velocity && velocity.y ? velocity.y : 0,
        }
        this.acceleration = {
            x: acceleration && acceleration.x ? acceleration.x : 0,
            y: acceleration && acceleration.y ? acceleration.y : 0,
        }
        
        this.dead = true
        this.renderObject = renderObject || new GameObjects.Rectangle({x:this.position.x, y:this.position.y, width:5, height:5, color: new Color(), layer:this.layer})
    }
    
    /**
     * Is called every time the game updates. Calls it's components calc methods and updates it' position based on velocity and acceleration. 
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @method calc
     * @return {void}
     */    
    calc({timestep}={}, _this=this){
        for(let component of _this.components){ if(typeof component.onCalc==="function") component.onCalc({timestep: timestep, object:_this}) }
        
        _this.position = {
            x: (_this.position.x + _this.velocity.x*timestep),
            y: (_this.position.y + _this.velocity.y*timestep),
        }
        _this.velocity = {
            x: _this.velocity.x + _this.acceleration.x*timestep,
            y: _this.velocity.y + _this.acceleration.y*timestep,
        }
    }
    
    /**
     * Is called every time the game updates, after the calc. Calls it's components render methods. 
     * @method render
     * @param {number} x X-position to be drawn (by camera)
     * @param {number} y Y-position to be drawn (by camera)
     * @param {number} zoom zoom of the camera
     * @param {object} camera Camera object that caused the method
     * @returns {void}
     */
    render({x, y, width, height, zoom, camera, renderer}={},_this=this){
        for(let component of _this.components){ if(typeof component.onBeforeRender==="function") component.onBeforeRender({x:x, y:y, width:width, height:height, zoom:zoom, camera:camera,  renderer:renderer, object:_this}) }
        
        if(!_this.renderObject){ console.warn("fox: particle: You're trying to render a particle, that has no render object. please specify any kind of gameobject e.g. a rectangle")}
        x = x+parseInt(_this.position.x*zoom)
        y = y+parseInt(_this.position.y*zoom) 
        _this.renderObject.render({x:x, y:y, width:parseInt(_this.renderObject.dimensions.width*zoom), height:parseInt(_this.renderObject.dimensions.height*zoom), zoom:zoom, camera:camera, renderer:renderer})
        
        if(_this.collider!=undefined) _this.collider.render({x:x, y:y, zoom:zoom, camera:camera, renderer:renderer})
        
        for(let component of _this.components){ if(typeof component.onAfterRender==="function") component.onAfterRender({x:x, y:y, width:width, height:height, zoom:zoom, camera:camera,  renderer:renderer, object:_this}) }
    }
}