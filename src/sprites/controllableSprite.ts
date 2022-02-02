import { AnimatedSprite, Resource, Texture } from 'pixi.js'
import { Key } from '../control/key';
import { TerrainSprite } from './terrainSprite';
import { BaseSprite } from './baseSprite';
import { Surroundings } from '../world/Surroundings';

export type ActionSprite = ControllableSprite
export type CollidableSprite = TerrainSprite // || controllable sprite?

export interface IFallTracker {
  start: {
    x: number,
    y: number,
  }
}

export class ControllableSprite extends BaseSprite {
  public sprite: AnimatedSprite
  public falling: boolean = false
  public moving: boolean = false
  public fallSpeed = 1
  public fallTracker: IFallTracker | undefined
  private leftKey: Key
  private rightKey: Key
  private upKey: Key
  private downKey: Key
  public jumping: boolean = true

  constructor(
    private moveRightTextures: Texture<Resource>[],
    private moveLeftTextures: Texture<Resource>[],
    private window: Window & typeof globalThis,
    public stepSize: number = 15,
    public jumpSpeed: number = -25
    ){
    super(new AnimatedSprite(moveRightTextures))
    this.sprite = this._sprite as AnimatedSprite // FIXME: this is just for casting. Figure out better typing
    this.sprite.loop = true

    this.leftKey = new Key('ArrowLeft', this.window, true, this.animateWalkLeft.bind(this), this.stopAnimation.bind(this))
    this.rightKey = new Key('ArrowRight', this.window, true, this.animateWalkRight.bind(this), this.stopAnimation.bind(this))
    this.downKey = new Key('ArrowDown', this.window)
    this.upKey = new Key('ArrowUp', this.window, true, this.handleJump.bind(this))

    this.listen()
  }
  
  public tick (delta: number) {
    if (this.falling) {
      this.fall(this.fallSpeed)
    }
    this.rightTick()
    this.leftTick()
    // this.downTick()
  }
  
  public listen () {
    this.rightKey.subscribe()
    this.leftKey.subscribe()
    this.downKey.subscribe()
    this.upKey.subscribe()
  }

  public ignore () {
    this.rightKey.unsubscribe()
    this.leftKey.unsubscribe()
    this.downKey.unsubscribe()
    this.upKey.unsubscribe()
  }

  private fall(distance: number) {
    this.moveSpriteDownwards(distance)
  }

  public land() {
    const distanceFallen = this.sprite.y - this.fallTracker!.start.y
    this.falling = false
    this.jumping = false
    console.log('Fell ', distanceFallen, ' many pixels. Starting at: ', this.fallTracker?.start.y, ' and ending at: ', this.sprite.y)
    // if too far the call die
    // if not too far call stun
    // else run the "land" animation and go
  }

  public stop() {
    this.moving = false
  }

  public go() {
    this.moving = true
  }


  private leftTick () {
    this.leftKey.isDown && this.moveLeft()
  }

  private rightTick () {
    this.rightKey.isDown && this.moveRight()
  }

  // private downTick () {
  //   this.down.isDown && this.moveDown()
  // }

  private moveLeft () {
    this.sprite.x -= this.stepSize
  }

  private moveRight () {
    this.sprite.x += this.stepSize
  }
 
  // private moveDown() {
  //   this.moveSpriteDownwards(this.stepSize)
  // }

  private handleJump() {
    if(!this.jumping) {
      // TODO: Animate jump
      // TODO: add jumping sound
      this.jumping = true
      // this.jumpSpeed = -20
      // this.sprite.y += this.jumpSpeed
    }
  }

  private animateWalkRight() {
    if (!this.jumping) {
      this.sprite.textures = this.moveRightTextures
      this.sprite.play()
    }
  }

  private animateWalkLeft() {
    if (!this.jumping) {
      this.sprite.textures = this.moveLeftTextures
      this.sprite.play()
    }
  }

  private stopAnimation() {
    this.sprite.stop()
  }

  private moveSpriteDownwards(steps: number) {
    this.sprite.y += steps
  }

  public moveSpriteUpwards(steps: number) {
    this.sprite.y -= steps
  }
}