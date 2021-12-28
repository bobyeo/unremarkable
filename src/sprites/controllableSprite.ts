import { AnimatedSprite, Resource, Texture } from 'pixi.js'
import { OutlineFilter } from 'pixi-filters'
import { Key } from '../control/key';
import { TerrainSprite } from './terrainSprite';
import { BaseSprite } from './baseSprite';

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
  private log: boolean = true
  public fallSpeed = 1
  public fallTracker: IFallTracker | undefined
  private left: Key
  private right: Key
  private up: Key
  private down: Key
  private jumping: boolean = true

  constructor(
    private moveRightTextures: Texture<Resource>[],
    private moveLeftTextures: Texture<Resource>[],
    private window: Window & typeof globalThis,
    private stepSize: number = 15,
    private jumpSpeed: number = -5
    ){
    super(new AnimatedSprite(moveRightTextures))
    this.sprite = this._sprite as AnimatedSprite // FIXME: this is just for casting. Figure out better typing
    this.sprite.loop = true

    this.left = new Key('ArrowLeft', this.window, true, this.animateWalkLeft.bind(this), this.stopAnimation.bind(this))
    this.right = new Key('ArrowRight', this.window, true, this.animateWalkRight.bind(this), this.stopAnimation.bind(this))
    this.down = new Key('ArrowDown', this.window)
    this.up = new Key('ArrowUp', this.window, true, this.handleJump.bind(this))

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
    this.right.subscribe()
    this.left.subscribe()
    this.down.subscribe()
    this.up.subscribe()
  }

  public ignore () {
    this.right.unsubscribe()
    this.left.unsubscribe()
    this.down.unsubscribe()
    this.up.unsubscribe()
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


  private leftTick () {
    this.left.isDown && this.moveLeft()
  }

  private rightTick () {
    this.right.isDown && this.moveRight()
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
      this.jumpSpeed = -20
      this.sprite.y += this.jumpSpeed
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
}