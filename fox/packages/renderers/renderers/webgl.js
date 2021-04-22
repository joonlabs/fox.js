import {Renderer} from './renderer.js'
import {Utils} from "../../utils/index.js";
import * as M4 from './m4.js'

/**
 * The Canvas2D is the basic renderer using the html5 canvas2d api
 *
 * @class Canvas2D
 */
export class WebGL extends Renderer{
    /**
     * Construct method of the object
     * @method constructor
     * @returns Canvas2D
     */
    constructor(){
        super()
    }

    init({width, height, useLightningShaders}) {
        //physical objects for rendering purposes
        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext("webgl")
        this.ctx.imageSmoothingEnabled = false

        // pixelating settings
        this.ctx.imageSmoothingEnabled = false
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")
    
        // compile shaders as program
        this.program = useLightningShaders
            ? WebGLUtils.createProgramLightning({ctx: this.ctx})
            : WebGLUtils.createProgram({ctx: this.ctx})

        // look up where the vertex data needs to go.
        this.positionLocation = this.ctx.getAttribLocation(this.program, "a_position");
        this.texcoordLocation = this.ctx.getAttribLocation(this.program, "a_texcoord");

        // lookup uniforms
        this.matrixLocation = this.ctx.getUniformLocation(this.program, "u_matrix");
        this.textureLocation = this.ctx.getUniformLocation(this.program, "u_texture");

        // Create a buffer.
        this.positionBuffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);

        // enable alpha blending for overlapping textures
        if(!useLightningShaders){
            this.ctx.enable(this.ctx.BLEND);
            this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
        }else{
            this.ctx.enable(this.ctx.BLEND);
            this.ctx.blendFunc(this.ctx.ONE, this.ctx.ONE);
            this.ctx.blendEquation(this.ctx.FUNC_REVERSE_SUBTRACT)
        }

