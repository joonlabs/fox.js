/**
 * An Animation holds the textures and the according time information about when the frame should be displayed.
 */
export class Animation {
    /**
     * Creates an Animation object
     * @param {[object]} frames a list of all textures an their duration {duration: 12, texture: ...}
     * @param {boolean} loop
     */
    constructor({frames, loop}) {
        this.frames = frames
        this.loop = loop || true

        this.animationLength = 0
        for (let frame of frames) {
            this.animationLength += frame.duration || 12 // 12 = default frame duration
        }

    }

    /**
     * Returns the texture, based on a given frame
     * @param {number} frame Frame to get the texture for
     * @returns {*}
     */
    getTexture({frame}) {
        if(!this.loop && frame >= this.animationLength){
            // returns the last frame
            return this.frames[this.frames.length-1].texture
        }else{
            // calculate current texture
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
}