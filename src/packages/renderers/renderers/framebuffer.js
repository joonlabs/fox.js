export class AbstractFramebuffer {

    /**
     * Creates a framebuffer object
     * @param {WebGL | Canvas2D} renderer
     * @param {number} width
     * @param {number} height
     */
    constructor({renderer, width, height}) {
        this.renderer = renderer
        this.width = width
        this.height = height
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
     * @param {number} [width] Width of the texture
     * @param {number} [height] Height of the texture
     * @param {number} [rotation] Rotation of the texture
     * @param {object} [rotationPosition] rotationPosition of the texture
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        // to be implemented by child class
    }

    /**
     * Renders a filled rectangle
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
    fillRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        // to be implemented by child class
    }

    /**
     * Renders a filled circle
     * @method fillCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {Color} color Color of the circle
     * @return {void}
     */
    fillCircle({x, y, radius, rotation, rotationPosition, color}) {
        // to be implemented by child class
    }

    /**
     * Renders the border of a rectangle
     * @method strokeRectangle
     * @param {number} x X position of the rectangle
     * @param {number} y Y position of the rectangle
     * @param {number} width Width of the rectangle
     * @param {number} height Height of the rectangle
     * @param {number} rotation Rotation of the rectangle
     * @param {object} rotationPosition rotationPosition of the rectangle
     * @param {Color} color Color of the rectangle
     * @param {number} borderWidth Width of the border, grows inwards
     * @return {void}
     */
    strokeRectangle({x, y, width, height, rotation, rotationPosition, color, borderWidth}) {
        // to be implemented by child class
    }

    /**
     * Renders the border of a circle
     * @method strokeCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {Color} color Color of the circle
     * @param {number} borderWidth Width of the border, grows inwards
     * @return {void}
     */
    strokeCircle({x, y, radius, rotation, rotationPosition, color, borderWidth}) {
        // to be implemented by child class
    }
}

/**
 * @enum {string}
 */
export const FramebufferType = {
    NORMAL: "normal",
    MULTIPLY_BLENDING: "multiply_blending",
    LIGHTING: "lighting",
}