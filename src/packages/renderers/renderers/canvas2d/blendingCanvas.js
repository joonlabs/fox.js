import {Canvas} from "./canvas.js"

export class BlendingCanvas extends Canvas {
    constructor(params) {
        super(params);
    }

    clear({clearColor} = {}) {
        this.ctx.globalCompositeOperation = "copy"
        super.clear({clearColor})
    }

    blendTexture({base, texture}) {
        this.ctx.globalCompositeOperation = "copy"
        super.renderTexture({
            texture: base,
            x: 0,
            y: 0
        })
        this.ctx.globalCompositeOperation = "multiply"
        super.renderTexture({
            texture,
            x: 0,
            y: 0
        })
    }

    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        throw "fox: webgl: renderTexture shouldn't be used directly when using a blending buffer. Use blendTexture instead"
    }

    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        throw "fox: webgl: renderRectangle is unimplemented for a blending buffer"
    }
}