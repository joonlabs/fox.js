/**
 * Represents the blueprint for all asset based objects, like images, audios, animations... 
 * @class Asset
 */
export class Asset{
    /**
    * Constructs the Asset Object 

    * @return Asset
    */
    constructor(){
        this.loaded = false
    }
    
    
    /**
    * Returns the raw data of the object
    * @return {object}
    */
    getData(_this=this){
        
    }
}