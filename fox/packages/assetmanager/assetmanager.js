/**
 * Represents the AssetManager of the game engine. It is responsible for holding all necessary assets 
 * @class AssetManager
 */
export class AssetManager{
    /**
     * Adds an audio element to it's objects
     * @method constructor
     * @param {string} name Name of the object for later acces
     * @param {object} asset Asset object
     * @returns AssetManager
     */
    static addAudio({name, asset}={}){
        AssetManager.objects.audio[name] = asset
    }
    
    /**
     * Adds a texture element to it's objects
     * @method addTexture
     * @param {string} name Name of the object for later acces
     * @param {object} asset Asset object
     * @returns {void}
     */
    static addTexture({name, asset}={}){
        AssetManager.objects.texture[name] = asset
    }
    
    
    /**
     * Returns an texture by it's name
     * @method getTexture 
     * @param {string} name Name of the object to be returned
     * @returns {object}
     */
    static getTexture({name}={}){
        return AssetManager.objects.texture[name]
    }
    
    /**
     * Returns an audio by it's name 
     * @method getAudio
     * @param {string} name Name of the object to be returned
     * @returns {object}
     */
    static getAudio({name}={}){
        return AssetManager.objects.audio[name]
    }
    
    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @method onTextureLoaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onTextureLoaded({name, callback}={}){
        if(AssetManager.getTexture({name:name})){
            (function waitForResources(){
                if(AssetManager.getTexture({name:name}).loaded){
                    callback()
                }else{
                    setTimeout(waitForResources, 30);
                }
            })();
        }else{
            console.warn("fox: AssetManager: The texture you're subscribing the loaded event for does not exists")
        }
    }
    
    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @method onTextureLoaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onAudioLoaded({name, callback}={}){
        if(AssetManager.getAudio({name:name})){
            (function waitForResources(){
                if(AssetManager.getAudio({name:name}).loaded){
                        callback()
                }else{
                    setTimeout(waitForResources, 30);
                }
            })();
        }else{
            console.warn("fox: AssetManager: The audio you've subscribed the loaded event for does not exists")
        }
    }
    
    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @method onTextureLoaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onResourcesLoaded({callback}={}){
        (function waitForResources(){let loaded = true
            for(let texture of Object.values(AssetManager.objects.texture)) if(!texture.loaded){loaded = false}
            for(let audio of Object.values(AssetManager.objects.audio)) if(!audio.loaded){loaded = false}
            if (loaded){
                callback()
            }else{
                setTimeout(waitForResources, 30);
            }
        })();
    }
    
    /**
     * Async method that only returns true when all resources are loaded
     * @method allResourcesLoaded
     * @returns {object}
     */
    static async allResourcesLoaded(){
        return new Promise(function (resolve, reject) {
            (function waitForResources(){
                let loaded = true
                for(let texture of Object.values(AssetManager.objects.texture)) if(!texture.loaded){loaded = false}
                for(let audio of Object.values(AssetManager.objects.audio)) if(!audio.loaded){loaded = false}
                if (loaded) return resolve();
                setTimeout(waitForResources, 30);
            })();
        });
    }
}
AssetManager.objects = {
    "audio" : {},
    "texture" : {}
}