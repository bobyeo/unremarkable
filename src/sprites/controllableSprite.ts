import { AnimatedSprite, Resource, Texture } from 'pixi.js'
import { Key } from '../control/key';
import { TerrainSprite } from './terrainSprite';

export type ActionSprite = ControllablleSprite
export type CollidableSprite = TerrainSprite // || controllable sprite?
export interface IFallTracker {
  start: {
    x: number,
    y: number,
  }
}

export class ControllablleSprite {
  public sprite: AnimatedSprite
  private left: Key
  private right: Key
  private up: Key
  private down: Key
  private falling: IFallTracker | undefined
  private jumping: boolean = false
  private currentDelta: number | undefined

  constructor(
    private moveRightTextures: Texture<Resource>[],
    private moveLeftTextures: Texture<Resource>[],
    private window: Window & typeof globalThis,
    private stepSize: number = 15,
    private jumpSpeed: number = -5
    ){
    this.sprite = new AnimatedSprite(this.moveRightTextures)
    this.sprite.loop = true

    this.left = new Key('ArrowLeft', this.window, true, this.animateWalkLeft.bind(this), this.stopAnimation.bind(this))
    this.right = new Key('ArrowRight', this.window, true, this.animateWalkRight.bind(this), this.stopAnimation.bind(this))
    this.down = new Key('ArrowDown', this.window)
    this.up = new Key('ArrowUp', this.window, true, this.handleJump.bind(this, this.currentDelta))

    this.listen()
  }
  
  public tick (delta: number) {
    this.currentDelta = delta
    this.rightTick()
    this.leftTick()
    this.downTick()
    this.upTick()
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

  public fall(distance: number) {
    if (this.falling === undefined) {
      const { x, y } = this.sprite
      this.falling = {
        start: {
          x,
          y,
        },
      }
    }
    this.moveSpriteDownwards(distance)
  }

  public collide(collisionSprites: CollidableSprite[]) {
    collisionSprites.forEach((collisionSprite) => {
      if(this.falling !== undefined && (collisionSprite.sprite.y === this.sprite.y)) {
        this.land(this.sprite.y - this.falling.start.y)
      }
    })
    //if fall && collision is with terrain && collsion is "landing" (not side hit) {
 // should turn off fall
 // should calculate the distance 
 // should call land and pass in the distance fallen
//    }
// TODO: figure out logic for colliding with projectiles enemy/friendly, enemies, friends, etc
  }

  private land(distanceFallen: number) {
    this.falling = undefined
    console.log('Fell ', distanceFallen, ' many pixels')
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

  private upTick () {
    this.up.isDown &&  this.moveUp()
  }

  private downTick () {
    this.down.isDown && this.moveDown()
  }

  private moveLeft () {
    this.sprite.x -= this.stepSize
  }

  private moveRight () {
    this.sprite.x += this.stepSize
  }
 
  private moveUp () {
    this.sprite.y -= this.stepSize
  }

  private moveDown() {
    this.moveSpriteDownwards(this.stepSize)
  }

  private handleJump(delta?: number) {
    console.log('handling jump. delta: ', this.currentDelta)
    this.jumping = true
    this.jumpSpeed = -20
    this.sprite.y += this.jumpSpeed * (delta || 1)
  }

  private animateWalkRight() {
    this.sprite.textures = this.moveRightTextures
    this.sprite.play()
  }

  private animateWalkLeft() {
    this.sprite.textures = this.moveLeftTextures
    this.sprite.play()
  }

  private stopAnimation() {
    this.sprite.stop()
  }

  private moveSpriteDownwards(steps: number) {
    this.sprite.y += steps
  }
}