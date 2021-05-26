import {GameObject} from '../gameobject.js'
import {Vec2D} from "../../vectors/vectors/vec2d.js";
import {Color} from "../../color/color.js";

export let TextureSizeMode = {
    STRETCH : "STRETCH",
    COVER : "COVER",
    CONTAIN : "CONTAIN"
}

export let TexturePositionMode = {
    TOP_LEFT : "TOP_LEFT",
    TOP_CENTER: "TOP_CENTER",
    TOP_RIGHT: "TOP_RIGHT",
    CENTER_LEFT: "CENTER_LEFT",
    CENTER : "CENTER",
    CENTER_RIGHT: "CENTER_RIGHT",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_CENTER : "BOTTOM_CENTER",
    BOTTOM_RIGHT: "BOTTOM_RIGHT",
}


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
     * @param {TextureSizeMode} textureSizeMode Size mode of the texture
     * @param {TexturePositionMode} texturePositionMode Position mode of the texture
     * @param {number} z Depth information for sorting in layer
     * @returns CircleCollider
     */
    constructor({x, y, width, height, rotation, rotationPosition, tag, texture, textureSizeMode, texturePositionMode, z} = {}) {
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
        this.texturePosition = new Vec2D()
        this.textureDimensions = new Vec2D()

        this.textureSizeMode = textureSizeMode || TextureSizeMode.STRETCH
        this.texturePositionMode = texturePositionMode || TexturePositionMode.CENTER

        this._calcTextureVectors()
    }

    /**
     * Is called after every time the game updated.
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        this.onBeforeRender({offset: offset, framebuffer: framebuffer})

        // render texture
        if (this.texture && this.texture.loaded) {
            framebuffer.renderTexture({
                texture: this.texture,
                x: this.position.x + offset.x + this.texturePosition.x + this.texture.getOffset().x,
                y: this.position.y + offset.y + this.texturePosition.y + this.texture.getOffset().y,
                width: this.textureDimensions.width,
                height: this.textureDimensions.height,
                rotation: this.rotation,
                rotationPosition: this.rotationPosition,
            })
        }

        this.onAfterRender({offset: offset, framebuffer: framebuffer})
    }

    /**
     * Changes the current textures and applies the change
     * @param texture Texture to be displayed
     */
    setTexture({texture}) {
        this.texture = texture
    }

    /**
     * Updates the width and re-calculates the resulting texture dimensions
     * @param {number} width New width of the sprite
     */
    setWidth({width}) {
        this.dimensions.width = width
        this._calcTextureVectors()
    }

    /**
     * Updates the height and re-calculates the resulting texture dimensions
     * @param {number} height New height of the sprite
     */
    setHeight({height}) {
        this.dimensions.height = height
        this._calcTextureVectors()
    }

    /**
     * Updates the dimensions and re-calculates the resulting texture dimensions
     * @param {number} width New width of the sprite
     * @param {number} height New height of the sprite
     */
    setDimensions({width, height}) {
        this.dimensions.width = width
        this.dimensions.height = height
        this._calcTextureVectors()
    }

    _calcTextureVectors() {
        // set texture dimensions
        if(this.textureSizeMode === TextureSizeMode.STRETCH){
            this.textureDimensions.width = this.dimensions.width
            this.textureDimensions.height = this.dimensions.height
        }else if(this.textureSizeMode === TextureSizeMode.CONTAIN){
            let textureRatio = this.texture.dimensions.height / this.texture.dimensions.width,
                spriteRatio = this.dimensions.height / this.dimensions.width

            let finalWidth = undefined,
                finalHeight = undefined

            if(spriteRatio < textureRatio){
                finalHeight = this.dimensions.height
                finalWidth = finalHeight / textureRatio
            }else{
                finalWidth = this.dimensions.width
                finalHeight = finalWidth * textureRatio
            }
            this.textureDimensions.width = finalWidth
            this.textureDimensions.height = finalHeight
        }else if(this.textureSizeMode === TextureSizeMode.COVER){
            let textureRatio = this.texture.dimensions.height / this.texture.dimensions.width,
                spriteRatio = this.dimensions.height / this.dimensions.width

            let finalWidth = undefined,
                finalHeight = undefined

            if(spriteRatio > textureRatio){
                finalHeight = this.dimensions.height
                finalWidth = finalHeight / textureRatio
            }else{
                finalWidth = this.dimensions.width
                finalHeight = finalWidth * textureRatio
            }
            this.textureDimensions.width = finalWidth
            this.textureDimensions.height = finalHeight
        }

        // set texture position
        if(this.texturePositionMode === TexturePositionMode.TOP_LEFT
            || this.texturePositionMode === TexturePositionMode.TOP_CENTER
            || this.texturePositionMode === TexturePositionMode.TOP_RIGHT){
            this.texturePosition.y = 0
        }
        if(this.texturePositionMode === TexturePositionMode.CENTER_LEFT
            || this.texturePositionMode === TexturePositionMode.CENTER
            || this.texturePositionMode === TexturePositionMode.CENTER_RIGHT){
            this.texturePosition.y = (this.dimensions.height - this.textureDimensions.height) / 2
        }
        if(this.texturePositionMode === TexturePositionMode.BOTTOM_LEFT
            || this.texturePositionMode === TexturePositionMode.BOTTOM_CENTER
            || this.texturePositionMode === TexturePositionMode.BOTTOM_RIGHT){
            this.texturePosition.y = this.dimensions.height - this.textureDimensions.height
        }

        if(this.texturePositionMode === TexturePositionMode.TOP_LEFT
            || this.texturePositionMode === TexturePositionMode.CENTER_LEFT
            || this.texturePositionMode === TexturePositionMode.BOTTOM_LEFT){
            this.texturePosition.x = 0
        }
        if(this.texturePositionMode === TexturePositionMode.TOP_CENTER
            || this.texturePositionMode === TexturePositionMode.CENTER
            || this.texturePositionMode === TexturePositionMode.BOTTOM_CENTER){
            this.texturePosition.x = (this.dimensions.width - this.textureDimensions.width) / 2
        }
        if(this.texturePositionMode === TexturePositionMode.TOP_RIGHT
            || this.texturePositionMode === TexturePositionMode.CENTER_RIGHT
            || this.texturePositionMode === TexturePositionMode.BOTTOM_RIGHT){
            this.texturePosition.x = this.dimensions.width - this.textureDimensions.width
        }
    }
}