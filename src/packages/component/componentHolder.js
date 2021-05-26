export class ComponentHolder{
    components;

    constructor() {
        this.components = new Map()
    }

    /**
     * Adds a component to the ComponentHolder
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {string} name Name of the component
     * @param {object} component Component that should be added
     * @return {void}
     */
    addComponent({object, name, component} = {}) {
        // default the name if not set to componentX
        name = name || "component" + Object.keys(this.components).length.toString()

        this.components.set(name, component)

        if (typeof component.onInit === "function") {
            component.onInit({object: object})
        }
    }

    /**
     * Removes a component from the ComponentHolder
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {string} name Name of the component to be removed
     * @return {void}
     */
    removeComponent({object, name} = {}) {
        if (typeof this.components.get(name).onDestroy === "function") {
            this.components.get(name).onDestroy({object: object})
        }
        this.components.delete(name)
    }

    /**
     * Returns a component by it's name
     * @param {string} name Name of the component
     * @returns {*}
     */
    getComponent({name}) {
        return this.components.get(name)
    }

    /**
     * Calls the component's onCalc method for each component held
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     */
    onCalc({object, timestep}){
        this.components.forEach((component) => {
            if (typeof component.onCalc === "function") {
                component.onCalc({object, timestep})
            }
        })
    }

    /**
     * Calls the component's onBeforeRender method for each component held
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    onBeforeRender({object, offset, framebuffer}){
        this.components.forEach((component) => {
            if (typeof component.onBeforeRender === "function") {
                component.onBeforeRender({object, offset, framebuffer})
            }
        })
    }

    /**
     * Calls the component's onAfterRender method for each component held
     * @param {GameObject|Camera} object GameObject or Camera that uses the component
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    onAfterRender({object, offset, framebuffer}){
        this.components.forEach((component) => {
            if (typeof component.onAfterRender === "function") {
                component.onAfterRender({object, offset, framebuffer})
            }
        })
    }
}