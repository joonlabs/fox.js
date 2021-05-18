import {Particle} from './particle.js'
import {Random} from '../random/index.js'
import {Vectors} from '../vectors/index.js'
import {GameObject} from '../gameobjects/gameobject.js'

/**
 * A ParticleSystem is responsible for spawning particles at a
 *
 * @class ParticleSystem
 */
export class ParticleSystem extends GameObject {
    /**
     * Construct method of the object
     * @param {number} x X-position of the particle system
     * @param {number} y Y-position of the particle system
     * @param {function} initiation Function that is called for every particle, when it is initialized
     * @param {function} distribution Function that is called for every particle, when it is initialized, or resetted
     * @param {object} settings Settings for the system (maxParticles (max amount of particles that can be emitted), particleLifespan (life duration until a particle is resetted measured in frames), spawnRate (amount of particles that are activated per second))
     * @param {string} tag Tag of the object for grouping multiple objects logically together
     * @param {number} z Depth information for sorting in layer
     * * @returns Particle
     */
    constructor({x, y, initiation, distribution, settings, tag, z}) {
        super({
            x: x,
            y: y,
            width: 0,
            height: 0,
            z: z,
            tag: tag
        })

        this.position = {
            x: 0,
            y: 0,
        }
        this.dimensions = new Vectors.Vec2D

        this.settings = {
            maxParticles: settings ? (settings.maxParticles || 500) : 500,
            particleLifespan: settings ? (settings.particleLifespan || 60) : 60,
            spawnRate: settings ? (settings.spawnRate || 500) : 500,
        }
        this.distribution = distribution || this.defaultDistribution
        this.initiation = initiation

        this.state = 0 //0=stopped, 1=play, 2=pause

        this.frames = 0 //lifetime 

        this.pool = []
    }

    setLayer({layer}) {
        super.setLayer({layer});

        // create particle pool
        for (let i = 0; i < this.settings.maxParticles; i++) {
            let particle = new Particle()
            particle.setLayer({layer: layer})
            this.pool.push(particle)
            particle.dead = true
            particle.lifetime = 0
            if (this.initiation) this.initParticle({particle: particle})
        }
    }

    defaultDistribution({particle} = {}, _this = this) {
        particle.position = _this.position
        particle.velocity = {
            x: Random.range({min: -1, max: 1}),
            y: Random.range({min: -1, max: 1}),
        }
        particle.acceleration = {
            x: Random.range({min: -1, max: 1}),
            y: Random.range({min: -1, max: 1}),
        }
    }

    resetParticle({particle, blockDistribution} = {}, _this = this) {
        particle.lifetime = 0
        particle.dead = true
    }

    initParticle({particle} = {}, _this = this) {
        _this.initiation({particle: particle})
    }

    play(_this = this) {
        _this.state = 1
    }

    pause(_this = this) {
        _this.state = 2
    }

    stop(_this = this) {
        _this.state = 0
        for (let particle of _this.pool) _this.resetParticle({particle: particle})
    }

    isPlaying(_this = this) {
        return _this.state === 1
    }

    isPaused(_this = this) {
        return _this.state === 2
    }

    isStopped(_this = this) {
        return _this.state === 0
    }

    awakeParticle(_this = this) {
        for (let i = 0; i < _this.pool.length; i++) {
            if (_this.pool[i].dead) {
                _this.distribution({particle: _this.pool[i]})
                _this.pool[i].dead = false // awake particle
                return true
            }
        }
        return false
    }

    calc({timestep} = {}, _this = this) {
        // if playing, awake new particles if possible
        if (_this.state === 1) {
            let rate = (60 / _this.settings.spawnRate) * timestep
            if (rate > 1) {
                if (_this.frames % parseInt(rate) === 0) _this.awakeParticle()
            } else {
                for (let i = 0; i < parseInt(1 / rate); i++) {
                    if (!_this.awakeParticle()) break
                }
            }
        }

        // if not stopped, call particle's calc method
        if (_this.state !== 0) {
            for (let particle of _this.pool) {
                if (particle.lifetime >= _this.settings.particleLifespan) {
                    _this.resetParticle({particle: particle})
                } else {
                    if (!particle.dead) {
                        particle.lifetime += timestep
                        particle.calc({timestep: timestep})
                    }
                }
            }
        }

        this.frames++
    }

    render({x, y, width, height, camera, renderer, framebuffer}, _this = this) {
        if (_this.state !== 0) {
            for (let particle of _this.pool) {
                if (!particle.dead) {
                    particle.render({
                        x: x,
                        y: y,
                        width: particle.dimensions.width,
                        height: particle.dimensions.height,
                        camera: camera,
                        framebuffer: framebuffer,
                        renderer: renderer
                    })
                }
            }
        }
    }
}