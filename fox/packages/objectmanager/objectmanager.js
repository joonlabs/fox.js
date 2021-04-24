/**
 * The ObjectManager is responsible for holding all objects (for resource management) of a scene
 *
 * @class ObjectManager
 */
export class ObjectManager{
    /**
     * Construct method of the object
     * @returns ObjectManager
     */
    constructor(){
        this.objects = {}
    }
    
    /**
     * Adds an object to the objectmanager's object list
     * @param {string} name Name of the object
     * @param {object} object Object to be added
     * @return {void}
     */
    addObject({name, object}={}){
        this.objects[name] = object
    }

    /**
     * Returns an object by it's name
     * @param {string} name Name of the objects
     * @returns {any}
     */
    getObject({name}){
        return this.objects[name]
    }
    
    /**
     * Removes a given object from the objectmanager's object list
     * @param {string} name Name of the object to be removed
     * @return {void}
     */
    removeObject({name}){
        delete this.objects[name]
    }
    
    /**
     * Reorders the objects based on their z index 
     * @return {void}
     */
    reorderObjects(){
        let orderedObjects = Object.values(this.objects)
        orderedObjects.sort((function(a, b) {
          if (a.z < b.z) return -1;
          if (a.z > b.z) return 1;
          return this.indexOf(a) - this.indexOf(b);
        }).bind(orderedObjects))
        return orderedObjects
    }
    
    /**
     * Calls the calc method of all of it's objects
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}={}){
        for(let obj of this.getObjects()){
            obj.calc({timestep: timestep})
        }
    }

    getObjects(){
        return this.reorderObjects()
    }
}