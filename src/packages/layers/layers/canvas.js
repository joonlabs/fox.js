import {Layer} from './layer.js'

/**
 * The LayerCanvas represents the default drawing layer for sprites and default game objects
 *
 * @class LayerCanvas
 */
export class Canvas extends Layer {
    /**
     * Construct method of the object
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @returns LayerCanvas
     */
    constructor({width, height} = {}) {
        super({
            width: width,
            height: height
        })
    }
}