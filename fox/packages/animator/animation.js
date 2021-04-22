export class Animation {
    /**
     *
     * @param {[object]} frames
     * @param {boolean} loop
     */
    constructor({frames, loop}) {
        this.frames = frames
        this.loop = loop || true

        this.animationLength = 0
        for (let frame of frames) {
            this.animationLength += frame.duration
        }

    }

    getTexture({frame}, _this = this) {
        let frameTime = frame % this.animationLength

        let duration = 0

        for (let frame of this.frames) {
            if (duration + frame.duration >= frameTime) {
                return frame.texture
            }
            duration += frame.duration
        }

        // fallback to first frame
        return this.frames[0].texture
    }
}