import fox from '../../../src/index.js'
import {level01} from "./scenes/level01.js";
import {level02} from "./scenes/level02.js";
import {level03} from "./scenes/level03.js";
import {level04} from "./scenes/level04.js";
import {level05} from "./scenes/level05.js";
import {level06} from "./scenes/level06.js";
import {level07} from "./scenes/level07.js";
import {playground} from "./scenes/playground.js";
import './assets.js'

// create the new application
let app = new fox.Application({
    width: 1080,
    height: 780,
    logFPS: true
})
document.body.appendChild(app.view)

// after all resources loaded
fox.AssetManager.onResourcesLoaded({
    callback: function () {
        app.addScene({name: "level01", scene: level01})
        app.addScene({name: "level02", scene: level02})
        app.addScene({name: "level03", scene: level03})
        app.addScene({name: "level04", scene: level04})
        app.addScene({name: "level05", scene: level05})
        app.addScene({name: "level06", scene: level06})
        app.addScene({name: "level07", scene: level07})
        app.addScene({name: "playground", scene: playground})

        app.loadScene({name: "playground"})
        window.app = app
    }
})