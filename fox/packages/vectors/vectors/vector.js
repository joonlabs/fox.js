import {Vec2D} from './vec2d.js';
/**
* The Vector class provides the blueprint and methods for vector operations
*
* @class Vector
*/
export class Vector{
    /**
     * Construct method of the object
     * @method constructor
     * @returns Vector
     */
    constructor(){}
    
    /**
     * Adds two vectors
     * @method add
     * @param {object} vector Vector to be added
     * @returns {object}
     */
    add({vector}={}, _this=this){
        if(vector.constructor.name!="Vec2D" || _this.constructor.name!="Vec2D"){ console.warn("fox: vector: you're trying to add at least one object that is not a vector"); return; }
        return new Vec2D({x: vector.x+_this.x, y: vector.y+_this.y})
    }
    
    /**
     * Subtracts two vectors
     * @method sub
     * @param {object} vector Vector to be subtracted
     * @returns {object}
     */
    sub({vector}={}, _this=this){
        if(vector.constructor.name!="Vec2D" || _this.constructor.name!="Vec2D"){ console.warn("fox: vector: you're trying to subtract at least one object that is not a vector"); return; }
        return new Vec2D({x: _this.x-vector.x, y: _this.y-vector.y})
    }
    
    /**
     * Perfomes the dot product of two vectors
     * @method dot
     * @param {object} vector Vector to be "dotted" with
     * @returns {object}
     */
    dot({vector}={}, _this){
        return new Vec2D({x: vector.x*_this.x, y: vector.y*_this.y})
    }
    
    /**
     * Scalar product of two vectors
     * @method dot
     * @param {object} vector Vector to be "dotted" with
     * @returns {object}
     */
    scal({vector}={}, _this){
        return (vector.x*_this.x + vector.y*_this.y)
    }
    
    /**
     * Adds a Scalar to a vector
     * @method addS
     * @param {number} scalar Scalar to be added
     * @returns {object}
     */
    addS({scalar}={}, _this=this){
        return new Vec2D({x: scalar+_this.x, y: scalar+_this.y})
    }
    
    /**
     * Adds a Scalar to a vector
     * @method subS
     * @param {number} scalar Scalar to be subtracted
     * @returns {object}
     */
    subS({scalar}={}, _this=this){
        return new Vec2D({x: _this.x-scalar, y: _this.y-scalar})
    }
    
    /**
     * Multiplies a Scalar with a vector
     * @method mulS
     * @param {number} scalar Scalar to be multiplied with
     * @returns {object}
     */
    multS({scalar}={}, _this=this){
        return new Vec2D({x: scalar*_this.x, y: scalar*_this.y})
    }
}