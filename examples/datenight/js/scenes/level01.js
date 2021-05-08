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
        })
        let lighting = new fox.Layers.Lighting({
            width: 360,
            height: 360,
            globalLight: 0.5
        })

        scene.addLayer({layer: layer})
        scene.addLayer({layer: lighting})
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
            x: 25,
            y: 170 - 16,
            texture: "Blue",
            layer: layer,
            lightingLayer: lighting,
            scene: scene,
            movement: {
                keyLeft: "ArrowLeft",
                keyRight: "ArrowRight",
                keyUp: "ArrowUp"
            }
        })

        let playerTwo = new Player({
            x: 55,
            y: 170 - 16,
            texture: "Pink",
            layer: layer,
            lightingLayer: lighting,
            scene: scene,
            movement: {
                keyLeft: "a",
                keyRight: "d",
                keyUp: "w"
            }
        })

        // create platforms
        let platforms = [
            {type: Platform.types.WOODEN_BIG, coordinates: [5, 220]},
            {type: Platform.types.DEFAULT, coordinates: [90, 190]},
            {type: Platform.types.DEFAULT, coordinates: [160, 190]},
            {type: Platform.types.DEFAULT, coordinates: [110, 130]},
            {type: Platform.types.DEFAULT, coordinates: [220, 130]},
            {type: Platform.types.DEFAULT, coordinates: [25, 85]},
            {type: Platform.types.DEFAULT, coordinates: [280, 75]},
            {type: Platform.types.GOAL, coordinates: [145, 40]},
        ]
        let counter = 0
        for (let platform of platforms) {
            let createdPlatform = new Platform({
                x: platform.coordinates[0],
                y: platform.coordinates[1],
                type: platform.type,
                layer: layer,
                lightingLayer: lighting,
            })
            scene.storeItem({
                name: "platform" + counter.toString(),
                item: createdPlatform
            })
            counter++
        }
    }
})

export {scene as level01}