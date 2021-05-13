import {Layer} from './layer.js'
import {Color} from "../../color/color.js";
import {FramebufferType} from "../../renderers/index.js"
import {Utils} from "../../utils/index.js"

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
     * @param {number} globalLight The brightness of the global light, 0 means complete darkness, 1 means full brightness
     * @returns LayerCanvas
     */
    constructor({width, height, globalLight} = {}) {
        super({
            width: width,
            height: height
        })

        this.globalLight = globalLight || 0

        this.backgroundColor = new Color({a: 1 - Math.min(1, Math.abs(this.globalLight))})
    }

    /**
     * Is called by the scene, when the scene is initialized
     */
    init({renderer}) {
        this.lightingBuffer = renderer.createFramebuffer({
            width: this.dimensions.width,
            height: this.dimensions.height,
            type: FramebufferType.LIGHTING
        })
    }

    /**
     * Is called every time before the render method is called and clears the whole canvas
     * @return {void}
     */
    clear(_this = this) {
        this.lightingBuffer.clear({clearColor: this.backgroundColor})
    }

    render({offset, framebuffer}) {
        this.lightingBuffer.clear({clearColor: this.backgroundColor})
        super.render({offset, framebuffer: this.lightingBuffer})

        framebuffer.renderTexture({
            texture: this.lightingBuffer,
            x: 0,
            y: 0,
        })
    }
}