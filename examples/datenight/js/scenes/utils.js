import fox from "../../../../src/index.js";
import {TexturePositionMode, TextureSizeMode} from "../../../../src/packages/gameobjects/objects/sprite.js";

export class Utils{
    static generateCameraLayerLightingBackground() {
        let camera = new fox.Camera({
            viewport: {
                width: 360 * 3,
                height: 260 * 3
            },
        })

        let layer = new fox.Layers.Canvas({
            width: 360 * 3,
            height: 260 * 3,
        })
        let lighting = new fox.Layers.Lighting({
            width: 360 * 3,
            height: 260 * 3,
            globalLight: 0.5
        })

        // create background
        let background = new fox.GameObjects.Sprite({
            x: 0,
            y: 0,
            width: 360 * 3,
            height: 260 * 3,
            layer: layer,
            texture: fox.AssetManager.getTexture({name: "background"}),
            textureSizeMode: fox.TextureSizeMode.COVER,
            texturePositionMode: fox.TexturePositionMode.CENTER
        })
        layer.addObject({name: "background", object: background})

        return {camera, layer, lighting, background}
    }
}