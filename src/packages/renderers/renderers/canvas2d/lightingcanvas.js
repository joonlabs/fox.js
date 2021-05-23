import {Canvas} from "./canvas.js"

export class LightingCanvas extends Canvas {

    constructor(params) {
        super(params);
        this.ctx.globalCompositeOperation = "lighter"
    }

}