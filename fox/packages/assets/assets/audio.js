import {Asset} from './asset.js'

export class Audio extends Asset{
    constructor({src, volume}={}){
        super()
        
        let _this = this 
        
        this.src = src
        
        _this.data = new window.Audio(src);
        _this.data.onload = function(){ 
            _this.loaded = true
        }
        _this.data.volume = volume==undefined ? 1 : volume/100
    }
    
    play({loop,jumpToSecsAfterLoop}={}, _this=this){
        _this.data.currentTime = 0
        _this.data.play()
        if(loop){
            _this.data.addEventListener("timeupdate", function(){
                let buffer = .64
                if(this.currentTime > this.duration-buffer){
                    this.currentTime = jumpToSecsAfterLoop==undefined ? 0 : jumpToSecsAfterLoop
                    this.play()
                }
            })
        }
    }
    
    pause(_this=this){
        _this.data.pause()
    }
    
    setVolume({volume}={}, _this=this){
        _this.data.volume = volume/100
    }
}