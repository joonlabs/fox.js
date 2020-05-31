/**
 * The Layer represents the canvas that is added to the document's dom 
 *
 * @class Layer
 */
export class Layer{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically 
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns Layer
     */
    constructor({width, height}={}){
        //dimensions
        this.dimensions = {
            "width" : width,
            "height" : height,
        }
        
        //physical objects for rendering purposes
        this.canvas = document.createElement("canvas")
        this.canvas.width = this.dimensions.width
        this.canvas.height = this.dimensions.height
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false
        
        //game stuff
        this.objects = []
        this.shaders = []
    }
    
    /**
     * Is called in every loop right before the render method
     * @method calc
     * @return {void}
     */
    calcShaders(_this=this){
        for(let shader of _this.shaders){ 
            let data = _this.ctx.getImageData(0,0,_this.dimensions.width,_this.dimensions.height)
            shader.onCalc({
                data: data.data,
                width: _this.dimensions.width,
                height: _this.dimensions.height,
            })
            _this.ctx.putImageData(data, 0, 0)
        }
    }   
    
    /**
     * Is called in every loop after the render method
     * @method postprocess
     * @return {void}
     */
    postProcess(_this=this){
        
    }
    
    /**
     * Is called every time before the render method is called and clears the whole canvas 
     * @method clear
     * @return {void}
     */
    clear(_this=this){
        this.ctx.clearRect(0,0,this.dimensions.width, this.dimensions.height)
    }
    
    /**
     * Adds a shader to the layer
     * @method addShader
     * @param {object} shader Shader that should be added
     * @return {void}
     */
    addShader({shader}={}, _this=this){
        _this.shaders.push(shader)
        if(typeof shader.onInit==="function"){
            let data = shader.onInit({
                data: _this.ctx.getImageData(0,0,_this.dimensions.width,_this.dimensions.height).data,
                width: _this.dimensions.width,
                height: _this.dimensions.height,
            })
            
        }
    }
    
    /**
     * Removes a shader to the layer
     * @method removeShader
     * @param {object} shader Shader that should be removed
     * @return {void}
     */
    removeShader({shader}={}, _this=this){
        let idx = _this.components.indexOf(shader)
        if(idx!=-1){
            _this.shaders.splice(idx, 1)
            if(typeof shader.onDestroy==="function") shader.onDestroy({
            data: _this.ctx.getImageData(0,0,_this.dimensions.width,_this.dimensions.height).data,
            width: _this.dimensions.width,
            height: _this.dimensions.height,
        })
        } 
    }
}