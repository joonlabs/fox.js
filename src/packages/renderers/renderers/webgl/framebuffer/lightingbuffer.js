import {Framebuffer} from "../framebuffer.js"

export class Lightingbuffer extends Framebuffer {

    constructor({renderer, width, height}) {
        super({renderer, width, height});

        const gl = renderer.gl
        this.blendFunc = {srcRGB: gl.ONE, dstRGB: gl.ONE, srcAlpha: gl.ONE, dstAlpha: gl.ONE}
        this.blendEquation = {mode: gl.FUNC_REVERSE_SUBTRACT}
    }

}