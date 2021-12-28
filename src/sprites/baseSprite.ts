import { AnimatedSprite, Sprite } from 'pixi.js'
export class BaseSprite {

  constructor(protected _sprite: Sprite | AnimatedSprite) { }

  public get top(): number {
    return this._sprite.y
  }

  public get bottom(): number{
    return (this._sprite.y + this._sprite.height)
  }
}