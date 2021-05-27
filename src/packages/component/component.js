/**
 * The Component represents a fragment that can be added to game objects for manipulating certain behaviours
 *
 * @class Component
 */
export class Component {
    constructor({} = {}) {
    }

    /**
     * Is called when the component is intatiated.
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @return {void}
     */
    onInit({object} = {}) {
    }

    /**
     * Is called every time when the game object is calculated.
     * @param {number} timestep
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @return {void}
     */
    onCalc({timestep, object} = {}) {
    }

    /**
     * Is called every time before the game object is rendered.
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     * @return {void}
     */
    onBeforeRender({object, offset, framebuffer} = {}) {
    }

    /**
     * Is called every time after the game object is rendered.
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     * @return {void}
     */
    onAfterRender({object, offset, framebuffer} = {}) {
    }

    /**
     * Is called when the component is destroyed.
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @return {void}
     */
    onDestroy({object} = {}) {
    }
}