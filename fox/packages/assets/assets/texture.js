import {Asset} from './asset.js'
import {Vectors} from '../../vectors/index.js'
import {Random} from "../../random/index.js";

/**
 * Represents a texture incl. loading
 * @class Texture
 */
export class Texture extends Asset {
    /**
     * Constructs the AssetTexture Object
     * @param {string} src URL of the src to be loaded
     * @param {Vec2D} offset
     * @param {int} width
     * @param {int} height
     * @return Texture
     */
    constructor({src, offset, width, height}) {
        super()

        let _this = this
        this.data = undefined
        this.id = Random.ID()

        this.width = width
        this.height = height
        this.offset = offset || new Vectors.Vec2D()
        this.dimensions = new Vectors.Vec2D()

        this.loaded = false

        this.rendering = {
            canvas: document.createElement("canvas"),
            ctx: undefined,
            data: undefined
        }

        this.rendererData = {
            texture : undefined
        }

        if (src !== undefined) {
            let img = document.createElement("img")
            img.src = src
            img.onload = function () {
                _this.rendering.canvas = document.createElement("canvas")
                _this.rendering.ctx = _this.rendering.canvas.getContext("2d")
                if (_this.width === undefined) _this.width = img.width
                if (_this.height === undefined) _this.height = img.height
                _this.rendering.canvas.width = img.width
                _this.rendering.canvas.height = img.height
                _this.rendering.ctx.drawImage(img, 0, 0)
                _this.rendering.data = _this.rendering.ctx.getImageData(0, 0, img.width, img.height)
                _this.loaded = true
                _this.dimensions = new Vectors.Vec2D({x: img.width, y: img.height})
            }
            img.onerror = function () {
                console.error("fox: asset: texture: failed to load resource '" + src + "'")
            }
        }
    }

    static fromCanvas({canvas, ctx}){
        let instance = new Texture({src: undefined, width: canvas.width, height: canvas.height})
        instance.rendering.canvas = canvas
        instance.rendering.ctx = ctx || canvas.getContext("2d")
        instance.rendering.data = instance.rendering.ctx.getImageData(0, 0, instance.width, instance.height)
        instance.loaded = true
        instance.dimensions = new Vectors.Vec2D({x: instance.width, y: instance.height})
        return instance
    }

    /**
     * Returns the id of the texture
     * @returns {string}
     */
    getId(){
        return this.id
    }

    /**
     * Returns the raw texture (e.g. for rendering purposes)
     * @return {object}
     */
    getTexture(_this = this) {
        return _this.rendering.canvas
    }

    /**
     * Returns the raw texture pixel data
     * @return {object}
     */
    getData(_this = this) {
        return _this.rendering.data
    }

    /**
     * Returns the width of the texture
     * @return {object}
     */
    getWidth(_this = this) {
        return _this.width;
    }

    /**
     * Returns the height of the texture
     * @return {object}
     */
    getHeight(_this = this) {
        return _this.height;
    }

    /**
     * Returns the height of the texture
     * @return {object}
     */
    getOffset(_this = this) {
        return _this.offset;
    }
}