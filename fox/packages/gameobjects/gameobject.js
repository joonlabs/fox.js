import {Vectors} from '../vectors/index.js'
import {Color} from '../color/index.js'

/**
* The GameObject represents the basic object of the engine. All kind of sprites, etc. extend it
*
* @class GameObject
*/
export class GameObject{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the game object
     * @param {number} y Y-position of the game object
     * @param {number} width Width of the game object
     * @param {number} height Height of the game object
     * @param {number} rotation Rotation of the game object
     * @param {object} rotationPosition Rotation position vector of the Colligame objectder relative to it self
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together 
     * @param {number} z Depth information for sorting in layer
     * @param {object} debug Debug options (hitbox)
     * @returns CircleCollider
     */
    constructor({x, y, width, height, rotation, rotationPosition, layer, tag, z, debug}={}){
        this.position = new Vectors.Vec2D({x:x, y:y})
        
        this.dimensions = {
            "width" : width,
            "height" : height,
        }
        
        this.z = z || 0
        
        this.rotation = (rotation==undefined)?0:rotation,
        this.rotationPosition = (rotationPosition==undefined)?new Vectors.Vec2D({x:parseInt(width/2), y:parseInt(height/2)}):new Vectors.Vec2D({x:rotationPosition.x, y:rotationPosition.y}),
        
        this.tag = tag
        
        this.settings = {
            "collision" : {
                "targets" : undefined
            }
        }
        
        this.components = []
        
        this.layer = layer
        if(!this.layer) console.warn("FOX: GameObject: you did not provide a layer for this game object:", this)
        
        this.debug = {
            enabled : debug!=undefined,
            hitbox : (debug!=undefined && debug.hitbox!=undefined && debug.hitbox)
        }
    }
    
    /**
     * Is called every time the game updates. #TO_BE_OVERRIDEN 
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}={}, _this=this){
        
    }
    
    /**
     * Is called after every time the game updated. #TO_BE_OVERRIDEN 
     * @method render
     * @param {object} object
     * @return {void}
     */
    render(position, dimensions, _this=this){
        
    }
    
    /**
     * Adds a component to the game object
     * @method addComponent
     * @param {object} component Component that should be added
     * @return {void}
     */
    addComponent({component}={}, _this=this){
        _this.components.push(component)
        if(typeof component.onInit==="function") component.onInit({object:_this})
    }
    
    /**
     * Removes a component to the game object
     * @method removeComponent
     * @param {object} component Component that should be removed
     * @return {void}
     */
    removeComponent({component}={}, _this=this){
        let idx = _this.components.indexOf(component)
        if(idx!=-1){
            _this.components.splice(idx, 1)
            if(typeof component.onDestroy==="function") component.onDestroy({object:_this})
        } 
    }
}