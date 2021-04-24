import {Renderer} from './renderer.js'


/**
 * The Canvas2D is the basic renderer using the html5 canvas2d api
 *
 * @class Canvas2D
 */
export class Canvas2D extends Renderer {
    /**
     * Construct method of the object
     * @method constructor
     * @returns Canvas2D
     */
    constructor({} = {}) {
        super({})
    }

    init({width, height}) {
        super.init()

        //physical objects for rendering purposes
        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false

        // pixelating settings
        this.ctx.imageSmoothingEnabled = false
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")
    }

    getCanvas(){
        return this.canvas
    }

    /**
     * Clears the canvas buffer
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * Fills a rect on the canvas
     * @method fillRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillRect({x, y, width, height, rotation, rotationPosition, color}) {
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

    /**
     * Strokes a rect on the canvas
     * @method strokeRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {number} lineWidth Line width of the rect's stroke
     * @param {object} color Color of the rect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeRect({x, y, width, height, rotation, rotationPosition, lineWidth, color}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x + rotationPosition.x, y + rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            this.ctx.rotate(rotation)
        }

        this.ctx.beginPath()
        this.ctx.strokeStyle = color.toString()
        this.ctx.lineWidth = lineWidth
        this.ctx.rect(parseInt(x + lineWidth / 2), parseInt(y + lineWidth / 2), parseInt(width - lineWidth), parseInt(height - lineWidth))
        this.ctx.stroke()

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }

    /**
     * Fills a cirlce on the canvas
     * @method fillCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's fill
     * @param {number} angleEnd Ending Angle of the circle's fill
     * @param {object} color Color of the cirlce
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, color}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x, y)
            x = +rotationPosition.x - radius
            y = +rotationPosition.y - radius
            this.ctx.rotate(rotation)
        }

        this.ctx.fillStyle = color.toString()
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.arc(x, y, radius, angleStart, angleEnd)
        this.ctx.closePath()
        this.ctx.fill()


        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }


    /**
     * Strokes a cirlce on the canvas
     * @method strokeCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's stroke
     * @param {number} angleEnd Ending Angle of the circle's stroke
     * @param {number} lineWidth lineWidth of the circle's stroke
     * @param {object} color Color of the cirlce' stroke
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, lineWidth, color}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x, y)
            x = +rotationPosition.x - radius
            y = +rotationPosition.y - radius
            this.ctx.rotate(rotation)
        }

        this.ctx.beginPath()
        this.ctx.strokeStyle = color.toString()
        this.ctx.lineWidth = lineWidth
        this.ctx.moveTo(x, y)
        this.ctx.arc(x, y, parseInt(radius - lineWidth / 2), angleStart, angleEnd)
        this.ctx.closePath()
        this.ctx.stroke()

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }


    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {object} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} width Width of the texture
     * @param {number} height Height of the texture
     * @param {number} rotation Rotation of the texture
     * @param {object} rotationPosition rotationPosition of the texture
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition, srcX, srcY}) {
        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.save()
            this.ctx.translate(x + rotationPosition.x, y + rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            this.ctx.rotate(rotation)
        }

        //console.log({texture, x, y, width, height, rotation, rotationPosition})

        if(srcX!=undefined && srcY!=undefined && width!=undefined && height!=undefined){
            this.ctx.drawImage(texture, srcX, srcY, width, height, x, y, width, height)
        }else if (width && height) {
            this.ctx.drawImage(texture, x, y, width, height)
        } else {
            this.ctx.drawImage(texture, x, y)
        }

        if (rotation % (Math.PI * 2) !== 0) {
            this.ctx.restore()
        }
    }
}