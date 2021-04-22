import {GameObject} from '../../gameobject.js'

export class GlobalLight extends GameObject{
    constructor({x, y, layer, tag, intensity, hue}={}){
        super({x, y, width:layer.dimensions.width, height:layer.dimensions.height, layer:layer, tag:tag})
        
        this.intensity = intensity || 1

        this.computeLightMap()
    }

    computeLightMap(){
        let canvas = document.createElement("canvas")
        canvas.width = this.dimensions.width
        canvas.height = this.dimensions.height

        let ctx = canvas.getContext("2d")

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.width)

        ctx.fillStyle = "rgba(255, 255, 255, "+this.intensity+")"
        ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.width)

        this.lightMap = canvas
    }
    
    calc(_this=this){
        
    }
    
    render({x, y, zoom, camera, renderer}={}, _this=this){
        renderer.renderTexture({
            texture : this.lightMap,
            x : this.position.x,
            y: this.position.y,
            width: this.dimensions.width,
            height: this.dimensions.height,
            rotation: 0
        })
    }
}