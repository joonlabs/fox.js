import {Color} from "../../../color/index.js"
import {Texture} from "./texture.js"
import * as M4 from "../m4.js"
import {AbstractFramebuffer} from "../framebuffer.js"
import {WebGLUtils} from "./index.js"

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
        const gl = renderer.gl
        this.renderer = renderer
        this.height = height
        this.width = width
        this.program = renderer.textureProgram
        this.vao = renderer.textureVAO
        this.blendFunc = {srcRGB: gl.SRC_ALPHA, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA}
        this.blendEquation = {mode: gl.FUNC_ADD}

        if (framebufferRef !== undefined) {
            this.framebufferRef = framebufferRef
        } else {
            this.framebufferRef = gl.createFramebuffer()
            this.bind()
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.textureRef, 0)
        }
    }

    bind() {
        if (this.renderer.boundFramebuffer !== this) {
            this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.framebufferRef)
            this.renderer.boundFramebuffer = this
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
        const gl = this.renderer.gl
        clearColor = clearColor || new Color()

        this.bind()
        this.renderer.setClearColor(clearColor)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {Texture | AbstractFramebuffer} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} [width] Width of the texture
     * @param {number} [height] Height of the texture
     * @param {number} [rotation] Rotation of the texture
     * @param {object} [rotationPosition] rotationPosition of the texture
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        const glTexture = this.renderer.getOrUploadTexture({texture})
        width = width === undefined ? texture.width : width
        height = height === undefined ? texture.height : height
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        const gl = this.renderer.gl
        this.bind()
        this.renderer.setViewport({x: 0, y: 0, width: this.width, height: this.height})
        this.renderer.setBlendFuncSeparate(this.blendFunc)
        this.renderer.setBlendEquation(this.blendEquation)

        this.program.use()
        this.vao.bind()
        gl.activeTexture(gl.TEXTURE0)
        glTexture.bind()

        let matrix = M4.multiply(
            WebGLUtils.createFramebufferMatrix({width: this.width, height: this.height, flipY: this.framebufferRef === null}),
            WebGLUtils.createObjectMatrix({x, y, width, height, rotation: {angle: rotation, ...rotationPosition}})
        )


        // set matrix and render
        this.program.setUniformMatrix({uniform: "u_matrix", matrix})

        this.program.setUniformMatrix({uniform: "u_textureMatrix", matrix: M4.identity()})

        this.program.setIntegerUniform({uniform: "u_texture", value: 0})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        this.vao.unbind()
    }

    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        const gl = this.renderer.gl
        this.bind()
        this.renderer.setViewport({x: 0, y: 0, width: this.width, height: this.height})

        const program = this.renderer.rectangleProgram
        const vao = this.renderer.rectangleVAO

        program.use()
        vao.bind()
        gl.activeTexture(gl.TEXTURE0)

        //this.renderer.setBlendFuncSeparate({srcRGB: gl.SRC_ALPHA, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA});

        let matrix = M4.multiply(
            WebGLUtils.createFramebufferMatrix({width: this.width, height: this.height, flipY: this.framebufferRef === null}),
            WebGLUtils.createObjectMatrix({x, y, width, height, rotation: {angle: rotation, ...rotationPosition}})
        )

        // set matrix and render
        program.setUniformMatrix({uniform: "u_matrix", matrix})

        program.setFloatingUniform({uniform: "u_color", value: new Float32Array(color.asNormalizedRGBAList())})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        vao.unbind()
    }
}