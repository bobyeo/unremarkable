import { Resource, Sprite, Texture } from 'pixi.js'
export class TerrainSprite {
  public sprite: Sprite

  constructor(texture: Texture<Resource>) {
    this.sprite = new Sprite(texture)
  }
}