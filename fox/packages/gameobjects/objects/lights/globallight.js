import {GameObject} from '../../gameobject.js'

export class GlobalLight extends GameObject{
    constructor({x, y, width, height, layer, tag, intensity, hue}={}){
        super({x:(x==undefined?0:x), y:(y==undefined?0:y), width:width, height:height, layer:layer, tag:tag})
        
        this.intensity = intensity==undefined ? 1 : intensity
        this.hue = hue==undefined ? {r:255,g:255,b:255} : hue
        
        this.isLightLayer = true
    }
    
    calc(_this=this){
        
    }
    
    render({x, y, zoom, camera}={}, _this=this){
        _this.layer.ctx.fillStyle = "rgba(255,255,255,"+this.intensity+")"
        _this.layer.ctx.fillRect(camera.coordinates.x, camera.coordinates.y, camera.viewport.width, camera.viewport.height)
    }
}