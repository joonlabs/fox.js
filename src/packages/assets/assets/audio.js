import {Asset} from './asset.js'

/**
 * An Audio-Asset holds an audio file for playback.
 */
export class Audio extends Asset{
    /**
     * Creates an Audio object.
     * @param src
     * @param volume
     */
    constructor({src, volume}={}){
        super()
        
        let _this = this 
        this.loaded = false

        this.src = src
        
        _this.data = new window.Audio(src);
        _this.data.onloadeddata = function(){
            _this.loaded = true
        }
        _this.data.volume = volume==undefined ? 1 : volume/100
    }

    /**
     * Plays back an audio asset.
     * @param {boolean} loop
     * @param {number} jumpToSecsAfterLoop
     * @param _this
     */
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

    /**
     * Pauses audio playback.
     */
    pause(){
        this.data.pause()
    }

    /**
     * Sets the volume of the audio
     * @param volume
     */
    setVolume({volume}={}){
        this.data.volume = volume/100
    }
}