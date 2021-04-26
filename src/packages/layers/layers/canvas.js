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
     * @param {Renderer} renderer Renderer to use when rendering this layer (either new WebGL() or new Canvas2D())
     * @returns LayerCanvas
     */
    constructor({width, height, renderer} = {}) {
        super({
            width: width,
            height: height,
            renderer: renderer
        })
    }
}