import {Asset} from './asset.js'
import {Texture} from './texture.js'
import {Vectors} from '../../vectors/index.js'

/**
 * Represents an texture atlas incl. loading
 * @class Texture
 */
export class TextureAtlas extends Asset {
    /**
     * Constructs the TextureAtlas Object
     * @param {string} src URL of the src to be loaded
     * @param {[object]} mappings List of sub-textures in atlas (e.g. {name, x, y, width, height, offset})
     * @return Texture
     */
    constructor({src, mappings}) {
        super()

        let _this = this

        this.mappings = mappings

        this.dimensions = undefined
        this.textureLoaded = false
        this.onTextureLoadedFn = function () {
        }

        this.rendering = {
            canvas: document.createElement("canvas"),
            ctx: undefined,
            data: undefined
        }

        let img = document.createElement("img")
        img.src = src
        img.onload = function () {
            _this.rendering.canvas = document.createElement("canvas")
            _this.rendering.ctx = _this.rendering.canvas.getContext("2d")
            _this.rendering.canvas.width = img.width
            _this.rendering.canvas.height = img.height
            _this.rendering.ctx.drawImage(img, 0, 0)
            _this.rendering.data = _this.rendering.ctx.getImageData(0, 0, img.width, img.height)
            _this.dimensions = new Vectors.Vec2D({x: img.width, y: img.height})
            _this.textureLoaded = true
            _this.onTextureLoadedFn()
        }
        img.onerror = function () {
            console.error("src: asset: texture: failed to load resource '" + src + "'")
        }
    }

    /**
     * Registers a callback that gets fired after all textures have been loaded
     * @param callback
     * @param _this
     */
    onTextureLoaded({callback}) {
        this.onTextureLoadedFn = callback
        if (this.textureLoaded) {
            this.onTextureLoadedFn()
        }
    }

    /**
     * Returns a list of all textures with it's names
     * @method getAllTextures
     * @return {[object]}
     */
    getAllTextures() {
        let textures = []
        for (let mapping of this.mappings) {
            let tmpCanvas = document.createElement("canvas")
            let tmpCtx = tmpCanvas.getContext("2d")
            let tmpImageData = this.rendering.ctx.getImageData(mapping.x, mapping.y, mapping.width, mapping.height)
            tmpCanvas.width = mapping.width
            tmpCanvas.height = mapping.height
            tmpCtx.putImageData(tmpImageData, 0, 0)

            let texture = new Texture({
                src: tmpCanvas.toDataURL(),
                offset: mapping.offset,
                width: mapping.width,
                height: mapping.height
            })
            textures.push({
                name: mapping["name"],
                texture: texture
            })
        }
        return textures
    }
}