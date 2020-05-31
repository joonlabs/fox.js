import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*3, height: 180*3})
document.body.appendChild(app.view)

FOX.AssetManager.addTexture({name:"rocket", asset:new FOX.Assets.Texture({src: "js/test/_resources/rocket.png"})})
FOX.AssetManager.addTexture({name:"triangle", asset:new FOX.Assets.Texture({src: "js/test/_resources/triangle_small.png"})})
FOX.AssetManager.onResourcesLoaded({callback:init})

function init(){
    let scene = new FOX.Scene()
    let camera = new FOX.Camera({
        x:0,
        y:0,
        viewport: {
            x:0,
            y:0,
            width: 320*3,
            height: 180*3
        }
    })
    let layer = new FOX.Layers.Canvas({
        width: 320*3, 
        height: 180*3
    })

    scene.addLayer({layer: layer})
    app.addCamera({camera: camera})
    app.addScene({scene: scene})
    
    let background = new FOX.GameObjects.Rectangle({width: 320*3, height: 180*3, color: new FOX.Color({r: 25, g: 25, b: 25}), layer:layer})
    scene.objectmanager.addObject({object: background})
    
    let bordertop = new FOX.GameObjects.Rectangle({y: 0, width: 320*3, height: 20, color: new FOX.Color({r: 255, g: 0, b: 255}), layer:layer})
    bordertop.addComponent({component: new FOX.Colliders.RectangleCollider({x:0, y:0, width: 320*3, height: 20, debug:{hitbox:false}})})
    scene.objectmanager.addObject({object: bordertop})
    
    let borderbottom = new FOX.GameObjects.Rectangle({width: 320*3, height: 20, y: (180*3)-20, color: new FOX.Color({r: 0, g: 255, b: 255}), layer:layer})
    borderbottom.addComponent({component: new FOX.Colliders.RectangleCollider({x:0, y:0, width: 320*3, height: 20, debug:{hitbox:false}})})
    scene.objectmanager.addObject({object: borderbottom})
    
    class RocketMove extends FOX.Component{
        onInit({timestep, object}={}){
            object.components[0].velocity = new FOX.Vectors.Vec2D({x:0, y:0})
            object.components[0].acceleration = new FOX.Vectors.Vec2D({x: 0, y: .25*3})
        }
        
        onCalc({timestep, object}={}){
            if(FOX.Input.isKeyDown({key: FOX.Input.keys.Space}) || FOX.Input.getTouches().length>0){
                object.components[0].velocity.y = -3*3
            }
            
            let c = object.components[0].getCorners()
            
            if(cornerInObst({c: c.upperLeft, o: t1u})) dead()
            if(cornerInObst({c: c.lowerLeft, o: t1u})) dead()
            
            if(cornerInObst({c: c.upperLeft, o: t2u})) dead()
            if(cornerInObst({c: c.lowerLeft, o: t2u})) dead()
            
            if(cornerInObst({c: c.upperLeft, o: t3u})) dead()
            if(cornerInObst({c: c.lowerLeft, o: t3u})) dead()
            
            if(cornerInObstBottom({c: c.upperRight, o: t1d})) dead()
            if(cornerInObstBottom({c: c.lowerRight, o: t1d})) dead()
            
            if(cornerInObstBottom({c: c.upperRight, o: t2d})) dead()
            if(cornerInObstBottom({c: c.lowerRight, o: t2d})) dead()
            
            if(cornerInObstBottom({c: c.upperRight, o: t3d})) dead()
            if(cornerInObstBottom({c: c.lowerRight, o: t3d})) dead()
            
            function cornerInObst({c, o}){
                if(c.y <= o.position.y + 450){
                    let a = o.position.x,
                        b = o.position.y,
                        d = o.position.y+450,
                        w = 400,
                        x = c.x,
                        y = c.y

                    if(x > a+50 + ((y-b)/(d-b))*(w/2) && x < a+50+w/2 + (w/2) - ((y-b)/(d-b))*(w/2)) return true
                    return false
                }
            }
            
            function cornerInObstBottom({c, o}){
                if(c.y >= o.position.y+50){
                    let a = o.position.x,
                        b = o.position.y,
                        d = o.position.y+450,
                        w = 400,
                        x = c.x,
                        y = c.y

                    if(x > a+70 - ((y-d)/(d-b))*(w/2) && x < a+430 - ((y-d)/(b-d))*(w/2)) return true
                    return false
                }
            }
            
            function dead(){
                window.location.reload()
            }
            
            //object.components[0].rotation += .01* ((object.components[0].velocity.y>0) ? 1 : -1)
            //object.components[0].rotation = Math.PI*.5 + (object.components[0].position.y - (180*3)/2) / 500
            object.components[0].velocity = object.components[0].velocity.add({vector: object.components[0].acceleration})
//            object.components[0].position = object.components[0].position.add({vector: object.components[0].velocity})
            
            if(!(FOX.CollisionManager.colliding({obj1:object.components[0], obj2:bordertop.components[0]}) && object.components[0].velocity.y<0) && !(FOX.CollisionManager.colliding({obj1:object.components[0], obj2:borderbottom.components[0]}) && object.components[0].velocity.y>0)){
                object.components[0].position = object.components[0].position.add({vector: object.components[0].velocity})
//                object.components[0].position.x = FOX.Input.cursor.x
//                object.components[0].position.y = FOX.Input.cursor.y
            }else{
                dead()
                object.components[0].velocity = new FOX.Vectors.Vec2D
            }
        }
    }

    let rocket = new FOX.GameObjects.Sprite({
        x: 300, 
        y:180*1.35, 
        width: 16*2*3, 
        height: 16*2*3, 
        layer:layer,
        texture: FOX.AssetManager.getTexture({name: "rocket"}),
        z: 2
    })
    rocket.addComponent({component: new FOX.Colliders.RectangleCollider({width:13*3,height:20*3,offset:{x:25,y:6*3},rotationPosition:{x:8*3,y:4*3},rotation:Math.PI*.5,debug:{hitbox:false}})})
    rocket.addComponent({component: new RocketMove})
    scene.objectmanager.addObject({object: rocket})
    
    class alphaBlending extends FOX.Component{
        constructor({rotation}={}){
            super()
            this.rotDir = (rotation) ? (FOX.Random.range({min:0, max:1})>.5 ? 1 : -1) : 0
        }
        onCalc({timestep, object}={}, _this=this){
            //console.log(_this.rotDir, Math.PI/60, timestep)
            //object.renderObject.color.a = (1 - object.lifetime/120)**4
            //object.renderObject.rotation += _this.rotDir * Math.PI/60 * timestep
        }
    }
    
    let rocketfuel = new FOX.ParticleSystem({distribution:function({particle}={}, _this=this){
        particle.position.x = rocket.position.x - 10
        particle.position.y = rocket.position.y + 20
        particle.velocity.x = FOX.Random.range({min: -10, max: -12.5})
        particle.velocity.y = FOX.Random.range({min: -1.5, max: 1.5})
        particle.acceleration.y = FOX.Random.range({min: 0, max: 0})
        if(particle.components.length==0) particle.addComponent({component: new alphaBlending({rotation:true})})
        let color_ = new FOX.Color({r: FOX.Random.rangeInt({min: 200, max: 255}), g: FOX.Random.rangeInt({min: 0, max: 130})})
        particle.renderObject = new FOX.GameObjects.Rectangle({x:this.position.x, y:this.position.y, width:10, height:10, color: color_, layer:this.layer, debug:{hitbox:false}})
    }, settings:{maxParticles: 500, particleLifespan: 60, spawnRate: 250}, layer:layer, z:0})
    scene.objectmanager.addObject({object:rocketfuel})
    
    rocketfuel.play()
    
    /*
    * Obstacles
    */
    class ObstacleMove extends FOX.Component{
        onCalc({timestep, object}={}){
            let speed = (new FOX.Vectors.Vec2D({x:-1})).multS({scalar: 8})
            object.position = object.position.add({vector: speed})
            
            if(object.position.x<-500){
                object.position.x = app.project.width
                
                
                if(object.upper){
                    let r = FOX.Random.rangeInt({min: 140,max:460})
                    object.position.y = r
                    object.upper.position.y = -230 + (r - 360)
                }
            }
        }    
    }
    
    class Tinting extends FOX.Shaders.CPU{
        onInit({data}={}){
            this.repaint = true
            this.hue = 0
            this.intensity = 1
        }
        
        shouldRepaint(){
            return true  
        }
        
        hslToRgb(h, s, l){
            var r, g, b;

            if(s == 0){
                r = g = b = l; // achromatic
            }else{
                var hue2rgb = function hue2rgb(p, q, t){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        
        onCalc({data, width, height}={}){
            this.hue = (this.hue + .005)%1
            let rgb = this.hslToRgb(this.hue, this.intensity, .6)
            borderbottom.color.r = rgb[0]
            borderbottom.color.g = rgb[1]
            borderbottom.color.b = rgb[2]
            bordertop.color.r = rgb[0]
            bordertop.color.g = rgb[1]
            bordertop.color.b = rgb[2]
            for(let i=0; i<data.length; i+=4){
                data[i] = rgb[0];
                data[i+1] = rgb[1];
                data[i+2] = rgb[2];
            }
            this.repaint = false
        }
    } 
    
    let t1u = new FOX.GameObjects.Sprite({
        x: 500, 
        y:-230, 
        width: 500, 
        height: 500, 
        layer:layer,
        rotation: Math.PI,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t1u.addShader({shader: new Tinting})
    t1u.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t1u})
    
    let t1d = new FOX.GameObjects.Sprite({
        x: 500, 
        y:330, 
        width: 500, 
        height: 500, 
        layer:layer,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t1d.upper = t1u
    t1d.addShader({shader: new Tinting})
    t1d.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t1d})
    
    let t2u = new FOX.GameObjects.Sprite({
        x: 1000, 
        y:-230, 
        width: 500, 
        height: 500, 
        layer:layer,
        rotation: Math.PI,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t2u.addShader({shader: new Tinting})
    t2u.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t2u})
    
    let t2d = new FOX.GameObjects.Sprite({
        x: 1000, 
        y:330, 
        width: 500, 
        height: 500, 
        layer:layer,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t2d.upper = t2u
    t2d.addShader({shader: new Tinting})
    t2d.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t2d})
    
    let t3u = new FOX.GameObjects.Sprite({
        x: 1500, 
        y:-230, 
        width: 500, 
        height: 500, 
        layer:layer,
        rotation: Math.PI,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t3u.addShader({shader: new Tinting})
    t3u.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t3u})
    
    let t3d = new FOX.GameObjects.Sprite({
        x: 1500, 
        y:330, 
        width: 500, 
        height: 500, 
        layer:layer,
        texture: FOX.AssetManager.getTexture({name: "triangle"}),
        z: 1
    })
    t3d.upper = t3u
    t3d.addShader({shader: new Tinting})
    t3d.addComponent({component: new ObstacleMove})
    scene.objectmanager.addObject({object: t3d})

    window.app = app
    
    if(false){
        let dir = 1
        setInterval(function(){
            if(camera.settings.zoom<.025) dir = 1
            if(camera.settings.zoom>2) dir = -1
            camera.settings.zoom += (1/dir)*0.001
        })
    }
}