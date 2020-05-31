import {GameObject} from '../../gameobject.js'

export class PointLight extends GameObject{
    constructor({x, y, width, height, layer, tag, radius, fallout, intensity, hue}={}){
        super({x:x, y:y, width:width, height:height, layer:layer, tag:tag})
        
        this.radius = radius==undefined ? 100 : Math.max(1,radius)
        this.fallout = fallout==undefined ? 0 : Math.max(0, (fallout>=radius)?radius-1:fallout)
        this.intensity = intensity==undefined ? 1 : intensity
        this.hue = hue==undefined ? {r:255,g:255,b:255} : hue
        
        this.followingGameObject = undefined
    }
    
    followObject({object}={}, _this=this){
        _this.followingObject = object
    }
    
    unfollowObject(_this=this){
        _this.followingObject = undefined
    }
    
    calc(_this=this){
        
    }
    
    render({x, y, width, height, zoom, camera, renderer}={}, _this=this){
        //generates a kind of normal map, where white means transparent and all colors are flipped
        //_this.layer.ctx.globalCompositeOperation = "source-atop";
        
        
        //get rendering offset by camera focus position
        let render_offset = {
            "x" : 0,
            "y" : 0,
        }
        
        if(_this.followingObject!=undefined){
            render_offset.x += (_this.followingObject.position.x  + _this.followingObject.dimensions.width/2 - _this.position.x)*zoom
            render_offset.y += (_this.followingObject.position.y + _this.followingObject.dimensions.height/2 - _this.position.y)*zoom
        }
        
//        let gradient = _this.layer.ctx.createRadialGradient(parseInt(render_offset.x + x), parseInt(render_offset.y + y), parseInt(_this.fallout*zoom), parseInt(render_offset.x + x), parseInt(render_offset.y + y), parseInt(_this.radius*zoom));
//        //gradient.addColorStop(0, "rgba("+(255-_this.hue.r*this.intensity)+","+(255-_this.hue.g*this.intensity)+","+(255-_this.hue.b*this.intensity)+","+1+")");
//        gradient.addColorStop(0, "rgba("+(255-255*this.intensity)+","+(255-255*this.intensity)+","+(255-255*this.intensity)+", 1)");
//        gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
//        _this.layer.ctx.fillStyle = gradient;
//        _this.layer.ctx.fillRect(0, 0, _this.layer.dimensions.width, _this.layer.dimensions.height);
        
        let gradient = _this.layer.ctx.createRadialGradient(parseInt(render_offset.x + x), parseInt(render_offset.y + y), parseInt(_this.fallout*zoom), parseInt(render_offset.x + x), parseInt(render_offset.y + y), parseInt(_this.radius*zoom));
        //gradient.addColorStop(0, "rgba("+(255-_this.hue.r*this.intensity)+","+(255-_this.hue.g*this.intensity)+","+(255-_this.hue.b*this.intensity)+","+1+")");
        gradient.addColorStop(0, "rgba(255, 255, 255, "+this.intensity+")");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        _this.layer.ctx.fillStyle = gradient;
        _this.layer.ctx.beginPath()
        _this.layer.ctx.arc(parseInt(render_offset.x + x), parseInt(render_offset.y + y), parseInt(_this.radius*zoom), 0, Math.PI*2)
        _this.layer.ctx.fill();
        
        //_this.layer.ctx.globalCompositeOperation = "source-over";
    }
}