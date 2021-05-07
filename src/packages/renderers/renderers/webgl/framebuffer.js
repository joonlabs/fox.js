import {Color} from "../../../color/index.js"
import {Texture} from "./texture.js"
import * as M4 from "../m4.js"
import {AbstractFramebuffer} from "../framebuffer.js"
import {Utils} from "../../../utils/index.js"

export class Framebuffer extends AbstractFramebuffer {

    /**
     * Creates a webgl framebuffer object
     * @param {WebGL} renderer
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @param {WebGLFramebuffer | null} [framebufferRef]
     * @param {WebGLTexture | null} [textureRef]
     */
    constructor({renderer, width, height, framebufferRef, textureRef}) {
        super({renderer})
        this.texture = new Texture({
            renderer,
            level: 0,
            format: renderer.gl.RGBA,
            width, height,
            type: renderer.gl.UNSIGNED_BYTE,
            pixels: null,
            textureRef: textureRef
        })
        this.renderer = renderer
        this.height = height
        this.width = width

        if (framebufferRef !== undefined) {
            this.framebufferRef = framebufferRef
        } else {
            const gl = renderer.gl
            this.framebufferRef = gl.createFramebuffer()
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferRef)
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.textureRef, 0)
        }
    }

    destroy() {
        this.texture.destroy()
        this.renderer.gl.deleteFramebuffer(this.framebufferRef)
    }

    /**
     * Clears the framebuffer
     * @param clearColor The color that should be used to clear the framebuffer, defaults to black
     */
    clear({clearColor} = {}) {
        clearColor = clearColor || new Color()
        this.renderer.gl.clearColor(...clearColor.asNormalizedRGBAList())
        this.renderer.gl.clear(this.renderer.gl.COLOR_BUFFER_BIT)
    }

    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {Texture | AbstractFramebuffer} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} width Width of the texture
     * @param {number} height Height of the texture
     * @param {number} [rotation] Rotation of the texture
     * @param {object} [rotationPosition] rotationPosition of the texture
     * @param {boolean} [lighting] If the lighting shader should be used
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition, lighting}) {
        const glTexture = this.renderer.getOrUploadTexture({texture})
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        const gl = this.renderer.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferRef)

        const program = lighting === true ? this.renderer.lightingProgram : this.renderer.textureProgram
        const vao = lighting === true ? this.renderer.lightingVAO : this.renderer.textureVAO

        program.use()
        vao.bind()
        gl.activeTexture(gl.TEXTURE0)
        glTexture.bind()

        if (lighting === true) {
            gl.blendFunc(gl.ONE, gl.ONE);
            gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT)
        } else {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        // this matrix will convert from pixels to clip space
        let matrix = M4.orthographic(0, this.width, 0, this.height, -1, 1)
        if (this.framebufferRef === null) {
            // Flip the image when drawing to the real canvas
            matrix = M4.orthographic(0, this.width, this.height, 0, -1, 1)
        }

        if (rotation % (Math.PI * 2) !== 0) {
            // rotate, scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.translate(matrix, rotationPosition.x, rotationPosition.y, 0);
            matrix = M4.translate(matrix, rotationPosition.x / width, rotationPosition.y / height, 0);
            matrix = M4.axisRotate(matrix, [0, 0, 1], rotation)
            matrix = M4.scale(matrix, width, height, 1);
            matrix = M4.translate(matrix, -rotationPosition.x / width, -rotationPosition.y / height, 0);
        } else {
            // scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.scale(matrix, width, height, 1);
        }

        // set matrix and render
        program.setUniformMatrix({uniform: "u_matrix", matrix})

        program.setUniformMatrix({uniform: "u_textureMatrix", matrix: M4.identity()})

        program.setIntegerUniform({uniform: "u_texture", value: 0})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        vao.unbind()
    }

    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        const gl = this.renderer.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferRef)

        const program = this.renderer.rectangleProgram
        const vao = this.renderer.rectangleVAO

        program.use()
        vao.bind()
        gl.activeTexture(gl.TEXTURE0)

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // this matrix will convert from pixels to clip space
        let matrix = M4.orthographic(0, this.width, 0, this.height, -1, 1)
        if (this.framebufferRef === null) {
            // Flip the image when drawing to the real canvas
            matrix = M4.orthographic(0, this.width, this.height, 0, -1, 1)
        }

        if (rotation % (Math.PI * 2) !== 0) {
            // rotate, scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.translate(matrix, rotationPosition.x, rotationPosition.y, 0);
            matrix = M4.translate(matrix, rotationPosition.x / width, rotationPosition.y / height, 0);
            matrix = M4.axisRotate(matrix, [0, 0, 1], rotation)
            matrix = M4.scale(matrix, width, height, 1);
            matrix = M4.translate(matrix, -rotationPosition.x / width, -rotationPosition.y / height, 0);
        } else {
            // scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.scale(matrix, width, height, 1);
        }

        // set matrix and render
        program.setUniformMatrix({uniform: "u_matrix", matrix})

        program.setFloatingUniform({uniform: "u_color", value: new Float32Array(color.asNormalizedRGBAList())})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        vao.unbind()
    }
}