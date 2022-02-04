import { AnimatedSprite, Sprite } from 'pixi.js'
export class BaseSprite {

  constructor(protected _sprite: Sprite | AnimatedSprite) { }

  public get top(): number {
    return this._sprite.y
  }

  public get bottom(): number{
    return (this._sprite.y + this._sprite.height)
  }

  public get right(): number{
    return (this._sprite.x + this._sprite.width)
  }

  public get left(): number{
    return this._sprite.x
  }

  public isAbove(sprite: BaseSprite) {
    return this.top > sprite.bottom
  }

  public isBelow(sprite: BaseSprite) {
    return this.top > sprite.bottom
  }

  public isBelowPixel(y: number) {
    return this.top > y
  }
}