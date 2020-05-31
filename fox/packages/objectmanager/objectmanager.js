/**
 * The ObjectManager is responsible for holding all objects (for resource management) of a scene
 *
 * @class ObjectManager
 */
export class ObjectManager{
    /**
     * Construct method of the object
     * @method constructor
     * @returns ObjectManager
     */
    constructor(){
        this.objects = []
    }
    
    /**
     * Adds an object to the objectmanager's object list
     * @method addObject
     * @param {object} object Object to be added
     * @return {void}
     */
    addObject({object}={}, _this=this){
        _this.objects.push(object)
    }
    
    /**
     * Removes a given object from the objectmanager's object list
     * @method removeObject
     * @param {object} object Object to be removed
     * @return {void}
     */
    removeObject({object}, _this=this){
        let idx = _this.objects.indexOf(object)
        if(idx!=-1)  _this.objects.splice(idx, 1)
    }
    
    /**
     * Reorders the objects based on their z index 
     * @method reorderObjects
     * @return {void}
     */
    reorderObjects(_this=this){
        _this.objects.sort((function(a, b) {
          if (a.z < b.z) return -1;
          if (a.z > b.z) return 1;
          return this.indexOf(a) - this.indexOf(b);
        }).bind(_this.objects)) 
    }
    
    /**
     * Calls the calc method of all of it's objects
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep}={}, _this=this){        
        _this.reorderObjects()
        for(let obj of _this.objects){
            obj.calc({timestep: timestep})
        }
    }
}