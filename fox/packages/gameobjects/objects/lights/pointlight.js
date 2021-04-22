import {GameObject} from '../../gameobject.js'

export class PointLight extends GameObject {
    constructor({x, y, layer, tag, radius, innerRadius, intensity, hue} = {}) {
        super({x: x, y: y, width: radius * 2, height: radius * 2, layer: layer, tag: tag})

        this.radius = radius
        this.innerRadius = innerRadius || 0
        this.intensity = intensity == undefined ? 1 : intensity
        this.hue = hue == undefined ? {r: 255, g: 255, b: 255} : hue

        this.followingGameObject = undefined

        this.computeLightMap()
    }

    followObject({object} = {}, _this = this) {
        this.followingObject = object
    }

    unfollowObject(_this = this) {
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

        this.lightMap = canvas
    }

    calc(_this = this) {

    }

    render({x, y, width, height, zoom, camera, renderer} = {}, _this = this) {
        //get rendering offset by camera focus position
        let render_offset = {
            "x" : 0,
            "y" : 0,
        }

        if(this.followingObject!==undefined){
            render_offset.x += (this.followingObject.position.x  + this.followingObject.dimensions.width/2 - this.position.x)*zoom
            render_offset.y += (this.followingObject.position.y + this.followingObject.dimensions.height/2 - this.position.y)*zoom
        }

        renderer.renderTexture({
            texture : this.lightMap,
            x : render_offset.x - this.radius,
            y: render_offset.y - this.radius,
            width: this.dimensions.width,
            height: this.dimensions.height,
            rotation: 0
        })
    }
}