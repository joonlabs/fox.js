// load all textures
import fox from "../../../src/index.js";

//background
fox.AssetManager.addTexture({
    name: "background",
    asset: new fox.Assets.Texture({
        src: "assets/background.png"
    })
})

// platforms
fox.AssetManager.addTexture({
    name: "Platform_Uncolored_Wide",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Uncolored_Wide.png",
        width: 44 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Vertical_Uncolored",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Vertical_Uncolored.png",
        width: 12 * 2,
        height: 47 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Wood",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Wood.png",
        width: 28 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Wood_Wide",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Wood_Wide.png",
        width: 44 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Uncolored",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Uncolored.png",
        width: 28 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Blue",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Blue.png",
        width: 28 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Blue_Wide",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Blue_Wide.png",
        width: 44 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Blue_Vertical",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Vertical_Blue.png",
        width: 12 * 2,
        height: 47 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Pink",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Pink.png",
        width: 28 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Pink_Wide",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Pink_Wide.png",
        width: 44 * 2,
        height: 10 * 2
    })
})
fox.AssetManager.addTexture({
    name: "Platform_Pink_Vertical",
    asset: new fox.Assets.Texture({
        src: "assets/Platform_Vertical_Pink.png",
        width: 12 * 2,
        height: 47 * 2
    })
})
fox.AssetManager.addTexture({
    name: "DinnerTable",
    asset: new fox.Assets.Texture({
        src: "assets/DinnerTable.png",
        width: 48 * 2,
        height: 38 * 2
    })
})

// blue player
fox.AssetManager.addTextureAtlas({
    atlas: new fox.Assets.TextureAtlas({
        src: "assets/Player_Blue.png",
        mappings: [
            {
                name: "Player_Blue_Idle1",
                x: 0, y: 0,
                width: 15,
                height: 16
            },
            {
                name: "Player_Blue_Idle2",
                x: 19,
                y: 1,
                width: 15,
                height: 15,
                offset: new fox.Vectors.Vec2D({y: 1})
            },
            {
                name: "Player_Blue_Jump1",
                x: 1,
                y: 22,
                width: 14,
                height: 18,
                offset: new fox.Vectors.Vec2D({x: 1, y: -2})
            },
            {
                name: "Player_Blue_Jump2",
                x: 19,
                y: 22,
                width: 12,
                height: 21,
                offset: new fox.Vectors.Vec2D({x: 2, y: -5})
            },
            {
                name: "Player_Blue_Jump3",
                x: 35,
                y: 28,
                width: 19,
                height: 8,
                offset: new fox.Vectors.Vec2D({x: -2, y: 8})
            },
            {
                name: "Player_Blue_Jump4",
                x: 58,
                y: 29,
                width: 27,
                height: 6,
                offset: new fox.Vectors.Vec2D({x: -6, y: 9})
            },
            {
                name: "Player_Blue_Run_Right1",
                x: 49,
                y: 0,
                width: 15,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 0})
            },
            {
                name: "Player_Blue_Run_Right2",
                x: 67,
                y: 0,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: -1})
            },
            {
                name: "Player_Blue_Run_Right3",
                x: 83,
                y: 0,
                width: 15,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: -2})
            },
            {
                name: "Player_Blue_Run_Right4",
                x: 101,
                y: 0,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 0})
            },
            {
                name: "Player_Blue_Run_Left1",
                x: 49,
                y: 39,
                width: 15,
                height: 16
            },
            {
                name: "Player_Blue_Run_Left2",
                x: 67,
                y: 39,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 1})
            },
            {
                name: "Player_Blue_Run_Left3",
                x: 83,
                y: 39,
                width: 15,
                height: 16
            },
            {
                name: "Player_Blue_Run_Left4",
                x: 101,
                y: 39,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 1})
            }
        ]
    })
})

// pink player
fox.AssetManager.addTextureAtlas({
    atlas: new fox.Assets.TextureAtlas({
        src: "assets/Player_Pink.png",
        mappings: [
            {
                name: "Player_Pink_Idle1",
                x: 0,
                y: 0,
                width: 15,
                height: 16
            },
            {
                name: "Player_Pink_Idle2",
                x: 19,
                y: 1,
                width: 15,
                height: 15,
                offset: new fox.Vectors.Vec2D({y: 1})
            },
            {
                name: "Player_Pink_Jump1",
                x: 1,
                y: 22,
                width: 13,
                height: 18,
                offset: new fox.Vectors.Vec2D({x: 1, y: -3})
            },
            {
                name: "Player_Pink_Jump2",
                x: 19,
                y: 22,
                width: 11,
                height: 21,
                offset: new fox.Vectors.Vec2D({x: 2, y: -5})
            },
            {
                name: "Player_Pink_Jump3",
                x: 35,
                y: 28,
                width: 19,
                height: 8,
                offset: new fox.Vectors.Vec2D({x: -2, y: 8})
            },
            {
                name: "Player_Pink_Jump4",
                x: 58,
                y: 29,
                width: 27,
                height: 6,
                offset: new fox.Vectors.Vec2D({x: -6, y: 9})
            },
            {
                name: "Player_Pink_Run_Right1",
                x: 49,
                y: 0,
                width: 15,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 0})
            },
            {
                name: "Player_Pink_Run_Right2",
                x: 67,
                y: 0,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: -1})
            },
            {
                name: "Player_Pink_Run_Right3",
                x: 83,
                y: 0,
                width: 15,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: -2})
            },
            {
                name: "Player_Pink_Run_Right4",
                x: 101,
                y: 0,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 0})
            },
            {
                name: "Player_Pink_Run_Left1",
                x: 49,
                y: 39,
                width: 15,
                height: 16
            },
            {
                name: "Player_Pink_Run_Left2",
                x: 67,
                y: 39,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 1})
            },
            {
                name: "Player_Pink_Run_Left3",
                x: 83,
                y: 39,
                width: 15,
                height: 16
            },
            {
                name: "Player_Pink_Run_Left4",
                x: 101,
                y: 39,
                width: 13,
                height: 16,
                offset: new fox.Vectors.Vec2D({x: 1})
            }
        ]
    })
})