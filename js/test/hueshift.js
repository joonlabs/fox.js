import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*3, height: 180*3})
window.app = app
document.body.appendChild(app.view)

FOX.AssetManager.addTexture({name:"test", asset:new FOX.Assets.Texture({src: "/js/test/_resources/triangle_small.png"})})
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
            for(let i=0; i<data.length; i+=4){
                data[i] = rgb[0];
                data[i+1] = rgb[1];
                data[i+2] = rgb[2];
            }
            this.repaint = false
        }
    } 
                     
    for(let i=0; i<10; i++){
        let rx = FOX.Random.rangeInt({min:0, max:320*3}),
            ry = FOX.Random.rangeInt({min:0, max:180*3})
        var sprite = new FOX.GameObjects.Sprite({x:rx,y:ry,width:200,height:200,texture:FOX.AssetManager.getTexture({name:"test"}),layer:layer, z:400})
        sprite.addShader({shader: new Tinting})
        scene.objectmanager.addObject({object:sprite})
    }
    
    
}