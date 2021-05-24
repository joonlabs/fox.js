/**
 * The ObjectManager is responsible for holding all objects (for resource management) of a scene
 *
 * @class ObjectManager
 */
export class ObjectManager {
    /**
     * Construct method of the object
     * @returns ObjectManager
     */
    constructor() {
        this.objects = new Map()
        this.biggestZ = undefined;
    }


    /**
     * Removes all objects
     */
    destroy() {
        this.objects.clear()
    }

    /**
     * Adds an object to the objectmanager's object list
     * @param {string} name Name of the object
     * @param {object} object Object to be added
     * @return {void}
     */
    addObject({name, object} = {}) {
        this.objects.set(name, object)
        if (this.biggestZ > object.z) {
            this.reorderObjects()
        } else {
            this.biggestZ = object.z
        }
    }

    /**
     * Returns an object by it's name
     * @param {string} name Name of the objects
     * @returns {any}
     */
    getObject({name}) {
        return this.objects.get(name)
    }

    /**
     * Removes a given object from the objectmanager's object list
     * @param {string} name Name of the object to be removed
     * @return {void}
     */
    removeObject({name}) {
        this.objects.delete(name)
    }

    /**
     * Reorders the objects based on their z index
     * @return {void}
     */
    reorderObjects() {
        this.objects = new Map([...this.objects].sort(function (a, b) {
            return a[1].z - b[1].z
        }))
    }

    /**
     * Calls the calc method of all of it's objects
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep} = {}) {
        this.objects.forEach(obj => obj.calc({timestep: timestep}))
    }

    /**
     * Returns all objects
     * @returns {*|{}}
     */
    getObjects() {
        return this.objects
    }
}