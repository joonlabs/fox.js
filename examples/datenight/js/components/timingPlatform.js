import fox from "../../../../src/index.js";

const TIMING_FRAMES = 100
export class TimingPlatform extends fox.Component {
    constructor({platform}) {
        super();
        this.framecounter = 0
        this.platform = platform
        this.platform.ownedByPlayerType = "Pink"
    }

    onCalc({timestep, object} = {}) {
        if(this.framecounter >= TIMING_FRAMES){
            this.framecounter = 0
            if(this.platform.ownedByPlayerType === "Pink"){
                this.platform.ownedByPlayerType = "Blue"
                this.platform.platform.texture = fox.AssetManager.getTexture({name: "Platform_Blue"})
                this.platform.platform.applyTexture()
            }else if(this.platform.ownedByPlayerType === "Blue"){
                this.platform.ownedByPlayerType = "Pink"
                this.platform.platform.texture = fox.AssetManager.getTexture({name: "Platform_Pink"})
                this.platform.platform.applyTexture()
            }
        }
        this.framecounter++
    }
}