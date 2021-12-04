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
  private space: Key
  private falling: IFallTracker | undefined

  constructor(private moveRightTextures: Texture<Resource>[] , private moveLeftTextures: Texture<Resource>[] , private window: Window & typeof globalThis, private stepSize: number = 15){ 
    this.sprite = new AnimatedSprite(this.moveRightTextures)
    this.left = new Key('ArrowLeft', this.window)
    this.right = new Key('ArrowRight', this.window)
    this.up = new Key('ArrowUp', this.window)
    this.down = new Key('ArrowDown', this.window)
    this.space = new Key(' ', this.window)
    this.listen()
  }
  
  public tick () {
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
    if(this.left.isDown) {
      this.walkLeft()
    }
  }

  private rightTick () {
    if(this.right.isDown) {
      this.walkRight()
    }
  }

  private upTick () {
    if(this.up.isDown) {
      this.walkUp()
    }
  }

  private downTick () {
    if(this.down.isDown) {
      this.walkDown()
    }
  }

  private walkLeft () {
    if (!this.sprite.playing) {
      this.sprite.textures = this.moveLeftTextures
      this.sprite.play()
    }
    this.sprite.x -= this.stepSize
  }

  private leftDown () {
    this.walkLeft()
  }

  private leftUp () {
    this.sprite.stop()
  }

  private walkRight () {
    if (!this.sprite.playing) {
      this.sprite.textures = this.moveRightTextures
      this.sprite.play()
    }
    this.sprite.x += this.stepSize
  }
 
  private rightDown () {
    this.walkRight()
  }

  private rightUp () {
    this.sprite.stop()
  }

  private walkUp () {
    if (!this.sprite.playing) {
      this.sprite.play()
    }
    this.sprite.y -= this.stepSize
  }

  private upDown () {
    this.walkUp()
  }

  private upUp () {
    this.sprite.stop()
  }

  private walkDown() {
    if (!this.sprite.playing) {
      this.sprite.play()
    }
    this.moveSpriteDownwards(this.stepSize)
  }

  private handleJump() {
    // if (!this.airborne) {
    //   // jump!
    //   this.airborne = true;
    //   this.verticalSpeed = -5;
    // }
  }

  private moveSpriteDownwards(steps: number) {
    this.sprite.y += steps
  }

  private downDown () {
    this.walkDown()
  }

  private spaceDown() {
    this.handleJump()
  }

  private spaceUp() {
    // maybe make the jump more or less intense based on time
  }

  private downUp () {
    this.sprite.stop()
  }
}