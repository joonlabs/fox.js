import {AbstractFramebuffer} from "../framebuffer.js"
import {Color} from "../../../color/color.js"

export class Canvas extends AbstractFramebuffer {
    /**
     * @param {Canvas2D} renderer
     * @param {number} width
     * @param {number} height
     */
    constructor({renderer, width, height}) {
        super({renderer, width, height});

        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")
    }

    clear({clearColor} = {}) {
        clearColor = clearColor || new Color()

        this.ctx.fillStyle = clearColor.toString()
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    renderTexture({texture, x, y, width, height, rotation, rotationPosition}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        let textureData
        if (texture instanceof Canvas) {
            textureData = texture.canvas
        } else {
            textureData = texture.getTexture()
        }

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x + rotationPosition.x, y + rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            this.ctx.rotate(rotation)
        }

        if (width && height) {
            if(textureData!==undefined) {
                this.ctx.drawImage(textureData, x, y, width, height)
            }
        } else {
            if(textureData!==undefined) {
                this.ctx.drawImage(textureData, x, y)
            }
        }

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }

    renderRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x + rotationPosition.x, y + rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            this.ctx.rotate(rotation)
        }

        this.ctx.fillStyle = color.toString()
        this.ctx.fillRect(x, y, width, height)

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }
}