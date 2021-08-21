/**
 * The Renderer class provides the blueprint for all renderers (e.g. the basic canvas2d renderer)
 *
 * @class Renderer
 */
export class Renderer {
    /**
     * Construct method of the object
     * @method constructor
     * @returns Renderer
     */
    constructor() {
        this.canvas = null
        this.initialized = false
    }

    /**
     *
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas
    }

    init() {
        this.initialized = true
    }

    destroy() {
        this.initialized = false
    }

    isInitialized() {
        return this.initialized
    }

    /**
     * @param {number} width Width of the framebuffer
     * @param {number} height Height of the framebuffer
     * @param {FramebufferType} [type] The type of framebuffer that should be created
     * @return {AbstractFramebuffer}
     */
    createFramebuffer({width, height, type}) {
        // to be implemented by child class
    }

    /**
     * @returns {AbstractFramebuffer}
     */
    getMainFramebuffer() {

    }

    /**
     * Sets a camera transform that is applied to every render call
     * @param {Vec2D} position
     * @param {Vec2D} scale
     * @param {number} rotation
     */
    setCameraTransform({position, scale, rotation}) {
        // to be implemented by child class
    }
}