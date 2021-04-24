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
     * @param {object} object
     * @return {void}
     */
    onInit({object} = {}, _this = this) {
    }

    /**
     * Is called every time when the game object is calculated.
     * @param {object} object
     * @return {void}
     */
    onCalc({object} = {}, _this = this) {
    }

    /**
     * Is called every time before the game object is rendered.
     * @param {object} object
     * @return {void}
     */
    onBeforeRender({object} = {}, _this = this) {
    }

    /**
     * Is called every time after the game object is rendered.
     * @param {object} object
     * @return {void}
     */
    onAfterRender({object} = {}, _this = this) {
    }

    /**
     * Is called when the component is destroyed.
     * @param {object} object
     * @return {void}
     */
    onDestroy({object} = {}, _this = this) {
    }
}