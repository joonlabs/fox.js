import {Renderer} from './renderer.js'
import {Utils} from "../../utils/index.js"
import * as M4 from './m4.js'
import {Texture} from "../../assets/assets/index.js"
import {Framebuffer, WebGLUtils, WebGLTexture} from "./webgl/index.js"
import {Program} from "./webgl/program.js"
import {VertexArray} from "./webgl/vertexarray.js"

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

    init({width, height, useLightingShaders, useOffscreenCanvas}) {
        super.init()

        // init internal webgl-texture store
        this.textureStore = new Map()

        this.compiledShaders = new Map()

        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.gl = this.canvas.getContext("webgl")
        this.gl.imageSmoothingEnabled = false
        this.glVao = this.gl.getExtension("OES_vertex_array_object")
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")

        this.mainFramebuffer = new Framebuffer({
            renderer: this,
            width: width,
            height: height,
            framebufferRef: null,
            textureRef: null,
        })

        this.textureProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils._vertexShaderTexture, fragmentShaderSrc: WebGLUtils._fragmentShaderTexture})
        this.lightingProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils._vertexShaderTexture, fragmentShaderSrc: WebGLUtils._fragmentShaderLighting})
        this.rectangleProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils._vertexShaderSolid, fragmentShaderSrc: WebGLUtils._fragmentShaderSolid})
        this.programs = [
            this.textureProgram,
            this.lightingProgram,
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

        this.lightingVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.lightingProgram.programRef, "a_position");
                let texcoordLocation = _this.gl.getAttribLocation(_this.lightingProgram.programRef, "a_texcoord");

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
            this.lightingVAO,
            this.rectangleVAO
        ]

        this.gl.enable(this.gl.BLEND);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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

    createFramebuffer({width, height}) {
        return new Framebuffer({renderer: this, width, height})
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
        if (texture instanceof Framebuffer) {
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

    /**
     * Fills a rect on the canvas
     * @method fillRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of the rect
     * @param {number} height Height of the rect
     * @param {number} rotation Rotation of the rect
     * @param {object} rotationPosition rotationPosition of the rect
     * @param {object} color Color of the rect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillRect({x, y, width, height, rotation, rotationPosition, color, ctx}) {
        // create texture
        let tex = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([color.r, color.g, color.b, color.a * 255]))

        // this matrix will convert from pixels to clip space
        let matrix = M4.orthographic(0, this.canvas.width, this.canvas.height, 0, -1, 1);

        if (rotation % (Math.PI * 2) !== 0) {
            // rotate, scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.translate(matrix, width / 2, height / 2, 0);
            matrix = M4.translate(matrix, .5, .5, 0);
            matrix = M4.axisRotate(matrix, [0, 0, 1], rotation)
            matrix = M4.scale(matrix, width, height, 1);
            matrix = M4.translate(matrix, -.5, -.5, 0);
        } else {
            // scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.scale(matrix, width, height, 1);
        }

        // set matrix and render
        this.program.setUniformMatrix({uniform: "u_matrix", matrix})

        this.program.setIntegerUniform({uniform: "u_texture", value: 0})
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);


        this.gl.deleteTexture(tex)
    }
}