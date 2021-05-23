import {Renderer} from './renderer.js'
import {FramebufferType} from "./framebuffer.js"
import {Canvas, BlendingCanvas, LightingCanvas} from "./canvas2d/index.js"


/**
 * The Canvas2D is the basic renderer using the html5 canvas2d api
 *
 * @class Canvas2D
 */
export class Canvas2D extends Renderer {
    init({width, height}) {
        super.init()

        this.canvas = new Canvas({renderer: this, width, height})
    }

    getCanvas() {
        return this.canvas.canvas
    }

    destroy() {
        super.destroy();
    }

    isInitialized() {
        return super.isInitialized();
    }

    createFramebuffer({width, height, type}) {
        switch (type) {
            case FramebufferType.MULTIPLY_BLENDING:
                return new BlendingCanvas({renderer: this, width, height})
            case FramebufferType.LIGHTING:
                return new LightingCanvas({renderer: this, width, height})
            default:
                return new Canvas({renderer: this, width, height})
        }
    }

    getMainFramebuffer() {
        return this.canvas
    }
}