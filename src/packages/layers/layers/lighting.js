import {Layer} from './layer.js'
import {Color} from "../../color/color.js";
import {FramebufferType} from "../../renderers/index.js"

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

        let backgroundGrey = Math.min(1, Math.abs(this.globalLight)) * 255
        this.backgroundColor = new Color({r: backgroundGrey, g: backgroundGrey, b: backgroundGrey})
    }

    /**
     * Is called by the scene, when the scene is initialized
     */
    init({renderer}) {
        this.lightingBuffer = renderer.createFramebuffer({
            width: this.dimensions.width,
            height: this.dimensions.height,
            type: FramebufferType.NORMAL
        })
        this.blendBuffer = renderer.createFramebuffer({
            width: this.dimensions.width,
            height: this.dimensions.height,
            type: FramebufferType.MULTIPLY_BLENDING
        })
    }

    render({offset, framebuffer}) {
        this.lightingBuffer.clear({clearColor: this.backgroundColor})
        this.blendBuffer.clear()
        super.render({offset, framebuffer: this.lightingBuffer})

        this.blendBuffer.blendTexture({
            base: framebuffer,
            texture: this.lightingBuffer,
        })

        framebuffer.renderTexture({
            texture: this.blendBuffer,
            x: 0,
            y: 0,
        })
    }
}