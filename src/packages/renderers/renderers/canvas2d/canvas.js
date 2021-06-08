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

        let compOperation = this.ctx.globalCompositeOperation
        this.ctx.globalCompositeOperation = "copy"
        this.ctx.fillStyle = clearColor.toString()
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.globalCompositeOperation = compOperation
    }

    _pushRotation({x, y, rotation, rotationPosition}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x + rotationPosition.x, y + rotationPosition.y)
            this.ctx.rotate(rotation)
            this.ctx.translate(- x - rotationPosition.x, -y - rotationPosition.y)
        }
    }

    _popRotation({rotation}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
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

        this._pushRotation({x, y, rotation, rotationPosition})

        if (width && height) {
            if(textureData!==undefined) {
                this.ctx.drawImage(textureData, x, y, width, height)
            }
        } else {
            if(textureData!==undefined) {
                this.ctx.drawImage(textureData, x, y)
            }
        }

        this._popRotation({rotation})
    }

    fillRectangle({x, y, width, height, rotation, rotationPosition, color}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        this._pushRotation({x, y, rotation, rotationPosition})

        this.ctx.fillStyle = color.toString()
        this.ctx.fillRect(x, y, width, height)

        this._popRotation({rotation})
    }


    fillCircle({x, y, radius, rotation, rotationPosition, color}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        this._pushRotation({x, y, rotation, rotationPosition})

        this.ctx.fillStyle = color.toString()
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.arc(x, y, radius, 0, Math.PI * 2)
        this.ctx.closePath()
        this.ctx.fill()

        this._popRotation({rotation})
    }

    strokeRectangle({x, y, width, height, rotation, rotationPosition, color, borderWidth}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        this._pushRotation({x, y, rotation, rotationPosition})

        this.ctx.beginPath()
        this.ctx.strokeStyle = color.toString()
        this.ctx.lineWidth = borderWidth
        this.ctx.rect(x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth)
        this.ctx.stroke()

        this._popRotation({rotation})
    }

    strokeCircle({x, y, radius, rotation, rotationPosition, color, borderWidth}) {
        rotation = rotation === undefined ? 0 : rotation
        rotationPosition = rotationPosition === undefined ? {x:0, y:0} : rotationPosition

        this._pushRotation({x, y, rotation, rotationPosition})

        this.ctx.beginPath()
        this.ctx.strokeStyle = color.toString()
        this.ctx.lineWidth = borderWidth
        this.ctx.arc(x, y, radius - borderWidth / 2, 0, Math.PI * 2)
        this.ctx.closePath()
        this.ctx.stroke()

        this._popRotation({rotation})
    }
}