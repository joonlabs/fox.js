import {Renderer} from './renderer.js'
import {Texture} from "../../assets/assets/index.js"
import {WebGLUtils, WebGLTexture, Framebuffers, Program, VertexArray} from "./webgl/index.js"
import {FramebufferType} from "./index.js"

/**
 * The WebGL is the basic renderer using the html5 webgl api
 *
 * @class WebGL
 */
export class WebGL extends Renderer {
    /**
     * Construct method of the object
     * @method constructor
     * @returns WebGL
     */
    constructor() {
        super()
    }

    init({width, height}) {
        super.init()

        // init internal webgl-texture store
        this.textureStore = new Map()

        this.compiledShaders = new Map()

        this.boundFramebuffer = null
        this.boundVAO = null
        this.boundProgram = null
        this.boundTexture = null
        this.boundClearColor = null
        this.boundViewport = null
        this.boundBlendFunc = null
        this.boundBlendEquation = null

        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.gl = this.canvas.getContext("webgl")
        this.gl.imageSmoothingEnabled = false
        this.glVao = this.gl.getExtension("OES_vertex_array_object")
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")

        this.textureProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils._vertexShaderTexture, fragmentShaderSrc: WebGLUtils._fragmentShaderTexture})
        this.rectangleProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils._vertexShaderSolid, fragmentShaderSrc: WebGLUtils._fragmentShaderSolid})
        this.programs = [
            this.textureProgram,
            this.rectangleProgram
        ]

        // Buffer used to draw quads
        // Should be used in conjunction with gl.TRIANGLE_STRIP
        this.quadBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
          0, 0,
          0, 1,
          1, 0,
          1, 1,
        ]), this.gl.STATIC_DRAW)

        let _this = this

        this.textureVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.textureProgram.programRef, "a_position");
                let texcoordLocation = _this.gl.getAttribLocation(_this.textureProgram.programRef, "a_texcoord");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(texcoordLocation);
                _this.gl.vertexAttribPointer(texcoordLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.rectangleVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.rectangleProgram.programRef, "a_position");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.VAOs = [
            this.textureVAO,
            this.rectangleVAO
        ]

        this.mainFramebuffer = new Framebuffers.Framebuffer({
            renderer: this,
            width: width,
            height: height,
            framebufferRef: null,
            textureRef: null,
        })

        this.gl.enable(this.gl.BLEND);
        this.setBlendFuncSeparate({srcRGB: this.gl.SRC_ALPHA, dstRGB: this.gl.ONE_MINUS_SRC_ALPHA, srcAlpha: this.gl.ONE, dstAlpha: this.gl.ONE_MINUS_SRC_ALPHA});
    }

    destroy() {
        for (let shader of this.compiledShaders.values()) {
            this.gl.deleteShader(shader)
        }

        this.programs.forEach(program => program.destroy())
        this.VAOs.forEach(VAO => VAO.destroy())

        for (let texture of this.textureStore.values()) {
            this.gl.deleteTexture(texture)
        }
        this.gl.getExtension('WEBGL_lose_context').loseContext();
        super.destroy();
    }

    createFramebuffer({width, height, type}) {
        switch (type) {
            case FramebufferType.LIGHTING:
                return new Framebuffers.Lightingbuffer({renderer: this, width, height})
            default:
                return new Framebuffers.Framebuffer({renderer: this, width, height})
        }
    }

    getMainFramebuffer() {
        return this.mainFramebuffer
    }

    /**
     *
     * @param {Texture | Framebuffer} texture
     * @returns {WebGLTexture}
     */
    getOrUploadTexture({texture}) {
        if (texture instanceof Framebuffers.Framebuffer) {
            return texture.texture
        } else {
            if (this.textureStore.has(texture.getId())) {
                return this.textureStore.get(texture.getId())
            } else {
                let glTexture = new WebGLTexture({
                    renderer: this,
                    level: 0,
                    format: this.gl.RGBA,
                    type: this.gl.UNSIGNED_BYTE,
                    pixels: texture.getTexture(),
                })
                this.textureStore.set(texture.getId(), glTexture)
                return glTexture
            }
        }
    }

    setViewport({x, y, width, height}) {
        if (   this.boundViewport?.x      !== x
            || this.boundViewport?.y      !== y
            || this.boundViewport?.width  !== width
            || this.boundViewport?.height !== height
        ) {
            this.gl.viewport(x, y, width, height)
            this.boundViewport = {x, y, width, height}
        }
    }

    setClearColor(color) {
        if (   this.boundClearColor?.r !== color.r
            || this.boundClearColor?.g !== color.g
            || this.boundClearColor?.b !== color.b
            || this.boundClearColor?.a !== color.a
        ) {
            this.gl.clearColor(...color.asNormalizedRGBAList())
            this.boundClearColor = color
        }
    }

    setBlendFuncSeparate({srcRGB, dstRGB, srcAlpha, dstAlpha}) {
        if (this.boundBlendFunc?.srcRGB !== srcRGB
            ||this.boundBlendFunc?.dstRGB !== dstRGB
            ||this.boundBlendFunc?.srcAlpha !== srcAlpha
            ||this.boundBlendFunc?.dstAlpha !== dstAlpha
        ) {
            this.gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha)
            this.boundBlendFunc = {srcRGB, dstRGB, srcAlpha, dstAlpha}
        }
    }

    setBlendEquationSeperate({modeRGB, modeAlpha}) {
        if (this.boundBlendEquation?.modeRGB !== modeRGB
            || this.boundBlendEquation?.modeAlpha !== modeAlpha) {
            this.gl.blendEquationSeparate(modeRGB, modeAlpha)
            this.boundBlendEquation = {modeRGB, modeAlpha}
        }
    }
}