fox = {
    loadEngine : async function({onBeforeLoad, onInit}={}){
        async function loadFile(src){
            return new Promise((resolve, reject) => {
                let img = new Image()
                let pckg = document.createElement('script');
                pckg.src = src;
                document.head.appendChild(pckg);  
                pckg.onload = () => resolve()    
                pckg.onerror = reject
            })
        }

        //load fox internal packages
        document.head.innerHTML += "\n\n<!-- automatically loaded fox packages -->\n"  
        await loadFile("fox/packages/assetmanager/assetmanager.js")
        
        await loadFile("fox/packages/components/component.js")

        await loadFile("fox/packages/renderer/renderer.js")
        await loadFile("fox/packages/renderer/canvas2d.js")

        await loadFile("fox/packages/vector/vector.js")
        await loadFile("fox/packages/vector/vector2d.js")

        await loadFile("fox/packages/collision/collisionmanager.js")
        await loadFile("fox/packages/collision/colliders/collider.js")
        await loadFile("fox/packages/collision/colliders/rectanglecollider.js")
        await loadFile("fox/packages/collision/colliders/circlecollider.js")

        await loadFile("fox/packages/layer/layer.js")
        await loadFile("fox/packages/layer/canvas.js")
        await loadFile("fox/packages/layer/lightning.js")

        await loadFile("fox/packages/collision/collision.js")

        await loadFile("fox/packages/assets/asset.js")
        await loadFile("fox/packages/assets/texture.js")
        await loadFile("fox/packages/assets/audio.js")
        await loadFile("fox/packages/assets/animation.js")


        await loadFile("fox/packages/camera/camera.js")

        await loadFile("fox/packages/random/random.js")

        await loadFile("fox/packages/color/color.js")

        await loadFile("fox/packages/gameobject/gameobject.js")
        await loadFile("fox/packages/gameobject/lights/pointlight.js")
        await loadFile("fox/packages/gameobject/lights/globallight.js")
        await loadFile("fox/packages/gameobject/sprites/sprite.js")
        await loadFile("fox/packages/gameobject/objects/rectangle.js")
        await loadFile("fox/packages/gameobject/objects/circle.js")

        await loadFile("fox/packages/particlesystem/particlesystem.js")
        await loadFile("fox/packages/particlesystem/particle.js")

        await loadFile("fox/packages/audiocontroller/audiocontroller.js")

        await loadFile("fox/packages/inputcontroller/inputcontroller.js")
        await loadFile("fox/packages/inputcontroller/touch.js")

        await loadFile("fox/packages/objectmanager/objectmanager.js")

        await loadFile("fox/packages/scene/scene.js")
        
        await loadFile("fox/packages/shader/shaderCPU.js")
        
        // load external performace testing tool
        // TODO: write own performance tool
        await loadFile("http://mrdoob.github.io/stats.js/build/stats.min.js")

        await loadFile("fox/fox.js")
        fox = new Fox()
         
        //load game content
        if(typeof onBeforeLoad == "function"){
            onBeforeLoad()
        }
        
        //wait for resources to be loaded
        await AssetManager.allResourcesLoaded()
        
        //init game
        onInit();
    }
}