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
     * @method constructor
     * @param {number} x X-position of the game object
     * @param {number} y Y-position of the game object
     * @param {number} width Width of the game object
     * @param {number} height Height of the game object
     * @param {number} rotation Rotation of the game object
     * @param {object} rotationPosition Rotation position vector of the Colligame objectder relative to it self
     * @param {object} layer Reference to the object's rendering layer
     * @param {string} tag Tag of the object fro grouping multiple objects logically together
     * @param {number} z Depth information for sorting in layer
     * @param {object} debug Debug options (hitbox)
     * @returns CircleCollider
     */
    constructor({x, y, width, height, rotation, rotationPosition, layer, tag, texture, z, debug} = {}) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: rotation,
            rotationPosition: rotationPosition,
            layer: layer,
            tag: tag,
            z: z,
            debug: debug
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
     * Is called every time the game updates. #TO_BE_OVERRIDEN
     * @method calc
     * @param {number} timestep Normalized DeltaTime to catch up with frame skips
     * @return {void}
     */
    calc({timestep} = {}, _this = this) {
        for (let component of _this.components) {
            if (typeof component.onCalc === "function") component.onCalc({timestep: timestep, object: _this})
        }
    }

    /**
     * Is called after every time the game updated.
     * @method render
     * @param {object} object
     * @return {void}
     */
    render({x, y, width, height, camera, renderer} = {}, _this = this) {
        for (let component of _this.components) {
            if (typeof component.onBeforeRender === "function") component.onBeforeRender({
                x: x,
                y: y,
                width: width,
                height: height,
                camera: camera,
                renderer: renderer,
                object: _this
            })
        }

        if (_this.texture && _this.texture.loaded) {
            renderer.renderTexture({
                texture: _this.rendering.canvas,
                x: x + _this.texture.getOffset().x,
                y: y + _this.texture.getOffset().y,
                width: _this.texture.getWidth(),
                height: _this.texture.getHeight(),
                rotation: _this.rotation,
                rotationPosition: this.rotationPosition,
                ctx: _this.layer.ctx
            })
        }
        if (_this.debug.enabled && _this.debug.hitbox) {
            renderer.strokeRect({
                x: x,
                y: y,
                width: width,
                height: height,
                color: "#de5a1f",
                rotation: _this.rotation,
                rotationPosition: this.rotationPosition,
                lineWidth: 4,
                ctx: _this.layer.ctx
            })
        }

        for (let component of _this.components) {
            if (typeof component.onAfterRender === "function") component.onAfterRender({
                x: x,
                y: y,
                width: width,
                height: height,
                camera: camera,
                renderer: renderer,
                object: _this
            })
        }
    }

    /**
     * Applies the texture from the texture canvas to the game object's canvas
     * @method applyTexture
     * @param {object} shader Shader that should be added
     * @return {void}
     */
    applyTexture(_this = this) {
        if (_this.dimensions.width == undefined) _this.dimensions.width = _this.texture.getTexture().width
        if (_this.dimensions.height == undefined) _this.dimensions.height = _this.texture.getTexture().height
        if (_this.texture) {
            _this.rendering.canvas.width = _this.texture.getTexture().width
            _this.rendering.canvas.height = _this.texture.getTexture().height
            _this.rendering.ctx.drawImage(_this.texture.getTexture(), 0, 0)
            _this.rendering.data = _this.rendering.ctx.getImageData(0, 0, _this.rendering.canvas.width, _this.rendering.canvas.height)
        }
    }
}