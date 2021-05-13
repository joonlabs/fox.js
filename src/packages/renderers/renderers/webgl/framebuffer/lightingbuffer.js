import {Framebuffer} from "../framebuffer.js"

export class Lightingbuffer extends Framebuffer {

    constructor({renderer, width, height}) {
        super({renderer, width, height});

        this.program = renderer.lightingProgram
        this.vao = renderer.lightingVAO
    }

    renderTexture(params) {
        const gl = this.renderer.gl

        gl.blendFunc(gl.ONE, gl.ONE)
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT)

        super.renderTexture(params)

        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendEquation(gl.FUNC_ADD)
    }

}