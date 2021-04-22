import {Collider} from './collider.js'
/**
* The CircleCollider represents a specific type of collider. It's shape is (obviously) a circle.
*
* @class CircleCollider
*/
export class CircleCollider extends Collider{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the collider
     * @param {number} y Y-position of the collider
     * @param {object} offset Offset vector of the collider from it's parent Object
     * @param {number} radius Radius of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} parentObject Reference to the parent object
     * @param {object} debug Debug options (hitbox)
     * @returns CircleCollider
     */
    constructor({x, y, offset, radius, rotation, rotationPosition, parentObject, debug}={}){
        super({x:x, y:y, offset:offset, width:radius*2, height:radius*2, rotation:rotation, rotationPosition:rotationPosition, parentObject:parentObject, debug:debug})
    }
    
    /**
     * Render method of the CircleCollider
     * @method onAfterRender
     * @param {number} x X-position to be drawn (by camera)
     * @param {number} y Y-position to be drawn (by camera)
     * @param {object} camera Camera object that caused the method
     * @param {object} object Parent object for rendering purposes (e.g. layer)
     * @returns {void}
     */
    onAfterRender({x, y, width, height, camera, renderer, object}={}, _this=this){
        if(_this.debug.hitbox){
            x += _this.offset.x
            y += _this.offset.y
            let x_ = x+_this.dimensions.width,
                y_ = y+_this.dimensions.height,
                radius = _this.dimensions.width,
                rotationPosition = _this.rotationPosition
            
            renderer.strokeCircle({x:x_, y:y_, radius: radius, rotation:_this.rotation, rotationPosition:rotationPosition, angleStart:0, angleEnd:Math.PI*2, color:"#de5a1f", lineWidth:4, ctx:object.layer.ctx})
        }
    }
}