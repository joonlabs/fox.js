import * as M4 from "../m4.js"

export class Utils {
    static get _vertexShaderTexture() {
        return `
            attribute vec4 a_position;
            attribute vec2 a_texcoord;
            
            uniform mat4 u_matrix;
            uniform mat4 u_textureMatrix;
            
            varying vec2 v_texcoord;
            
            void main() {
               gl_Position = u_matrix * a_position;
               v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
            }
        `
    }

    static get _vertexShaderSolid() {
        return `
            attribute vec4 a_position;
            
            uniform mat4 u_matrix;
            uniform mat4 u_textureMatrix;
            uniform vec4 u_color;
            
            varying vec4 v_color;
            
            void main() {
               gl_Position = u_matrix * a_position;
               v_color = u_color;
            }
        `
    }

    static get _fragmentShaderTexture() {
        return `
            precision mediump float;

            varying vec2 v_texcoord;
            
            uniform sampler2D u_texture;
            
            void main() {
                gl_FragColor = texture2D(u_texture, v_texcoord);
            }
        `
    }

    static get _fragmentShaderLighting() {
        return `
            precision mediump float;

            varying vec2 v_texcoord;

            uniform sampler2D u_texture;

            void main() {
                vec4 c = texture2D(u_texture, v_texcoord);
                float r = 1.0;
                float g = 1.0;
                float b = 0.0;
                float a = (0.299*(c.r) + 0.587*(c.g) + 0.114*(c.b));
                gl_FragColor = vec4(1.0-(1.0-r)*a, 1.0-(1.0-g)*a, 1.0-(1.0-b)*a, a);
            }
        `
    }

    static get _fragmentShaderSolid() {
        return `
            precision mediump float;

            varying vec4 v_color;

            void main() {
                gl_FragColor = v_color;
            }
        `
    }

    /**
     * Takes WebGL compiled shaders and links them to a program
     * @param ctx {WebGLRenderingContext}
     * @param shaders
     * @returns {null|*|WebGLProgram}
     */
    static linkProgram({ctx, shaders}) {
        let program = ctx.createProgram()
        shaders.forEach(function (shader) {
            ctx.attachShader(program, shader)
        })
        ctx.linkProgram(program)

        let linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
        if (!linked) {
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
    static compileShader({ctx, type, source}) {
        let shader = ctx.createShader(ctx[type])
        ctx.shaderSource(shader, source)
        ctx.compileShader(shader)

        let compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)
        if (!compiled) {
            console.warn("fox: webgl: shader could not be compiled.", shader, ctx.getShaderInfoLog(shader))
            ctx.deleteShader(shader)
            return null
        }

        return shader
    }

    static createFramebufferMatrix({width, height, flipY}) {
        let matrix = M4.identity()
        if (flipY) {
            M4.scale(matrix, 1, -1, 1, matrix)
        }
        M4.translate(matrix, -1, -1, 0, matrix)
        M4.scale(matrix, 2 / width, 2 / height, 1, matrix)

        return matrix
    }

    static createObjectMatrix({x, y, width, height, rotation}) {
        let matrix = M4.identity()
        M4.translate(matrix, x, y, 0, matrix)
        M4.multiply(matrix, this.createRotationMatrix(rotation), matrix)
        M4.scale(matrix, width, height, 1, matrix)

        return matrix
    }

    static createRotationMatrix({angle, x, y}) {
        let matrix = M4.identity()
        M4.translate(matrix, -x, -y, 0, matrix)
        M4.zRotate(matrix, angle, matrix)
        M4.translate(matrix, x, y, 0, matrix)

        return matrix
    }
}