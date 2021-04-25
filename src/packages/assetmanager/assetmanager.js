/**
 * Represents the AssetManager of the game engine. It is responsible 
 * for holding all necessary assets in a global and static scope.
 * @class AssetManager
 */
export class AssetManager {
    /**
     * Adds an audio element to it's objects
     * @param {string} name Name of the object for later acces
     * @param {object} asset Asset object
     * @returns AssetManager
     */
    static addAudio({name, asset} = {}) {
        AssetManager.objects.audio[name] = asset
    }

    /**
     * Adds a texture element to it's objects
     * @param {string} name Name of the object for later acces
     * @param {object} asset Asset object
     * @returns {void}
     */
    static addTexture({name, asset} = {}) {
        AssetManager.objects.texture[name] = asset
    }

    /**
     * Adds a multiple texture elements to it's objects
     * @param {object} atlas TextureAtlas object
     * @returns {void}
     */
    static addTextureAtlas({atlas} = {}) {
        AssetManager.objects.textureAtlases.push(atlas)
        atlas.onTextureLoaded({
            callback: function () {
                for (let item of atlas.getAllTextures()) {
                    AssetManager.objects.texture[item.name] = item.texture
                }
            }
        })
    }


    /**
     * Returns an texture by it's name
     * @param {string} name Name of the object to be returned
     * @returns {object}
     */
    static getTexture({name} = {}) {
        if(AssetManager.objects.texture[name] !== undefined){
            return AssetManager.objects.texture[name]
        }
        console.warn("src: assetmanager: the texture you are trying to load does not exists: \""+name+"\"")
    }

    /**
     * Returns an audio by it's name
     * @param {string} name Name of the object to be returned
     * @returns {object}
     */
    static getAudio({name} = {}) {
        return AssetManager.objects.audio[name]
    }

    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onTextureLoaded({name, callback} = {}) {
        if (AssetManager.getTexture({name: name})) {
            (function waitForResources() {
                if (AssetManager.getTexture({name: name}).loaded) {
                    callback()
                } else {
                    setTimeout(waitForResources, 30);
                }
            })();
        } else {
            console.warn("src: AssetManager: The texture you're subscribing the loaded event for does not exists")
        }
    }

    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onAudioLoaded({name, callback} = {}) {
        if (AssetManager.getAudio({name: name})) {
            (function waitForResources() {
                if (AssetManager.getAudio({name: name}).loaded) {
                    callback()
                } else {
                    setTimeout(waitForResources, 30);
                }
            })();
        } else {
            console.warn("src: AssetManager: The audio you've subscribed the loaded event for does not exists")
        }
    }

    /**
     * Executes the callback function, as soon the given texture (if it exists) is loaded
     * @param {string} name Name of the object that is going to be checked
     * @param {function} callback Function that is executed as soon as the object is loaded
     */
    static onResourcesLoaded({callback} = {}) {
        (function waitForResources() {
            let loaded = true
            for (let atlas of AssetManager.objects.textureAtlases) if (!atlas.textureLoaded) {
                loaded = false
            }
            for (let texture of Object.values(AssetManager.objects.texture)) if (!texture.loaded) {
                loaded = false
            }
            for (let audio of Object.values(AssetManager.objects.audio)) if (!audio.loaded) {
                loaded = false
            }
            if (loaded) {
                callback()
            } else {
                setTimeout(waitForResources, 30);
            }
        })();
    }

    /**
     * Async method that only returns true when all resources are loaded
     * @returns {object}
     */
    static async allResourcesLoaded() {
        return new Promise(function (resolve, reject) {
            (function waitForResources() {
                let loaded = true
                for (let texture of Object.values(AssetManager.objects.texture)) if (!texture.loaded) {
                    loaded = false
                }
                for (let audio of Object.values(AssetManager.objects.audio)) if (!audio.loaded) {
                    loaded = false
                }
                if (loaded) return resolve();
                setTimeout(waitForResources, 30);
            })();
        });
    }
}

AssetManager.objects = {
    "audio": {},
    "texture": {},
    "textureAtlases": [],
}