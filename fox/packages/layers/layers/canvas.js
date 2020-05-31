import {Layer} from './layer.js'
/**
 * The LayerCanvas represents the default drawing layer for sprites and default game objects
 *
 * @class LayerCanvas
 */
export class Canvas extends Layer{
    /**
     * Construct method of the object
     * @method constructor
     * @param {string} id ID of the canvas that is added to the dom
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically 
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns LayerCanvas
     */
    constructor({id, width, height}={}){
        super()
        
        //dimensions
        this.dimensions = {
            "width" : width==undefined ? fox.project.width : width,
            "height" : height==undefined ? fox.project.height : height,
        }
        
        //physical objects for rendering purposes
        this.canvas = document.createElement("canvas")
        this.canvas.id = id
        this.canvas.width = this.dimensions.width
        this.canvas.height = this.dimensions.height
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false
        if(!this.ctx.imageSmoothingEnabled){
            this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")
        }
        
        //game stuff
        this.objects = []
        
        //postprocessing stuff
        this.postprocessing = {
            "contrast": undefined,
            "grayscale": undefined,
            "brightness": undefined,
            "blur": undefined,
            "invert": undefined,
            "saturate": undefined,
            "sepia": undefined,
        }
        
        this.filter = ""
    }
    
    /**
     * Is called in every loop after the render method
     * @method postprocess
     * @return {void}
     */
    postprocess(_this=this){
        
    }
    
    /**
     * Is called every time before the render method is called and clears the whole canvas 
     * @method clear
     * @return {void}
     */
    clear(_this=this){
        this.ctx.clearRect(0,0,this.dimensions.width, this.dimensions.height    )
    }
}