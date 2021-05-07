import {Utils} from "./utils.js"
import {Utils as WarningUtils} from "../../../utils/index.js"

export class Program {

    /**
     *
     * @param renderer {WebGL}
     * @param vertexShaderSrc {string}
     * @param fragmentShaderSrc {string}
     */
    constructor({renderer, vertexShaderSrc, fragmentShaderSrc}) {
        this.renderer = renderer

        const vertexShader = this._compileShader({type: "VERTEX_SHADER", source: vertexShaderSrc})
        const fragmentShader = this._compileShader({type: "FRAGMENT_SHADER", source: fragmentShaderSrc})

        this.programRef = Utils.linkProgram({ctx: renderer.gl, shaders: [vertexShader, fragmentShader]})

        this.uniforms = new Map()
    }

    destroy() {
        this.renderer.gl.deleteProgram(this.programRef)
    }

    use() {
        this.renderer.gl.useProgram(this.programRef)
    }

    setIntegerUniform({uniform, value, v1, v2, v3}) {
        const gl = this.renderer.gl

        let uniformLoc = this._getUniformLoc(uniform)
        if (uniformLoc === null) return

        if (Array.isArray(value)) {
            if (value.length === 4) {
                gl.uniform4iv(uniformLoc, value)
            } else if (value.length === 3) {
                gl.uniform3iv(uniformLoc, value)
            } else if (value.length === 2) {
                gl.uniform2iv(uniformLoc, value)
            } else if (value.length === 1) {
                gl.uniform1iv(uniformLoc, value)
            } else {
                WarningUtils.error(`fox: webgl: tried to set uniform with invalid array (length = ${value.length})`)
            }
        } else {
            if (v3 !== undefined) {
                gl.uniform4i(uniformLoc, value, v1, v2, v3)
            } else if (v2 !== undefined) {
                gl.uniform3i(uniformLoc, value, v1, v2)
            } else if (v1 !== undefined) {
                gl.uniform2i(uniformLoc, value, v1)
            } else {
                gl.uniform1i(uniformLoc, value)
            }
        }
    }

    /**
     * Sets the uniform to a decimal number
     * @param uniform {string}
     * @param value {number | Float32List}
     * @param {number} [v1]
     * @param {number} [v2]
     * @param {number} [v3]
     */
    setFloatingUniform({uniform, value, v1, v2, v3}) {
        const gl = this.renderer.gl

        let uniformLoc = this._getUniformLoc(uniform)
        if (uniformLoc === null) return

        if (Array.isArray(value) || value instanceof Float32Array) {
            if (value.length === 4) {
                gl.uniform4fv(uniformLoc, value)
            } else if (value.length === 3) {
                gl.uniform3fv(uniformLoc, value)
            } else if (value.length === 2) {
                gl.uniform2fv(uniformLoc, value)
            } else if (value.length === 1) {
                gl.uniform1fv(uniformLoc, value)
            } else {
                WarningUtils.error(`fox: webgl: tried to set uniform with invalid array (length = ${value.length})`)
            }
        } else {
            if (v3 !== undefined) {
                gl.uniform4f(uniformLoc, value, v1, v2, v3)
            } else if (v2 !== undefined) {
                gl.uniform3f(uniformLoc, value, v1, v2)
            } else if (v1 !== undefined) {
                gl.uniform2f(uniformLoc, value, v1)
            } else {
                gl.uniform1f(uniformLoc, value)
            }
        }
    }

    /**
     * Sets a matrix uniform to the specified value
     * @param uniform {string}
     * @param matrix {Float32List}
     */
    setUniformMatrix({uniform, matrix}) {
        const gl = this.renderer.gl

        let uniformLoc = this._getUniformLoc(uniform)
        if (uniformLoc === null) return

        if (matrix.length === 4) {
            gl.uniformMatrix2fv(uniformLoc, false, matrix)
        } else if (matrix.length === 9) {
            gl.uniformMatrix3fv(uniformLoc, false, matrix)
        } else if (matrix.length === 16) {
            gl.uniformMatrix4fv(uniformLoc, false, matrix)
        } else {
            WarningUtils.error(`fox: webgl: tried to set matrix uniform with invalid array (length = ${matrix.length})`)
        }
    }

    _getUniformLoc(uniform) {
        const gl = this.renderer.gl

        if (!this.uniforms.has(uniform)) {
            let uniformLoc = gl.getUniformLocation(this.programRef, uniform)
            if (uniformLoc === null) {
                WarningUtils.error(`fox: webgl: uniform "${uniform}" could not be found`)
                return null
            }
            this.uniforms.set(uniform, uniformLoc)
            return uniformLoc
        } else {
            return this.uniforms.get(uniform)
        }
    }

    _compileShader({type, source}) {
        if (this.renderer.compiledShaders.has(source))
            return this.renderer.compiledShaders.get(source)
        else {
            const shader = Utils.compileShader({ctx: this.renderer.gl, type, source})
            if (shader !== null)
                this.renderer.compiledShaders.set(source, shader)
            return shader
        }
    }
}