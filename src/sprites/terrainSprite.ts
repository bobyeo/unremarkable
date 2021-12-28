import { Resource, Sprite, Texture } from 'pixi.js'
import { BaseSprite } from './baseSprite'
export class TerrainSprite extends BaseSprite{
  public sprite: Sprite
  constructor(texture: Texture<Resource>, public row?: number, public column?: number) {
    super(new Sprite(texture))
    this.sprite = this._sprite
  }
}