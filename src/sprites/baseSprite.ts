import { AnimatedSprite, Sprite } from 'pixi.js'

type spriteTypes = 'terrain' | 'action'
interface TaggedPolygon extends SAT.Polygon {
  tag?: spriteTypes
}

export default class BaseSprite {
  private _polygon: TaggedPolygon
  constructor(protected _sprite: Sprite | AnimatedSprite) { 
    const { x, y, width, height } = this._sprite.getBounds()
    const position = new SAT.Vector(x, y)
    const box = new SAT.Box(position, width, height)
    this._polygon = box.toPolygon()
  }

  public get polygon() {
    this._polygon.pos = new SAT.Vector(this._sprite.x, this._sprite.y)
    return this._polygon
  }
}