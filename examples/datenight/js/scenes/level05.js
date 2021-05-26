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
            x: (80+35) * 3,
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
            x: (180+35) * 3,
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
            {type: Platform.types.WOODEN_BIG, coordinates: [80 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [180 * 3, 220 * 3]},
            {type: Platform.types.VERTICAL, coordinates: [161 * 3, 130 * 3]},
            {type: Platform.types.VERTICAL, coordinates: [61 * 3, 130 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [10 * 3, 165 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [270 * 3, 165 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [45 * 3, 110 * 3]},
            {type: Platform.types.DEFAULT, coordinates: [220 * 3, 110 * 3]},
            {type: Platform.types.GOAL, coordinates: [138 * 3, 80 * 3]},
            {type: Platform.types.VERTICAL, coordinates: [105 * 3, 5 * 3]},
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

export {scene as level05}