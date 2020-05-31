import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*3, height: 180*3})
window.app = app
document.body.appendChild(app.view)

FOX.AssetManager.onResourcesLoaded({callback:init})

function init(){        
    /*
    * INITIATION
    */
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
    /*
    * TESTING
    */
    
    class alphaBlending extends FOX.Component{
        constructor({rotation}={}){
            super()
            this.rotDir = (rotation) ? (FOX.Random.range({min:0, max:1})>.5 ? 1 : -1) : 0
        }
        onCalc({timestep, object}={}, _this=this){
            //console.log(_this.rotDir, Math.PI/60, timestep)
            object.renderObject.color.a = (1 - object.lifetime/120)**4
            object.renderObject.rotation += _this.rotDir * Math.PI/60 * timestep
        }
    }
    
    // rain style particle system
    let fac = 1
    window.rainSystem = new FOX.ParticleSystem({initiation: function({particle}={}, _this=this){
        particle.addComponent({component: new alphaBlending()})
        particle.renderObject.dimensions.width = 2
    }, distribution:function({particle}={}, _this=this){
        particle.position.x = FOX.Random.rangeInt({min: 0, max: app.project.width})
        particle.position.y = -10
//        particle.velocity.y = Random.range({min: 0.1*fac, max: .75*fac})
        particle.velocity.y = .2
//        particle.acceleration.y = Random.range({min: .05*fac, max: .25*fac})
        particle.acceleration.y = FOX.Random.range({min: .05*fac, max: .25*fac})
    }, settings:{maxParticles: 500, particleLifespan: 60, spawnRate: 250}, layer:layer})
    scene.objectmanager.addObject({object:window.rainSystem})

    
    // rocket style particle system
    window.rocketSystem = new FOX.ParticleSystem({distribution:function({particle}={}, _this=this){
        if(FOX.Input.getTouches().length>0){
            particle.position.x  = FOX.Input.getTouches()[0].position.x
            particle.position.y  = FOX.Input.getTouches()[0].position.y
            lastTouchPos = FOX.Input.getTouches()[0]
        }else if(FOX.lastTouchPos!=undefined){
            particle.position.x  = lastTouchPos.position.x
            particle.position.y  = lastTouchPos.position.y
        }else{
            particle.position.x = FOX.Input.cursor.x
            particle.position.y = FOX.Input.cursor.y
        }
        particle.velocity.x = FOX.Random.range({min: -1.5, max: 1.5})
        particle.velocity.y = FOX.Random.range({min: 2.5, max: 2.75})
        particle.acceleration.y = FOX.Random.range({min: 0, max: 0})
        if(particle.components.length==0) particle.addComponent({component: new alphaBlending({rotation:true})})
        let color_ = new FOX.Color({r: FOX.Random.rangeInt({min: 200, max: 255}), g: FOX.Random.rangeInt({min: 0, max: 130})})
        particle.renderObject = new FOX.GameObjects.Rectangle({x:this.position.x, y:this.position.y, width:FOX.Random.rangeInt({min: 5, max:10}), height:FOX.Random.rangeInt({min: 7, max:12}), color: color_, layer:this.layer})
    }, settings:{maxParticles: 500, particleLifespan: 60, spawnRate: 250}, layer:layer})
    scene.objectmanager.addObject({object:window.rocketSystem})
    
    
    // enable / disable particle systems
    window.rainSystem.play()
    window.rocketSystem.play()
}