        // Put a unit quad in the buffer
        this.positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.positions), this.ctx.STATIC_DRAW);

        // Create a buffer for texture coords
        this.texcoordBuffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texcoordBuffer);

        // Put texcoords in the buffer
        this.texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.texcoords), this.ctx.STATIC_DRAW);

        // Tell WebGL to use our shader program pair
        this.ctx.useProgram(this.program);

        // Setup the attributes to pull data from our buffers
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
        this.ctx.enableVertexAttribArray(this.positionLocation);
        this.ctx.vertexAttribPointer(this.positionLocation, 2, this.ctx.FLOAT, false, 0, 0);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texcoordBuffer);
        this.ctx.enableVertexAttribArray(this.texcoordLocation);
        this.ctx.vertexAttribPointer(this.texcoordLocation, 2, this.ctx.FLOAT, false, 0, 0);

        this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Clears the canvas buffer
     */
    clear({color}={}){
        if(color){
            this.ctx.clearColor(color.r/255, color.g/255, color.b/255, color.a/255)
        }
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)
    }

    /**
     * Fills a rect on the canvas
     * @method fillRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillRect({x, y, width, height, rotation, rotationPosition, color, ctx}, _this=this){
        // create texture
        let tex = this.ctx.createTexture()
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, tex)
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, 1, 1, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, new Uint8ClampedArray([color.r, color.g, color.b, color.a]))

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
        this.ctx.uniformMatrix4fv(this.matrixLocation, false, matrix);
        this.ctx.uniform1i(this.textureLocation, 0);
        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);


        this.ctx.deleteTexture(tex)
    }

    /**
     * Strokes a rect on the canvas
     * @method strokeRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {number} lineWidth Line width of the rect's stroke
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeRect({x, y, width, height, rotation, rotationPosition, lineWidth, color, ctx}, _this=this){
        Utils.warn("fox: webgl: strokeRect is not available in the WebGL-Renderer.")
    }

    /**
     * Fills a cirlce on the canvas
     * @method fillCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's fill
     * @param {number} angleEnd Ending Angle of the circle's fill
     * @param {object} color Color of the cirlce
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, color, ctx}, _this=this){
        Utils.warn("fox: webgl: fillCircle is not available in the WebGL-Renderer.")
    }


    /**
     * Strokes a cirlce on the canvas
     * @method strokeCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's stroke
     * @param {number} angleEnd Ending Angle of the circle's stroke
     * @param {number} lineWidth lineWidth of the circle's stroke
     * @param {object} color Color of the cirlce' stroke
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, lineWidth, color, ctx}, _this=this){
        Utils.warn("fox: webgl: strokeCircle is not available in the WebGL-Renderer.")
    }


    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {object} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} width Width of the texture
     * @param {number} height Height of the texture
     * @param {number} rotation Rotation of the texture
     * @param {object} rotationPosition rotationPosition of the texture
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        // create texture
        let tex = this.ctx.createTexture()
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, tex);
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, texture);

        //this.ctx.bindTexture(this.ctx.TEXTURE_2D, tex)
        //this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, 1, 1, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, null)

        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
        
        // this matrix will convert from pixels to clip space
        let matrix = M4.orthographic(0, this.canvas.width, this.canvas.height, 0, -1, 1);

        if (rotation % (Math.PI * 2) !== 0) {
            // rotate, scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.translate(matrix, rotationPosition.x, rotationPosition.y, 0);
            matrix = M4.translate(matrix, rotationPosition.x/width, rotationPosition.y/height, 0);
            matrix = M4.axisRotate(matrix, [0, 0, 1], rotation)
            matrix = M4.scale(matrix, width, height, 1);
            matrix = M4.translate(matrix, -rotationPosition.x/width, -rotationPosition.y/height, 0);
        } else {
            // scale and position matrix
            matrix = M4.translate(matrix, x, y, 0);
            matrix = M4.scale(matrix, width, height, 1);
        }

        // set matrix and render
        this.ctx.uniformMatrix4fv(this.matrixLocation, false, matrix);
        this.ctx.uniform1i(this.textureLocation, 0);
        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);

        this.ctx.deleteTexture(tex)
    }
}

class WebGLUtils{
    static get _vertexShader(){
        return `
            attribute vec4 a_position;
            attribute vec2 a_texcoord;
            
            uniform mat4 u_matrix;
            
            varying vec2 v_texcoord;
            
            void main() {
               gl_Position = u_matrix * a_position;
               v_texcoord = a_texcoord;
            }
        `
    }

    static get _fragmentShader(){
        return `
            precision mediump float;

            varying vec2 v_texcoord;
            
            uniform sampler2D u_texture;
            
            void main() {
               gl_FragColor = texture2D(u_texture, v_texcoord);
            }
        `
    }

    static get _fragmentShaderLighning(){
        return `
            precision mediump float;

            varying vec2 v_texcoord;
            
            vec4 c;
            
            uniform sampler2D u_texture;
            
            void main() {
               c = texture2D(u_texture, v_texcoord);
               gl_FragColor = vec4(0, 0, 0, (0.299*(c.r) + 0.587*(c.g) + 0.114*(c.b)));
            }
        `
    }

    /**
     * Creates the shader programs by compiling the vertex and the fragment shader
     * @param ctx
     */
    static createProgram({ctx}){
        let shaders = [
            WebGLUtils._compileShader({ctx:ctx, type:"VERTEX_SHADER", source:WebGLUtils._vertexShader}),
            WebGLUtils._compileShader({ctx:ctx, type:"FRAGMENT_SHADER", source:WebGLUtils._fragmentShader})
        ]
        return WebGLUtils._linkProgram({ctx: ctx, shaders: shaders})
    }

    /**
     * Creates the shader programs by compiling the vertex and the fragment shader
     * @param ctx
     */
    static createProgramLightning({ctx}){
        let shaders = [
            WebGLUtils._compileShader({ctx:ctx, type:"VERTEX_SHADER", source:WebGLUtils._vertexShader}),
            WebGLUtils._compileShader({ctx:ctx, type:"FRAGMENT_SHADER", source:WebGLUtils._fragmentShaderLighning})
        ]
        return WebGLUtils._linkProgram({ctx: ctx, shaders: shaders})
    }

    /**
     * Takes WebGL compiled shaders and links them to a program
     * @param ctx
     * @param shaders
     * @returns {null|*|WebGLProgram}
     * @private
     */
    static _linkProgram({ctx, shaders}){
        let program = ctx.createProgram()
        shaders.forEach(function(shader){
            ctx.attachShader(program, shader)
        })
        ctx.linkProgram(program)

        let linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
        if(!linked){
            console.warn("fox: webgl: program could not be linked.", program, ctx.getProgramInfoLog(program))
            ctx.deleteProgram(program)
            return null
        }

        return program
    }

    /**
     * Compiles a shader (fragment or vertex) in a given webgl context
     * @param ctx
     * @param type
     * @param source
     * @returns {WebGLShader|null}
     */
    static _compileShader({ctx, type, source}){
        let shader = ctx.createShader(ctx[type])
        ctx.shaderSource(shader, source)
        ctx.compileShader(shader)

        let compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)
        if(!compiled){
            console.warn("fox: webgl: shader could not be compiled.", shader, ctx.getShaderInfoLog(shader))
            ctx.deleteShader(shader)
            return null
        }

        return shader
    }
}