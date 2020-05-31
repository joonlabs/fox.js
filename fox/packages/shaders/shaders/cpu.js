/**
* The CPU shader represents a deterministic function that can manipulate the pixels of a texture and is executed by the cpu
*
* @class CPU
*/
export class CPU{
    constructor({}={}){}
    
    /**
     * Is called when the shader is intatiated. #TO_BE_OVERRIDEN
     * @method onInit
     * @param {number} width Width of the canvas
     * @param {number} height Height of the canvas
     * @return {void}
     */
    onInit({width, height}={}, _this=this){return undefined }
    
    /**
     * Is called every time when the game object is calculated, to check, wether the shader should be executed or not. The default return value is false. #TO_BE_OVERRIDEN 
     * @method shouldRepaint
     * @param {object} data Pixels as 1d array form the canvas
     * @param {number} width Width of the canvas
     * @param {number} height Height of the canvas
     * @return {boolean}
     */
    shouldRepaint(_this=this){ return false }
    
    /**
     * Is called every time when the game object is calculated. #TO_BE_OVERRIDEN 
     * @method onCalc
     * @param {object} data Pixels as 1d array form the canvas
     * @param {number} width Width of the canvas
     * @param {number} height Height of the canvas
     * @return {void}
     */
    onCalc({data, width, height}={}, _this=this){ return undefined }
    
    /**
     * Is called when the shader is destroyed. #TO_BE_OVERRIDEN 
     * @method onDestroy
     * @param {number} width Width of the canvas
     * @param {number} height Height of the canvas
     * @return {void}
     */
    onDestroy({width, height}={}, _this=this){ return undefined }
}