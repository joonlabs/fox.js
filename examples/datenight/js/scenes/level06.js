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
            x: (30+20) * 3,
            y: (150-16) * 3,
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
            x: (30+50) * 3,
            y: (150-16) * 3,
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
            {type: Platform.types.WOODEN_BIG, coordinates: [30 * 3,150 * 3]},
            {type: Platform.types.TIMING, coordinates: [150 * 3, 115 * 3]},
            {type: Platform.types.GOAL, coordinates: [245 * 3, 80 * 3]},
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

export {scene as level06}