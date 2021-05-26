import fox from "../../../../src/index.js";
import {Player} from "../objects/player.js";
import {Platform} from "../objects/platform.js";
import {Utils} from "./utils.js";

let scene = new fox.Scene()

scene.onInit({
    callback: function(){
        let {camera, layer, lighting, background} = Utils.generateCameraLayerLightingBackground()

        scene.addLayer({layer: layer})
        scene.addLayer({layer: lighting})
        scene.addCamera({camera: camera})

        // create players
        let playerOne = new Player({
            x: (132+20) * 3,
            y: (220-16) * 3,
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
            x: (132+50) * 3,
            y: (220-16) * 3,
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
            {type: Platform.types.WOODEN_BIG, coordinates: [132 * 3, 220 * 3]},
            {type: Platform.types.VERTICAL, coordinates: [105 * 3, 120 * 3]},
            {type: Platform.types.VERTICAL, coordinates: [225 * 3, 120 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [50 * 3, 175 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [248 * 3, 175 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [10 * 3, 127 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [288 * 3, 127 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [50 * 3, 80 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [248 * 3, 80 * 3]},
            {type: Platform.types.GOAL, coordinates: [138 * 3, 45 * 3]},
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

export {scene as level04}