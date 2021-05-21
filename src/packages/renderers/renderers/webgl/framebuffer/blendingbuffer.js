import {Framebuffer} from "../framebuffer.js"
import * as M4 from "../../m4.js"

export class BlendingBuffer extends Framebuffer {

    constructor({renderer, width, height, fragmentShaderKey}) {
        super({renderer, width, height})

        this.program = renderer.multiplyBlendingProgram;
        this.vao = renderer.multiplyBlendingVAO;
    }

    blendTexture({base, texture}) {
        const glBaseTexture = this.renderer.getOrUploadTexture({texture: base})
        const gl = this.renderer.gl
        glBaseTexture.bind({textureUnit: gl.TEXTURE1})
        this.program.use()
        this.program.setIntegerUniform({uniform: "u_base", value: 1})

        let baseMatrix = M4.scaling(texture.width / base.width, texture.height / base.height, 1)

        this.program.setUniformMatrix({uniform: "u_baseMatrix", matrix: baseMatrix})

        super.renderTexture({
            texture,
            x: 0, y: 0,
            width: this.width,
            height : this.height
        })
    }

    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        throw "fox: webgl: renderTexture shouldn't be used directly when using a blending buffer. Use blendTexture instead"
    }

    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        throw "fox: webgl: renderRectangle is unimplemented for a blending buffer"
    }
}