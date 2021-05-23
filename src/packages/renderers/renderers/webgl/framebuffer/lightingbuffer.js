import {Framebuffer} from "../framebuffer.js"

export class LightingBuffer extends Framebuffer {
    constructor({renderer, width, height}) {
        super({renderer, width, height})

        const gl = renderer.gl
        this.blendFunc = {srcRGB: gl.SRC_ALPHA, dstRGB: gl.DST_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA}
    }
}