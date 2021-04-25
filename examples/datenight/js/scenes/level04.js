import fox from "../../../../src/index.js";
import {Player} from "../objects/player.js";
import {Platform} from "../objects/platform.js";

let scene = new fox.Scene()

scene.onInit({
    callback: function(){
        let camera = new fox.Camera({
            viewport: {
                width: 360,
                height: 260
            },
        })

        let layer = new fox.Layers.Canvas({
            width: 360,
            height: 260,
            renderer: new fox.Renderers.WebGL(),
        })
        let lightning = new fox.Layers.Lightning({
            width: 360,
            height: 360,
            globalLight: 0.5
        })

        scene.addLayer({layer: layer})
        scene.addLayer({layer: lightning})
        scene.addCamera({camera: camera})

        // create background
        let background = new fox.GameObjects.Sprite({
            x: 0,
            y: 0,
            width: 360,
            height: 260,
            layer: layer,
            texture: fox.AssetManager.getTexture({name: "background"})
        })
        layer.addObject({name: "background", object: background})

        // create players
        let playerOne = new Player({
            x: 132+20,
            y: 220-16,
            texture: "Blue",
            layer: layer,
            lightningLayer: lightning,
            scene: scene,
            movement: {
                keyLeft: "ArrowLeft",
                keyRight: "ArrowRight",
                keyUp: "ArrowUp"
            }
        })

        let playerTwo = new Player({
            x: 132+50,
            y: 220-16,
            texture: "Pink",
            layer: layer,
            lightningLayer: lightning,
            scene: scene,
            movement: {
                keyLeft: "a",
                keyRight: "d",
                keyUp: "w"
            }
        })

        // create platforms
        let platforms = [
            {type: Platform.types.WOODEN_BIG, coordinates: [132, 220]},
            {type: Platform.types.VERTICAL, coordinates: [105, 120]},
            {type: Platform.types.VERTICAL, coordinates: [225, 120]},
            {type: Platform.types.DEFAULT, coordinates: [50, 175]},
            {type: Platform.types.DEFAULT, coordinates: [248, 175]},
            {type: Platform.types.DEFAULT, coordinates: [10, 127]},
            {type: Platform.types.DEFAULT, coordinates: [288, 127]},
            {type: Platform.types.DEFAULT, coordinates: [50, 80]},
            {type: Platform.types.DEFAULT, coordinates: [248, 80]},
            {type: Platform.types.GOAL, coordinates: [138, 45]},
        ]
        let counter = 0
        for (let platform of platforms) {
            let createdPlatform = new Platform({
                x: platform.coordinates[0],
                y: platform.coordinates[1],
                type: platform.type,
                layer: layer,
                lightningLayer: lightning,
            })
            scene.storeItem({
                name: "platform" + counter.toString(),
                item: createdPlatform
            })
            counter++
        }
    }
})

export {scene as level04}