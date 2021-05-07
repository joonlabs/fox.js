export class AbstractFramebuffer {

    /**
     * Creates a framebuffer object
     * @param renderer {Renderer}
     */
    constructor({renderer}) {
        this.renderer = renderer
    }

    /**
     * Clears the framebuffer
     * @param clearColor The color that should be used to clear the framebuffer, defaults to black
     */
    clear({clearColor} = {}) {
        // to be implemented by child class
    }

    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {Texture | AbstractFramebuffer} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} width Width of the texture
     * @param {number} height Height of the texture
     * @param {number} rotation Rotation of the texture
     * @param {object} rotationPosition rotationPosition of the texture
     * @param {boolean} [lighting] If the lighting shader should be used
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition, lighting}) {
        // to be implemented by child class
    }

    /**
     * Renders a texture to the layer
     * @method renderRectangle
     * @param {number} x X position of the rectangle
     * @param {number} y Y position of the rectangle
     * @param {number} width Width of the rectangle
     * @param {number} height Height of the rectangle
     * @param {number} rotation Rotation of the rectangle
     * @param {object} rotationPosition rotationPosition of the rectangle
     * @param {Color} color Color of the rectangle
     * @return {void}
     */
    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        // to be implemented by child class
    }
}