/**
* The Renderer class provides the blueprint for all renderers (e.g. the basic canvas2d renderer)
*
* @class Renderer
*/
export class Renderer{
    /**
     * Construct method of the object
     * @method constructor
     * @returns Renderer
     */
    constructor(){
        this.canvas = undefined
        this.ctx = undefined
        this.initialized = false
    }

    getCanvas(){
        return this.canvas
    }

    init(){
        this.initialized = true
    }

    destroy(){
        this.ctx = null
        this.canvas = null
        this.initialized = false
    }

    isInitialized(){
        return this.initialized
    }
    
    
    /**
     * Clears the canvases buffer
     * @method clearRect
     * @param {number} x Starting x position to be cleared
     * @param {number} y Starting y position to be cleared
     * @param {number} width Width of the Rect to be cleared
     * @param {number} height Height of the Rect to be cleared
     * @param {object} layer Layer to be cleared
     * @return {void}
     */
    clearRect({x, y, width, height, layer}){
        // to be implemented by child class
    }
    
    /**
     * Fills a rect on the canvas
     * @method fillRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillRect({x, y, width, height, rotation, rotationPosition, color, layer}){
        // to be implemented by child class
    }
    
    /**
     * Strokes a rect on the canvas
     * @method strokeRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {number} lineWidth Line width of the rect's stroke
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeRect({x, y, width, height, rotation, rotationPosition, lineWidth, color, layer}){
        // to be implemented by child class
    }
    
    /**
     * Fills a cirlce on the canvas
     * @method fillCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} width Width of the circle
     * @param {number} height Height of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's fill
     * @param {number} angleEnd Ending Angle of the circle's fill
     * @param {object} color Color of the cirlce
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, color, layer}){
        // to be implemented by child class
    }
    
    /**
     * Strokes a cirlce on the canvas
     * @method strokeCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} width Width of the circle
     * @param {number} height Height of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's stroke
     * @param {number} angleEnd Ending Angle of the circle's stroke
     * @param {number} lineWidth lineWidth of the circle's stroke
     * @param {object} color Color of the cirlce' stroke
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, lineWidth, color, layer}){
        // to be implemented by child class
    }
}