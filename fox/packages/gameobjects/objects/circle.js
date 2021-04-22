import {GameObject} from '../gameobject.js'
import {Vectors} from '../../vectors/index.js'
import {Color} from '../../color/index.js'

/**
* The Circle represents just a basic circle that can be tinted in a specific color
*
* @class Circle
*/
export class Circle extends GameObject{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the circle
     * @param {number} y Y-position of the circle
     * @param {number} width Width of the circle
     * @param {number} height Height of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition Rotation position vector of the circle relative to it self
     * @param {number} angleStart Starting angle of the circle's fill
     * @param {number} angleEnd Ending angle of the circle's fill
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together 
     * @param {object} color Color of the circle's fill 
     * @param {object} collider Collider of the circle 
     * @param {number} z Depth information for sorting in layer
     * @param {object} debug Debug options (hitbox)
     * @returns Circle
     */
    constructor({x, y, width, height, rotation, rotationPosition, angleStart, angleEnd, layer, tag, z, color, collider, debug}={}){
        super({
            x:(x==undefined?0:x), 
            y:(y==undefined?0:y), 
            width:(width==undefined?100:width), 
            height:(height==undefined?100:height), 
            rotation: rotation,
            rotationPosition: rotationPosition,
            layer:layer, 
            z: z,
            tag:tag
        })  
        
        this.angleStart = angleStart==undefined ? 0 : angleStart
        this.angleEnd = angleEnd==undefined ? Math.PI*2 : angleEnd
        
        this.color = color==undefined ? new Color() : color
        this.debug = {
            enabled : debug!=undefined,
            hitbox : (debug!=undefined && debug.hitbox!=undefined && debug.hitbox)
        }
    }
    
    /**
     * Is called every time the game updates. Calls it's components calc methods. 
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}={}, _this=this){
        for(let component of _this.components){ if(typeof component.onCalc==="function") component.onCalc({timestep:timestep, object:_this}) }
    }
    
    /**
     * Is called every time the game updates, after the calc. Calls it's components render methods. 
     * @method render
     * @param {number} x X-position to be drawn (by camera)
     * @param {number} y Y-position to be drawn (by camera)
     * @param {number} zoom zoom of the camera
     * @param {object} camera Camera object that caused the method
     * @param {object} renderer Renderer that will render the object
     * @returns {void}
     */
    render({x, y, width, height, zoom, camera, renderer}={}, _this=this){
        for(let component of _this.components){ if(typeof component.onAfterRender==="function") component.onBeforeRender({x:x, y:y, width:width, height:height, zoom:zoom, camera:camera,  renderer:renderer, object:_this}) }
        
        let x_ = parseInt(x+_this.dimensions.width*zoom/2),
            y_ = parseInt(y+_this.dimensions.height*zoom/2),
            radius = parseInt(_this.dimensions.width/2*zoom),
            rotationPosition = _this.rotationPosition.multScalar({scalar:zoom})
        
        renderer.fillCircle({x:x_, y:y_, radius: radius, rotation:_this.rotation, rotationPosition:rotationPosition, angleStart:_this.angleStart, angleEnd:_this.angleEnd, color:_this.color, ctx:_this.layer.ctx})
        
        for(let component of _this.components){ if(typeof component.onAfterRender==="function") component.onAfterRender({x:x, y:y, width:width, height:height, zoom:zoom, camera:camera,  renderer:renderer, object:_this}) }
    }
}