import {GameObject} from '../../gameobject.js'
import {Color} from "../../../color/index.js";
import {Texture} from "../../../assets/assets/index.js";
import {Utils} from "../../../utils/index.js"

export class PointLight extends GameObject {
    /**
     * Creates a PointLight object
     * @param x X Position
     * @param y Y Position
     * @param tag Tag of the PointLight
     * @param radius Radius of the PointLight
     * @param innerRadius Inner radius of the PointLight
     * @param intensity Intensity of the PointLight
     * @param hue Hue of the PointLight
     */
    constructor({x, y, tag, radius, innerRadius, intensity, hue} = {}) {
        super({
            x: x,
            y: y,
            width: radius * 2,
            height: radius * 2,
            tag: tag
        })

        this.radius = radius
        this.innerRadius = innerRadius || 0
        this.intensity = intensity || 1
        this.hue =  hue || new Color({
            r: 255,
            g: 255,
            b: 255,
        })
        this.lightColor = new Color({
            r: this.hue.r,
            g: this.hue.g,
            b: this.hue.b,
            a: this.intensity
        })

        this.computeLightMap()
    }

    computeLightMap(){
        let canvas = document.createElement("canvas")
        canvas.width = this.dimensions.width
        canvas.height = this.dimensions.height

        let ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, this.radius*2, this.radius*2)

        let gradient = ctx.createRadialGradient(this.radius, this.radius, this.innerRadius, this.radius, this.radius, this.radius);

        /**
         * fixing color overflow problems facing Safari 14.1 on MacOS and iOS
         */
        this.lightColor.r *= 254/255
        this.lightColor.g *= 254/255
        this.lightColor.b *= 254/255

        let fadeOutColor = this.lightColor.clone()
        fadeOutColor.a = 0

        gradient.addColorStop(0, this.lightColor.toString());
        gradient.addColorStop(1, fadeOutColor.toString());
        ctx.fillStyle = gradient;
        ctx.beginPath()
        ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI*2)
        ctx.fill();

        this.lightMapTexture = Texture.fromCanvas({canvas: canvas, ctx: ctx})
    }

    /**
     * Renders the PointLight with the renderer
     * @param {Vec2D} offset Vector for offsetting the layer's objects
     * @param {AbstractFramebuffer} framebuffer Framebuffer to be rendered to
     */
    render({offset, framebuffer} = {}) {
        framebuffer.renderTexture({
            texture: this.lightMapTexture,
            x: this.position.x + offset.x - this.radius,
            y: this.position.y + offset.y - this.radius,
            width: this.dimensions.width,
            height: this.dimensions.height,
        })
    }
}