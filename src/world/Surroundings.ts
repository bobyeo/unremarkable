import { ControllableSprite } from '../sprites/controllableSprite';
import { TerrainSprite } from '../sprites/terrainSprite'

export class Surroundings {
  private _in: TerrainSprite[] = []
  private _right: TerrainSprite[] = []
  private _left: TerrainSprite[] = []
  private _above: TerrainSprite[] = []
  private _below: TerrainSprite[] = []

  constructor(private sprite: ControllableSprite, surroundingTerrain: TerrainSprite[]) {
      surroundingTerrain.forEach((collisionSprite) => {
        if(collisionSprite.top === this.sprite.bottom) {
          return this._below.push(collisionSprite)
        }

        if(collisionSprite.bottom === this.sprite.top) {
          return this._above.push(collisionSprite)
        }

        if(collisionSprite.right === this.sprite.left) {
          return this._left.push(collisionSprite)
        }

        if(collisionSprite.left === this.sprite.right) {
          return this._left.push(collisionSprite)
        }

        return this._in.push(collisionSprite)
      })
  }

  public get in(): TerrainSprite[] {
    return this._in;
  }

  public get right(): TerrainSprite[] {
    return this._right;
  }

  public get left(): TerrainSprite[] {
    return this._left;
  }

  public get below(): TerrainSprite[] {
    return this._below;
  }

  public get above(): TerrainSprite[] {
    return this._above;
  }
 }