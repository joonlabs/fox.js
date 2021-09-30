import fox from "../../../../src/index.js";
import {Platform} from "../objects/platform.js";
import {Vec2D} from "../../../../src/packages/vectors/vectors/index.js";

const SPEED_MAXIMUM = 4*3
const ACCELERATION = new fox.Vectors.Vec2D({x: 2 * 7, y: 0})
const DECELERATION = new fox.Vectors.Vec2D({x: 0.55 * 3, y: 0})
const GRAVITY = new fox.Vectors.Vec2D({x: 0, y: 0.5 * 3})
const JUMP = new fox.Vectors.Vec2D({x: 0, y: -8 * 3.15})

export class PlayerMovement extends fox.Component {
    constructor({playerType, keyLeft, keyRight, keyUp, scene, layer}) {
        super();

        // variables
        this.playerType = playerType
        this.velocity = new fox.Vectors.Vec2D({x: 0, y: 0});
        this.scene = scene
        this.layer = layer
        this.dustPosition = new fox.Vectors.Vec2D()
        this.dustFramesRemaining = 0
        this.releasedJumpKey = true

        // key mappings
        this.keyLeft = keyLeft
        this.keyRight = keyRight
        this.keyUp = keyUp

        // dust particle system
        this.dust = Utils.createDustParticleSystem(this, layer)
        layer.addObject({object: this.dust})
    }

    accelerateX({direction, timestep}) {
        if (direction === 1 && this.velocity.x < SPEED_MAXIMUM) {
            this.velocity = this.velocity.add({vector: ACCELERATION.multScalar({scalar: direction}).multScalar({scalar: timestep})})
            if(this.velocity.x > SPEED_MAXIMUM) this.velocity.x = SPEED_MAXIMUM
        } else if (direction === -1 && this.velocity.x > -SPEED_MAXIMUM) {
            this.velocity = this.velocity.add({vector: ACCELERATION.multScalar({scalar: direction}).multScalar({scalar: timestep})})
            if(this.velocity.x < -SPEED_MAXIMUM) this.velocity.x = -SPEED_MAXIMUM
        }
    }

    decelerateX({timestep}) {
        if (this.velocity.x < DECELERATION.x
            && this.velocity.x > -DECELERATION.x) {
            this.velocity.x = 0
        }
        if (this.velocity.x > 0) {
            this.velocity = this.velocity.sub({vector: DECELERATION.multScalar({scalar: timestep})})
        } else if (this.velocity.x < 0) {
            this.velocity = this.velocity.add({vector: DECELERATION.multScalar({scalar: timestep})})
        }

    }

    applyGravity({timestep}) {
        this.velocity = this.velocity.add({vector: GRAVITY.multScalar({scalar: timestep})})
    }

    jump({timestep}) {
        this.velocity = this.velocity.add({vector: JUMP.multScalar({scalar: 1})})
    }

