import {Layer} from './layer.js'
import {WebGL} from "../../renderers/renderers/webgl.js";
import {Color} from "../../color/color.js";
import {Utils} from "../../utils/utils.js";

/**
 * The LayerLightning represents the lightning layer, that only renders light objects 
 *
 * @class LayerLightning
 */
export class Lightning extends Layer{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns LayerCanvas
     */
    constructor({width, height}={}){
        super({
            width:width,
            height:height,
            renderer: new WebGL()
        })

        if(!Utils.isWebGLAvailable()){
            Utils.warn("fox: Layer.Lightning: To support light, make sure WebGL is supported by your browser")
        }

        // re-init the renderer with lightning shaders
        this.renderer.init({
            width : this.dimensions.width,
            height : this.dimensions.height,
            useLightningShaders : true,
            useOffscreenCanvas : true
        })
        
        this.backgroundColor = new Color({a: 255})
    }

    /**
     * Is called in every loop after the render method. In the LightningLayer it converts the lights that are internally rendered as black points into transparent wholes with black surroundings. 
     * @method postprocess
     * @return {void}
     */
    postProcess({app}={}, _this=this){

    }
    
    /**
     * Is called every time before the render method is called and clears the whole canvas 
     * @method clear
     * @return {void}
     */
    clear(_this=this){
        this.renderer.clear({color: this.backgroundColor})
    }
}