import {Canvas} from "./canvas.js"

export class LightingCanvas extends Canvas {
    constructor(params) {
        super(params);

        this.ctx.globalCompositeOperation = "destination-out";
    }


    clear({clearColor} = {}) {
        this.ctx.globalCompositeOperation = "copy";
        super.clear({clearColor});
        this.ctx.globalCompositeOperation = "destination-out";
    }
}