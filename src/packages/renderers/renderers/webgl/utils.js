import * as M4 from "../m4.js"

export class WebGLUtils {
    static get vertexShaderTexture() {
        return `
            attribute vec2 a_position;
            attribute vec2 a_texcoord;
            
            uniform mat4 u_framebufferMatrix;
            uniform mat4 u_cameraMatrix;
            uniform mat4 u_objectMatrix;
            
            uniform mat4 u_textureMatrix;
            
            varying vec2 v_texcoord;
            
            void main() {
                gl_Position = u_framebufferMatrix * u_cameraMatrix * u_objectMatrix * vec4(a_position, 0, 1);
                v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
            }
        `
    }

    static get vertexShaderSolid() {
        return `
            attribute vec2 a_position;
            
            uniform mat4 u_framebufferMatrix;
            uniform mat4 u_cameraMatrix;
            uniform mat4 u_objectMatrix;
            
            uniform mat4 u_textureMatrix;
            
            varying vec2 v_position;
            
            void main() {
                v_position = (a_position - vec2(0.5)) * 2.0; // The coordinate system now goes from -1 to 1 instead of 0 to 1
                gl_Position = u_framebufferMatrix * u_cameraMatrix * u_objectMatrix * vec4(a_position, 0, 1);
            }
        `
    }

    static get vertexShaderBlending() {
        return `
            attribute vec2 a_position;
            attribute vec2 a_texcoord;
            
            uniform mat4 u_framebufferMatrix;
            uniform mat4 u_cameraMatrix;
            uniform mat4 u_objectMatrix;
            
            uniform mat4 u_textureMatrix;
            uniform mat4 u_baseMatrix;
            
            varying vec2 v_texcoord;
            varying vec2 v_basecoord;
            
            void main() {
                gl_Position = u_framebufferMatrix * u_cameraMatrix * u_objectMatrix * vec4(a_position, 0, 1);
                v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
                v_basecoord = (u_baseMatrix * vec4(a_texcoord, 0, 1)).xy;
            }
        `
    }

    static get fragmentShaderTexture() {
        return `
            precision mediump float;

            varying vec2 v_texcoord;
            
            uniform sampler2D u_texture;
            
            void main() {
                gl_FragColor = texture2D(u_texture, v_texcoord);
            }
        `
    }

    static get fragmentShaderRectangle() {
        return `
            precision mediump float;

            varying vec2 v_position;

            uniform vec4 u_color;
            uniform vec2 u_borderWidth;

            void main() {
                vec2 border = step(1.0 - u_borderWidth * 2.0, abs(v_position));

                gl_FragColor = u_color * max(border.y, border.x);
            }
        `
    }

    static get fragmentShaderCircle() {
        return `
            precision mediump float;

            varying vec2 v_position;

            uniform vec4 u_color;
            uniform float u_borderWidth;
            uniform float u_smoothing;

            void main() {
                float radius = dot(v_position, v_position);

                gl_FragColor = u_color * smoothstep(1.0, 1.0 - u_smoothing, radius) * smoothstep(1.0 - u_borderWidth - u_smoothing, 1.0 - u_borderWidth, radius);
            }
        `
    }

    static get fragmentShaderMultiplyBlend() {
        return `
            precision mediump float;

            varying vec2 v_texcoord;
            varying vec2 v_basecoord;
            
            uniform sampler2D u_base;
            uniform sampler2D u_texture;
            
            void main() {
                vec4 baseColor = texture2D(u_base, v_basecoord);
                vec4 textureColor = texture2D(u_texture, v_texcoord);
            
                gl_FragColor = baseColor * textureColor;
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
    static createCameraMatrix({x, y, width, height, rotation}) {
        let matrix = M4.identity()
        M4.translate(matrix, x, y, 0, matrix)
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
        M4.translate(matrix, x, y, 0, matrix)
        M4.zRotate(matrix, angle, matrix)
        M4.translate(matrix, -x, -y, 0, matrix)

        return matrix
    }
}