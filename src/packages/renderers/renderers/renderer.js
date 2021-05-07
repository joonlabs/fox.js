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
        this.canvas = undefined
        this.ctx = undefined
        this.initialized = false
    }

    getCanvas() {
        return this.canvas
    }

    init() {
        this.initialized = true
    }

    destroy() {
        this.ctx = null
        this.canvas = null
        this.initialized = false
    }

    isInitialized() {
        return this.initialized
    }

    /**
     * @param {number} width Width of the framebuffer
     * @param {number} height Height of the framebuffer
     * @return {AbstractFramebuffer}
     */
    createFramebuffer({width, height}) {
        // to be implemented by child class
    }

    /**
     * @returns {AbstractFramebuffer}
     */
    getMainFramebuffer() {

    }
}