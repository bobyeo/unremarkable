import { AnimatedSprite, Resource, Texture } from 'pixi.js'
import { Key } from '../control/key'
import { TerrainSprite } from './terrainSprite'
import ActionSprite from './actionSprite'

export interface IFallTracker {
  start: {
    x: number,
    y: number,
  }
}

export class ControllableSprite extends ActionSprite {
  public sprite: AnimatedSprite
  public fallTracker: IFallTracker | undefined
  private leftKey: Key
  private rightKey: Key
  private upKey: Key
  private downKey: Key
  public jumping: boolean = false

  constructor(
    moveRightTextures: Texture<Resource>[],
    moveLeftTextures: Texture<Resource>[],
    private window: Window & typeof globalThis,
    stepSize: number = 5,
    jumpSpeed: number = 25,
    fallSpeed: number = 2,
  ) {
    super(moveRightTextures, moveLeftTextures, stepSize, jumpSpeed, fallSpeed)
    // FIXME: this is just for casting. Figure out better typing
    this.sprite = this._sprite as AnimatedSprite
    this.sprite.loop = true

    this.leftKey = new Key('ArrowLeft', this.window, true, this.animateWalkLeft.bind(this), this.stopAnimation.bind(this))
    this.rightKey = new Key('ArrowRight', this.window, true, this.animateWalkRight.bind(this), this.stopAnimation.bind(this))
    this.downKey = new Key('ArrowDown', this.window)
    this.upKey = new Key('ArrowUp', this.window, true, this.handleJump.bind(this))

    this.listen()
  }

  public tick(delta: number) {
    this.rightTick()
    this.leftTick()
    this.upTick()
  }

  public listen() {
    this.rightKey.subscribe()
    this.leftKey.subscribe()
    this.downKey.subscribe()
    this.upKey.subscribe()
  }

  public ignore() {
    this.rightKey.unsubscribe()
    this.leftKey.unsubscribe()
    this.downKey.unsubscribe()
    this.upKey.unsubscribe()
  }

  public land() {
    this.falling = false
    this.jumping = false
  }

  private leftTick() {
    this.tryMoveLeft = this.leftKey.isDown
  }

  private upTick() {
    this.tryJump = this.upKey.isDown
  }

  private rightTick() {
    this.tryMoveRight = this.rightKey.isDown
  }

  private handleJump() {
    if (!this.jumping) {
      // TODO: Animate jump
      // TODO: add jumping sound
      this.tryJump = true
    }
  }

  private animateWalkRight() {
    if (!this.jumping && !this.sprite.playing) {
      this.sprite.textures = this.moveRightTextures
      this.sprite.play()
    }
  }

  private animateWalkLeft() {
    if (!this.jumping && !this.sprite.playing) {
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
}

export type CollidableSprite = TerrainSprite // || controllable sprite?