    onCalc({timestep, object} = {}) {
        this.object = object
        //timestep = 1
        //console.log(timestep)

        // check if player is fallen out of screen
        if (object.position.y > 260 * 3) {
            object.getLayer().getScene().getApplication().reloadCurrentScene()
        }

        let canStand = false,
            canWalkRight = true,
            canWalkLeft = true,
            bothPlayersReachedGoal = false

        // check for collisions
        for (const [name, platform] of Object.entries(object.getLayer().getScene().getStoredItems())) {
            if (platform.reachedGoal !== undefined) {
                platform.reachedGoal[this.playerType] = false
            }

            if (fox.CollisionManager.colliding({
                obj1: object.getComponent({name: "collider"}),
                obj2: platform.getCollider()
            })) {
                // horizontal platforms
                if (object.position.y < platform.getY() - 0 && this.velocity.y >= 0) {
                    // check if player can stand
                    if (platform.ownedByPlayerType === undefined || platform.ownedByPlayerType === this.playerType) {
                        canStand = true
                        object.position.y = platform.getY() - 13 * 3
                    }

                    // check if texture need to be changed
                    if (platform.type === Platform.types.DEFAULT || platform.type === Platform.types.DEFAULT_BIG) {
                        if (platform.ownedByPlayerType === undefined) {
                            platform.ownedByPlayerType = this.playerType
                            platform.platform.texture = fox.AssetManager.getTexture({name: "Platform_" + this.playerType + (platform.type === Platform.types.DEFAULT_BIG ? "_Wide" : "")})
                        }
                    }
                }

                // goal platforms
                if (platform.type === Platform.types.GOAL) {
                    platform.reachedGoal[this.playerType] = true

                    if (platform.reachedGoal.Blue && platform.reachedGoal.Pink) {
                        bothPlayersReachedGoal = true
                    }
                }

                // vertical platforms
                if (platform.type === Platform.types.VERTICAL) {
                    if (platform.ownedByPlayerType === undefined || platform.ownedByPlayerType === this.playerType) {
                        if (object.position.x < platform.getX()) {
                            canWalkRight = false
                            object.position.x = platform.getX() - 7 * 3
                        } else {
                            object.position.x = platform.getX() + 16 * 3
                            canWalkLeft = false
                        }
                    }

                    if (platform.ownedByPlayerType === undefined) {
                        platform.ownedByPlayerType = this.playerType
                        platform.platform.texture = fox.AssetManager.getTexture({name: "Platform_" + this.playerType + "_Vertical"})
                    }
                }
            }
        }

        // check if next level can be loaded and load if ok
        if (bothPlayersReachedGoal
            && object.getLayer().getObject({name: "PlayerBlue"}).getComponent({name: "movement"}).velocity.y === 0
            && object.getLayer().getObject({name: "PlayerPink"}).getComponent({name: "movement"}).velocity.y === 0) {
            let currentSceneName = object.getLayer().getScene().getApplication().getCurrentSceneName()
            let currentSceneNumber = parseInt(currentSceneName.substr(5)) + 1
            let newSceneName = "level" + (currentSceneNumber < 10 ? "0" : "0") + currentSceneNumber.toString()
            object.getLayer().getScene().getApplication().loadScene({name: newSceneName})
        }

        if (this.velocity.x === 0 && canStand) {
            object.getComponent({name: "animator"}).setActiveAnimation({name: "idle"})
        }

        // apply gravity
        if (!canStand) {
            this.applyGravity({timestep: timestep})
        } else {
            if (this.velocity.y > 0) {
                // landing
                this.velocity.y = 0

                object.getComponent({name: "animator"}).setActiveAnimation({name: "idle"})

                this.dustPosition = object.position.clone()
                this.dust.play()
                this.dustFramesRemaining = 20
            }
        }

        if (this.dustFramesRemaining > 0) {
            this.dustFramesRemaining -= timestep
        }
        if (this.dustFramesRemaining < 0 && !this.dust.isStopped()) {
            this.dust.stop()
        }

        // jump
        if ((fox.Input.isKeyDown({key: this.keyUp}) || fox.Input.getTouches().length > 0)
            && canStand
            && this.releasedJumpKey
            && this.velocity.y >= 0) {
            object.getComponent({name: "animator"}).setActiveAnimation({name: "jump"})
            this.releasedJumpKey = false
            this.dustPosition = object.position.clone()
            this.dust.play()
            this.dustFramesRemaining = 20
            this.jump({timestep: timestep})
        }
        if (!fox.Input.isKeyDown({key: this.keyUp})) {
            this.releasedJumpKey = true
        }

        // movement on x axis
        if (fox.Input.isKeyDown({key: this.keyLeft}) && canWalkLeft) {
            if (this.velocity.y === 0) object.getComponent({name: "animator"}).setActiveAnimation({name: "runLeft"})
            this.accelerateX({direction: -1, timestep: 1});
        } else if (fox.Input.isKeyDown({key: this.keyRight}) && canWalkLeft) {
            if (this.velocity.y === 0) object.getComponent({name: "animator"}).setActiveAnimation({name: "runRight"})
            this.accelerateX({direction: 1, timestep: 1});
        } else if (!canWalkLeft || !canWalkRight) {
            this.velocity.x = 0
        } else {
            this.decelerateX({timestep: 1});
        }

        object.position = object.position.add({
            vector: this.velocity.hadamard({
                vector: new Vec2D({
                    x: timestep,
                    y: timestep
                })
            })
        })
    }
}

/**
 * Utils-Class for creating the dust particle system
 */
class Utils {
    static createDustParticleSystem(_self, layer) {
        return new fox.ParticleSystem({
            initiation: function ({particle} = {}, _this = this) {
                particle.addComponent({component: new AlphaBlending()})
            },
            distribution: function ({particle} = {}, _this = this) {
                let colorVal = fox.Random.rangeInt({min: 200, max: 255})
                let color_ = new fox.Color({r: colorVal, g: colorVal, b: colorVal})
                particle.renderObject = new fox.GameObjects.Rectangle({
                    width: 3 * 3,
                    height: 3 * 3,
                    color: color_,
                    layer: this.layer,
                    z: 20
                })
                particle.renderObject.position.x = fox.Random.rangeInt({
                    min: _self.dustPosition.x - 5 * 3 * 2,
                    max: _self.dustPosition.x + 16 + 5 * 3 * 2,
                })
                particle.renderObject.position.y = fox.Random.rangeInt({
                    min: _self.dustPosition.y + 8 * 3,
                    max: _self.dustPosition.y + 16 * 3,
                })
            },
            settings: {
                maxParticles: 100,
                particleLifespan: fox.Random.rangeInt({min: 50, max: 60}),
                spawnRate: 60000
            },
        })
    }
}

/**
 * AlphaBlending class for managing disappearing of particles in a random order
 */
class AlphaBlending extends fox.Component {
    constructor({rotation} = {}) {
        super()
        this.rotDir = (rotation) ? (fox.Random.range({min: 0, max: 1}) > .5 ? 1 : -1) : 0
    }

    onCalc({timestep, object} = {}) {
        if (object.renderObject.color.a === 1 && Math.random() > 0.75) {
            object.renderObject.color.a = 0
        }
    }
}