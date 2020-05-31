import {Component} from '../../components/index.js'
import {Vectors} from '../../vectors/index.js'
/**
* The Collider represents a hitbox for any gameobject that supports a collider. A Collider cannot be rendered,
* shown, or added to a scene by its own but needs a parent object in order to exist. 
* However, keep in mind that the x and y coordinates for a collider are passed by it's parentObject and cannot be set by yourself. 
*
* @class Collider
*/
export class Collider extends Component{
    /**
    * Constructs the Collider Object 
    * 
    * @method constructor
    * @param {object} offset
    * @param {number} width
    * @param {number} height
    * @param {number} rotation
    * @param {number} rotationPosition
    * @param {object} parentObject
    * @param {object} debug
    * @return Collider
    */
    constructor({offset, width, height, rotation, rotationPosition, parentObject, debug}={}){
        super()
        
        offset = offset || new Vectors.Vec2D()
        this.offset = new Vectors.Vec2D({x:offset.x, y:offset.y})
        
        this.position = new Vectors.Vec2D()
        
        this.rotation = (rotation==undefined)?0:rotation,
        this.rotationPosition = (rotationPosition==undefined)?new Vectors.Vec2D({x:parseInt(width/2), y:parseInt(height/2)}):new Vectors.Vec2D({x:rotationPosition.x, y:rotationPosition.y}),
        
        this.parentObject = parentObject
        
        this.dimensions = {
            "width" : width,
            "height" : height,
        }
        
        this.debug = {
            enabled : debug!=undefined,
            hitbox : (debug!=undefined && debug.hitbox!=undefined && debug.hitbox)
        }
    }
    
    /**
     * Is called when the component is intatiated
     * @method onInit
     * @param {object} object
     * @return {void}
     */
    onInit({object}={}, _this=this){
        //override the default position with the position of the parentObject
        _this.position.x = object.position.x + _this.offset.x
        _this.position.y = object.position.y + _this.offset.y
    }
    
    /**
     * Is called whenever the next frame is calculated. The collider updates the position of the parent object.
     * @method onCalc
     * @param {object} object
     * @return {void}
     */
    onCalc({timestep, object}={}, _this=this){
        object.position.x = _this.position.x - _this.offset.x
        object.position.y = _this.position.y - _this.offset.y
        object.rotation = _this.rotation
        object.rotationPosition = _this.offset.add({vector: _this.rotationPosition})
    }
}