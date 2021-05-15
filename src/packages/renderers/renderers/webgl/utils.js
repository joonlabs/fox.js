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
            
            void main() {
               gl_Position = u_matrix * a_position;
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

    static get _fragmentShaderSolid() {
        return `
            precision mediump float;

            uniform vec4 u_color;

            void main() {
                gl_FragColor = u_color;
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

    /**
     * Creates a framebuffer matrix
     * @param width The width of the framebuffer
     * @param height The height of the framebuffer
     * @param flipY If the framebuffer should be flipped along the y axis
     * @returns {Matrix4}
     */
    static createFramebufferMatrix({width, height, flipY}) {
        let matrix = M4.identity()
        if (flipY) {
            M4.scale(matrix, 1, -1, 1, matrix)
        }
        M4.translate(matrix, -1, -1, 0, matrix)
        M4.scale(matrix, 2 / width, 2 / height, 1, matrix)

        return matrix
    }

    /**
     * Creates an object matrix
     * @param x The x position of the object
     * @param y The y position of the object
     * @param width The width of the object
     * @param height The height of the object
     * @param rotation The object rotation
     * @param rotation.angle The rotation angle in radians
     * @param rotation.x The x rotation center
     * @param rotation.y The y rotation center
     * @returns {Matrix4}
     */
    static createObjectMatrix({x, y, width, height, rotation}) {
        let matrix = M4.identity()
        M4.translate(matrix, x, y, 0, matrix)
        M4.multiply(matrix, this.createRotationMatrix(rotation), matrix)
        M4.scale(matrix, width, height, 1, matrix)

        return matrix
    }

    /**
     * Creates a rotation matrix
     * @param angle The angle in radians
     * @param x The x rotation center
     * @param y The y rotation center
     * @returns {Matrix4}
     */
    static createRotationMatrix({angle, x, y}) {
        let matrix = M4.identity()
        M4.translate(matrix, -x, -y, 0, matrix)
        M4.zRotate(matrix, angle, matrix)
        M4.translate(matrix, x, y, 0, matrix)

        return matrix
    }
}