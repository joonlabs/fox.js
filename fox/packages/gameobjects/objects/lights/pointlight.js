import {GameObject} from '../../gameobject.js'
import {Color} from "../../../color/index.js";
import {Texture} from "../../../assets/assets/index.js";

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
        this.hue =  hue || new Color()

        this.followingGameObject = undefined

        this.computeLightMap()
    }

    followObject({object} = {}) {
        this.followingObject = object
    }

    unfollowObject() {
        this.followingObject = undefined
    }

    computeLightMap(){
        let canvas = document.createElement("canvas")
        canvas.width = this.dimensions.width
        canvas.height = this.dimensions.height

        let ctx = canvas.getContext("2d")

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, this.radius*2, this.radius*2)

        let gradient = ctx.createRadialGradient(this.radius, this.radius, this.innerRadius, this.radius, this.radius, this.radius);

        gradient.addColorStop(0, "rgba(255, 255, 255, "+this.intensity+")");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath()
        ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI*2)
        ctx.fill();

        this.lightMapTexture = Texture.fromCanvas({canvas: canvas, ctx: ctx})
    }

    /**
     * Renders the PointLight with the renderer
     * @param x X Position of the PointLight
     * @param y Y Position of the PointLight
     * @param renderer
     */
    render({x, y, renderer} = {}) {
        let render_offset = {
            "x" : x,
            "y" : y,
        }

        if(this.followingObject!==undefined){
            render_offset.x += (this.followingObject.position.x  + this.followingObject.dimensions.width/2 - this.position.x)
            render_offset.y += (this.followingObject.position.y + this.followingObject.dimensions.height/2 - this.position.y)
        }

        renderer.renderTexture({
            texture : this.lightMapTexture,
            x : render_offset.x - this.radius,
            y: render_offset.y - this.radius,
            width: this.dimensions.width,
            height: this.dimensions.height,
            rotation: 0
        })
    }
}