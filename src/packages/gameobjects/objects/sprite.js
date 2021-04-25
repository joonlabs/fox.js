import {GameObject} from '../gameobject.js'
import {Vectors} from '../../vectors/index.js'
import {Color} from '../../color/index.js'

/**
 * The Sprite represents the basic 2d sprite, that is responsible for rendering images to the screen
 *
 * @class Sprite
 */
export class Sprite extends GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the game object
     * @param {number} y Y-position of the game object
     * @param {number} width Width of the game object
     * @param {number} height Height of the game object
     * @param {number} rotation Rotation of the game object
     * @param {object} rotationPosition Rotation position vector of the Colligame objectder relative to it self
     * @param {string} tag Tag of the object for grouping multiple objects logically together
     * @param {Texture} texture Texture of the object
     * @param {number} z Depth information for sorting in layer
     * @returns CircleCollider
     */
    constructor({x, y, width, height, rotation, rotationPosition, tag, texture, z} = {}) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: rotation,
            rotationPosition: rotationPosition,
            tag: tag,
            z: z,
        })

        this.texture = texture

        this.rendering = {
            canvas: document.createElement("canvas"),
            ctx: undefined,
            data: undefined
        }
        this.rendering.ctx = this.rendering.canvas.getContext("2d")
        this.applyTexture()
    }

    /**
     * Is called after every time the game updated.
     * @param {number} x X Coordinate
     * @param {number} y Y Coordinate
     * @param {number} renderer Renderer to be used
     */
    render({x, y, renderer} = {}) {
        this.onBeforeRender({renderer: renderer})

        // render texture
        if (this.texture && this.texture.loaded) {
            renderer.renderTexture({
                texture: this.texture,
                x: x + this.texture.getOffset().x,
                y: y + this.texture.getOffset().y,
                width: this.texture.getWidth(),
                height: this.texture.getHeight(),
                rotation: this.rotation,
                rotationPosition: this.rotationPosition,
                ctx: this.layer.ctx
            })
        }

        this.onAfterRender({renderer: renderer})
    }

    /**
     * Applies the texture from the texture canvas to the game object's canvas
     */
    applyTexture() {
        if (this.dimensions.width === undefined) this.dimensions.width = this.texture.getTexture().width
        if (this.dimensions.height === undefined) this.dimensions.height = this.texture.getTexture().height
        if (this.texture) {
            this.rendering.canvas.width = this.texture.getTexture().width
            this.rendering.canvas.height = this.texture.getTexture().height
            this.rendering.ctx.drawImage(this.texture.getTexture(), 0, 0)
            //this.rendering.data = this.rendering.ctx.getImageData(0, 0, this.rendering.canvas.width, this.rendering.canvas.height)
        }
    }

    /**
     * Changes the current textures and applies the change
     * @param texture Texture to be displayed
     */
    setTexture({texture}){
        this.texture = texture
        this.applyTexture()
    }
}