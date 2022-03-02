import { Resource, Sprite, Texture } from 'pixi.js'
import BaseSprite from './baseSprite'
export class TerrainSprite extends BaseSprite{
  public sprite: Sprite

  // currently all terrain objects are not permiable so the speed is = 0
  constructor(texture: Texture<Resource>, public row?: number, public column?: number) {
    super(new Sprite(texture))
    this.sprite = this._sprite as Sprite
    this.polygon.tag = 'terrain'
  }
}
