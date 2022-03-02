import { Polygon } from 'detect-collisions'
import { AnimatedSprite, Resource, Texture } from 'pixi.js'
import BaseSprite from './baseSprite'

export default class ActionSprite extends BaseSprite {
  public tryMoveLeft = false
  public tryMoveRight = false
  public tryJump = false
  public falling: boolean = true

  constructor(
    protected moveRightTextures: Texture<Resource>[],
    protected moveLeftTextures: Texture<Resource>[],
    public stepSize: number = 15,
    public jumpSpeed: number = 25,
    public fallSpeed: number = 1,
  ) {
    super(new AnimatedSprite(moveRightTextures))
    this.polygon.tag = 'action'
  }

  public tick(delta: number) {
  }

  public get potentialHorizontalMovement() {
    let { x } = this._sprite
    if (this.tryMoveLeft) {
      x -=  this.stepSize
    }
    if (this.tryMoveRight) {
      x +=  this.stepSize
    }
    return x
  }

  public get potentialVerticalMovement() {
    let { y } = this._sprite
    if (y === undefined) {
      this.falling = false
    }
    if (this.falling) {
      y += (this.fallSpeed + 1) // FIXME: refactor this to indicate why we need to read ahead 1px
    } else if(this.tryJump) {
      y -= this.jumpSpeed
    }
    return y
  }

}