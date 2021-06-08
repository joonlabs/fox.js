import {Canvas} from "./canvas.js"

export class BlendingCanvas extends Canvas {
    constructor(params) {
        super(params);
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
        throw "fox: canvas2d: renderTexture shouldn't be used directly when using a blending canvas. Use blendTexture instead"
    }

    fillRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        throw "fox: canvas2d: renderRectangle is unimplemented for a blending canvas"
    }
}