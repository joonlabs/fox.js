import {Layer} from './layer.js'
import {WebGL} from "../../renderers/renderers/webgl.js";
import {Color} from "../../color/color.js";
import {Utils} from "../../utils/utils.js";

/**
 * The LayerLighting represents the lighting layer, that only renders light objects
 *
 * @class LayerLighting
 */
export class Lighting extends Layer {
    /**
     * Construct method of the object
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns LayerCanvas
     */
    constructor({width, height, globalLight} = {}) {
        super({
            width: width,
            height: height,
            renderer: new WebGL()
        })

        this.globalLight = globalLight || 0

        if (!Utils.isWebGLAvailable()) {
            Utils.warn("src: Layer.Lighting: To support light, make sure WebGL is supported by your browser")
        }

        this.backgroundColor = new Color({a: 1 - Math.min(1, Math.abs(this.globalLight))})
    }

    /**
     * Is called by the scene, when the scene is initialized
     */
    init() {
        // re-init the renderer with lighting shaders
        this.renderer.init({
            width: this.dimensions.width,
            height: this.dimensions.height,
            useLightingShaders: true,
            useOffscreenCanvas: true
        })
    }

    /**
     * Is called every time before the render method is called and clears the whole canvas
     * @return {void}
     */
    clear(_this = this) {
        this.renderer.clear({color: this.backgroundColor})
    }
}