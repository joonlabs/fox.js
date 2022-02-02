import {Color} from "../../../color/index.js"
import {Texture} from "./texture.js"
import * as M4 from "../m4.js"
import {AbstractFramebuffer} from "../framebuffer.js"
import {WebGLUtils} from "./index.js"
import {Vec2D} from "../../../vectors/vectors/index.js"
import {Vectors} from "../../../vectors/index.js"
import {Utils} from "../../../utils/index.js"
import {WebGLCache} from "../webgl.js"

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
        super({renderer, width, height})
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
        this.program = renderer.textureProgram
        this.vao = renderer.textureVAO
        this.blendFunc = {srcRGB: gl.SRC_ALPHA, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA}
        this.blendEquation = {modeRGB: gl.FUNC_ADD, modeAlpha: gl.FUNC_ADD}
        this.uploadedMatrices = new Map()
        this.framebufferMatrix = WebGLUtils.createFramebufferMatrix({width: this.width, height: this.height, flipY: framebufferRef !== undefined})

        if (framebufferRef !== undefined) {
            this.framebufferRef = framebufferRef
        } else {
            this.framebufferRef = gl.createFramebuffer()
            this.bind()
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.textureRef, 0)
        }
    }

    bind() {
        this.renderer.cache(WebGLCache.FRAMEBUFFER).validate(this.framebufferRef)
        this.uploadedMatrices.clear()
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
        this.renderer.cache(WebGLCache.CLEAR_COLOR).validate(clearColor)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    _uploadMatrices() {
        this.renderer.uploadCameraTransform()
        const boundProgram = this.renderer.cache(WebGLCache.PROGRAM).validate()

        if (this.uploadedMatrices.get(boundProgram) !== this.framebufferMatrix) {
            boundProgram.setUniformMatrix({uniform: "u_framebufferMatrix", matrix: this.framebufferMatrix})
            this.uploadedMatrices.set(boundProgram, this.framebufferMatrix)
        }
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
    renderTexture({texture, x, y, width = texture.width, height = texture.height, rotation = 0, rotationPosition = new Vec2D()}) {
        const glTexture = this.renderer.getOrUploadTexture({texture})

        const gl = this.renderer.gl
        this.bind()
        this.renderer.cache(WebGLCache.VIEWPORT).validate({x: 0, y: 0, width: this.width, height: this.height})
        this.renderer.cache(WebGLCache.BLEND_FUNC).validate(this.blendFunc)
        this.renderer.cache(WebGLCache.BLEND_EQUATION).validate(this.blendEquation)

        this.program.use()
        this._uploadMatrices()
        this.vao.bind()
        glTexture.bind({textureUnit: gl.TEXTURE0})

        let matrix = WebGLUtils.createObjectMatrix({x, y, width, height, rotation: {angle: rotation, ...rotationPosition}})

        // set matrix and render
        this.program.setUniformMatrix({uniform: "u_objectMatrix", matrix})

        this.program.setUniformMatrix({uniform: "u_textureMatrix", matrix: M4.identity()})

        this.program.setIntegerUniform({uniform: "u_texture", value: 0})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        this.vao.unbind()
    }

    /**
     * Renders a rectangle
     * @method _renderRectangle
     * @param {number} x X position of the rectangle
     * @param {number} y Y position of the rectangle
     * @param {number} width Width of the rectangle
     * @param {number} height Height of the rectangle
     * @param {number} rotation Rotation of the rectangle
     * @param {object} rotationPosition rotationPosition of the rectangle
     * @param {Color} color Color of the rectangle
     * @param {Vec2D} borderWidth Width of the border in percent, grows inwards
     * @return {void}
     */
    _renderRectangle({x, y, width, height, rotation = 0, rotationPosition = new Vec2D(), color, borderWidth}) {
        const gl = this.renderer.gl
        this.bind()
        this.renderer.cache(WebGLCache.VIEWPORT).validate({x: 0, y: 0, width: this.width, height: this.height})
        this.renderer.cache(WebGLCache.BLEND_FUNC).validate(this.blendFunc)
        this.renderer.cache(WebGLCache.BLEND_EQUATION).validate(this.blendEquation)

        const program = this.renderer.rectangleProgram
        const vao = this.renderer.rectangleVAO

        program.use()
        this._uploadMatrices()
        vao.bind()
        gl.activeTexture(gl.TEXTURE0)

        let matrix = WebGLUtils.createObjectMatrix({x, y, width, height, rotation: {angle: rotation, ...rotationPosition}})

        // set matrix and render
        program.setUniformMatrix({uniform: "u_objectMatrix", matrix})

        program.setFloatingUniform({uniform: "u_borderWidth", value: borderWidth.x, v1: borderWidth.y})

        program.setFloatingUniform({uniform: "u_color", value: new Float32Array(color.asNormalizedRGBAList())})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        vao.unbind()
    }

    _renderCircle({x, y, radius, rotation = 0, rotationPosition = {x:0, y:0}, color, borderWidth}) {
        const gl = this.renderer.gl
        this.bind()
        this.renderer.cache(WebGLCache.VIEWPORT).validate({x: 0, y: 0, width: this.width, height: this.height})
        this.renderer.cache(WebGLCache.BLEND_FUNC).validate(this.blendFunc)
        this.renderer.cache(WebGLCache.BLEND_EQUATION).validate(this.blendEquation)

        const program = this.renderer.circleProgram
        const vao = this.renderer.circleVAO

        program.use()
        this._uploadMatrices()
        vao.bind()
        gl.activeTexture(gl.TEXTURE0)

        let matrix = WebGLUtils.createObjectMatrix({x: x - radius, y: y - radius, width: radius * 2, height: radius * 2, rotation: {angle: rotation, ...rotationPosition}})


        // set matrix and render
        program.setUniformMatrix({uniform: "u_objectMatrix", matrix})

        program.setFloatingUniform({uniform: "u_smoothing", value: 2 / radius})
        program.setFloatingUniform({uniform: "u_borderWidth", value: borderWidth})

        program.setFloatingUniform({uniform: "u_color", value: new Float32Array(color.asNormalizedRGBAList())})

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        vao.unbind()
    }

    fillRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        this._renderRectangle({
            x, y,
            width, height,
            rotation, rotationPosition,
            color,
            borderWidth: Vec2D.ONE
        })
    }


    fillCircle({x, y, radius, rotation, rotationPosition, color}) {
        this._renderCircle({
            x, y,
            radius,
            rotation, rotationPosition,
            color,
            borderWidth: 1
        })
    }

    strokeRectangle({x, y, width, height, rotation, rotationPosition, color, borderWidth}) {
        this._renderRectangle({
            x, y,
            width, height,
            rotation, rotationPosition,
            color,
            borderWidth: new Vec2D({
                x: borderWidth / width,
                y: borderWidth / height,
            })
        })
    }

    strokeCircle({x, y, radius, rotation, rotationPosition, color, borderWidth}) {
        this._renderCircle({
            x, y,
            radius,
            rotation, rotationPosition,
            color,
            borderWidth: borderWidth / radius * 2
        })
    }
}