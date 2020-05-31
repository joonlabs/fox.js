import {Asset} from './asset.js'
import {Vectors} from '../../vectors/index.js'

/**
 * Represents a texture incl. loading 
 * @class Texture
 */
export class Texture extends Asset{
    /**
    * Constructs the AssetTexture Object 
    * 
    * @method constructor
    * @param {string} src URL of the src to be loaded
    * @param {object} offset Offset vector, relative to it's parent 
    * @param {object} dimensions Dimensions vector with the image's width and height 
    * @return Texture
    */
    constructor({src,offset}){
        super()
        
        let _this = this 
        this.data = undefined
        
        this.offset = offset || new Vectors.Vec2D()
        
        this.dimensions = undefined
        
        this.rendering = {
            canvas : document.createElement("canvas"),
            ctx: undefined,
            data : undefined
        }
        
        let img = document.createElement("img")
        img.src = src
        img.onload = function(){
            _this.rendering.canvas = document.createElement("canvas")
            _this.rendering.ctx = _this.rendering.canvas.getContext("2d")
            _this.rendering.canvas.width = img.width
            _this.rendering.canvas.height = img.height
            _this.rendering.ctx.drawImage(img, 0, 0)
            _this.rendering.data = _this.rendering.ctx.getImageData(0, 0, img.width, img.height)
            _this.loaded = true
            _this.dimensions = new Vectors.Vec2D({x:img.width, y:img.height})
        }
        img.onerror = function(){console.error("fox: asset: texture: failed to load resource '"+src+"'")}
    }
    
    /**
     * Returns the raw texture (e.g. for rendering purposes) 
     * @method getTexture
     * @return {object}
     */        
    getTexture(_this=this){
        return _this.rendering.canvas
    }
    
    /**
     * Returns the raw texture pixel data
     * @method getTexture
     * @return {object}
     */        
    getData(_this=this){
        return _this.rendering.data
    }
}