import { Box, Polygon } from 'detect-collisions'
import { AnimatedSprite, Sprite } from 'pixi.js'

type spriteTypes = 'terrain' | 'action'
interface TaggedPolygon extends Polygon {
  tag?: spriteTypes
}
export default class BaseSprite {
  private _polygon: TaggedPolygon
  constructor(protected _sprite: Sprite | AnimatedSprite) { 
    const { x, y, width, height } = this._sprite.getBounds()
    this._polygon = new Box({ x, y }, width, height)
  }

  public get polygon() {
    this._polygon.setPosition(this._sprite.x, this._sprite.y)
    return this._polygon
  }
}