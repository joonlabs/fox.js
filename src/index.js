import {Animator, Animation} from './packages/animator/index.js'
import {Assets} from './packages/assets/index.js'
import {AssetManager} from './packages/assetmanager/index.js'
import {AudioController} from './packages/audiocontroller/index.js'
import {Camera} from './packages/camera/index.js'
import {Colliders, CollisionManager} from './packages/collision/index.js'
import {Color} from './packages/color/index.js'
import {GameObjects} from './packages/gameobjects/index.js'
import {Input} from './packages/input/index.js'
import {Layers} from './packages/layers/index.js'
import {ObjectManager} from './packages/objectmanager/index.js'
import {ParticleSystem} from './packages/particlesystem/index.js'
import {Random} from './packages/random/index.js'
import {Renderers} from './packages/renderers/index.js'
import {Scene} from './packages/scene/index.js'
import {Vectors} from './packages/vectors/index.js'
import {Application} from './packages/application/index.js'
import {Component} from './packages/component/index.js'
import * as Components from './packages/components/index.js'
import {Utils} from './packages/utils/index.js'
import {TexturePositionMode, TextureSizeMode} from "./packages/gameobjects/objects/sprite.js";

let fox = {
    Animation,
    Animator,
    Application,
    Assets,
    AssetManager,
    AudioController,
    Camera,
    Colliders,
    CollisionManager,
    Color,
    Component,
    Components,
    GameObjects,
    Input,
    Layers,
    ObjectManager,
    ParticleSystem,
    Random,
    Renderers,
    Scene,
    TexturePositionMode,
    TextureSizeMode,
    Utils,
    Vectors
}

window.fox = fox
export default fox