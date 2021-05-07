export class Texture {

    /**
     * @param {WebGL} renderer
     * @param {GLint} level
     * @param {GLenum} format
     * @param {GLsizei} [width]
     * @param {GLsizei} [height]
     * @param {GLenum} type
     * @param {ArrayBufferView | TexImageSource | null} pixels
     * @param {WebGLTexture} [textureRef]
     */
    constructor({renderer, level, format, width, height, type, pixels, textureRef}) {
        this.renderer = renderer
        const gl = renderer.gl

        if (textureRef !== undefined) {
            this.textureRef = textureRef
        } else {
            this.textureRef = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, this.textureRef)

            if (pixels === null || (pixels instanceof ArrayBuffer && ArrayBuffer.isView(pixels))) {
                this.width = width;
                this.height = height;
                gl.texImage2D(gl.TEXTURE_2D, level, format, width, height, 0, format, type, pixels)
            } else {
                this.width = pixels.width
                this.height = pixels.height
                gl.texImage2D(gl.TEXTURE_2D, level, format, format, type, pixels)
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    }

    bind() {
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.textureRef)
    }

    destroy() {
        this.renderer.gl.deleteTexture(this.textureRef)
    }
}