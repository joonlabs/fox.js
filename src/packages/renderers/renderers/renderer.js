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
     * @typedef {Object} CameraTransform
     * @property {Vec2D} position The camera position
     * @property {Vec2D} scale The stretching/zoom that should be applied
     * @property {number} rotation The rotation of the camera
     */

    /**
     * Sets a camera transform that is applied to every render call
     * @param {CameraTransform} transform
     */
    setCameraTransform({position, scale, rotation}) {
        // to be implemented by child class
    }

    /**
     * Returns the current camera transform
     * @return CameraTransform
     */
    getCameraTransform() {
        // to be implemented by child class
    }
}