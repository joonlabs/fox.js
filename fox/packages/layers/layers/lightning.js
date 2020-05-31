import {Layer} from './layer.js'
/**
 * The LayerLightning represents the lightning layer, that only renders light objects 
 *
 * @class LayerLightning
 */
export class Lightning extends Layer{
    /**
     * Construct method of the object
     * @method constructor
     * @param {string} id ID of the canvas that is added to the dom
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically 
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns LayerCanvas
     */
    constructor({id, width, height}={}){
        super({id:id, width:width, height:height})
        //this.ctx.globalCompositeOperation = "lighter"
    }
    
    /**
     * Is called in every loop after the render method. In the LightningLayer it converts the lights that are internally rendered as black points into transparent wholes with black surroundings. 
     * @method postprocess
     * @return {void}
     */
    postProcess({app}={}, _this=this){
        let imgd = this.ctx.getImageData(0, 0, _this.dimensions.width, _this.dimensions.height);
        let pix = imgd.data;

        for (let i = 0, n = pix.length; i < n; i += 4) {    
            let brightness = parseInt(0.299*pix[i+0] + 0.587*pix[i+1] + 0.114*pix[i+2])
            pix[i+0] = 0
            pix[i+1] = 0
            pix[i+2] = 0
            
            pix[i+3] = 255-pix[i+3]//*.75            
        }
        
        this.ctx.putImageData(imgd, 0, 0);
    }
    
    /**
     * Is called every time before the render method is called and clears the whole canvas 
     * @method clear
     * @return {void}
     */
    clear(_this=this){
        this.ctx.clearRect(0,0,this.dimensions.width, this.dimensions.height)
    }
}