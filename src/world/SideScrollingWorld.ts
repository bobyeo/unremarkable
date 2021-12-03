import { AnimatedSprite, Resource, Texture } from "pixi.js";
import { ActionSprite } from '../sprites/controllableSprite';
import { TerrainSprite } from "../sprites/terrainSprite";
import { SpriteUtils } from '../utils/sprite';

export class SideScrollingWorld {
  public level: TerrainSprite[] = []
  public readonly animatedSprites: ActionSprite[] = []
  private terrainPlacementCursorX = 0
  private terrainPlacementCursorY = this.window.innerHeight
  private readonly initWorldHeight = this.window.innerHeight
  private terrainRowHeight = 0

  // NOTE: World coordinates: 
  // Upper left: 0,0
  // Bottom left: 0, window height
  // Bottom right: window width, window height
  // Top right: window width, 0
  constructor(private terrainTextures: Texture<Resource>[], private worldMatrix: number[][], private window: Window & typeof globalThis, private gravity: number) {
    // assume all terrain blocks are the same height
    this.terrainRowHeight = this.terrainTextures[0].height
  }

  private placeNext(spriteIndex: number) {
    const nextTerrain = new TerrainSprite(this.terrainTextures[spriteIndex])
    nextTerrain.sprite.x = this.terrainPlacementCursorX
    nextTerrain.sprite.y = this.terrainPlacementCursorY
    this.level.push(nextTerrain)
    return nextTerrain
  }

  private initCursorForRow(terrain: Texture<Resource>) {
    this.terrainPlacementCursorX = 0
    this.terrainPlacementCursorY = this.terrainPlacementCursorY - terrain.height
  }

  private updateCursorForColumn(terrain: Texture<Resource>) {
    this.terrainPlacementCursorX += terrain.width
  }

  private get maxRows() {
    return Math.floor(this.initWorldHeight / this.terrainRowHeight)
  }

  private getRowByYCoordinate(y: number) {
    return Math.floor(y / this.maxRows)
  }

  // [[0,0,0,0,0,0,0],[1,1,1,1,1,1,1]]
  public build() {
    this.worldMatrix.forEach((row: number[]) => {
      this.initCursorForRow(this.terrainTextures[row[0]])
      row.forEach((textureIndex: number) => {
        const nextTerrain = this.placeNext(textureIndex)
        this.updateCursorForColumn(nextTerrain.sprite.texture)
      })
    })
  }

  public addAnimatedSprite(sprite: ActionSprite) {
    this.animatedSprites.push(sprite)
  }

  public tick() {
    this.animatedSprites.forEach((sprite: ActionSprite) => {
      this.processSpriteInWorld(sprite)
      sprite.tick()
    })
  }
  // this should grab all the animated sprites and call processSpriteInWorld  with them

  public processSpriteInWorld(actionSprite: ActionSprite) {
    const terrainCollisions = this.level.filter((terrain) => {
      return SpriteUtils.intersect(actionSprite.sprite, terrain.sprite)
    })

    if (terrainCollisions.length === 0) {
      // const futureFallCollision = this.level.filter((terrrain: TerrainSprite) => {
      //   const top = terrrain.sprite.y + this.gravity
      //   const left = terrrain.sprite.x
      //   const bottom = top - terrrain.sprite.height
      //   const right = left + terrrain.sprite.width
      //   const { x, y } = actionSprite.sprite
      //   return y <= top && y >= bottom && x >= left && x <= right
      // })
      // const firstContact = futureFallCollision[0]
      // const distance = firstContact !== undefined ? (firstContact.sprite.y - actionSprite.sprite.y) : this.gravity
      actionSprite.fall(1)
      // TODO: ^^^ this would be multiplied by a decimal viscosity if in a permiable terrain like water or gel
      // this would also be cool if the sprite had a "resistance" that could make it fall slower
    } else {
      actionSprite.collide(terrainCollisions)
    }


    // =================== This should all be considered -- adding code above now though ======================
    // I think here if the sprite is in no terrain, or a "permiable" terrain, then it should call fall() on the 
    // controllable sprite and pass in the terrain it's falling through as a param.
    // the controllable sprite can animate accordingly, change speed accordingly, it can track when it started falling
    // if the sprite is hitting a non permiable object, then we can call "collide" on the controllable sprite
    // and pass in the terrain and direction of the collision. That way if we're falling and we collide with something below
    // us we can stop falling, see how far we fell (are we dead?), and animate accordingly.


    // another thing to consider -- who tracks all the animated sprites like enemies and projectiles
    // this should likely be private and be called by tick which is public.
    // tick could then itterate through all the animated sprites calling this function which
    // would compare the passed in sprite against the other animated sprites:
    // e.g. projectile sprite animates into a rock, or into an enemy
    // this brings up the question of order of processing -- 
    // that is you process the player against the other animations
    // then you process an enemy against the player? Is that beneficial?
    // or do you only process with the animated sprite below you in the stack? <<---- this seems correct
    /*
    public Update(delta: number)
{
  if (this.sprite.y >= GameApp.GroundPosition) {
    // if downward acceleration brought us to the ground,
    // stop and set airborne to false
    this.sprite.y = GameApp.GroundPosition;
    this.verticalSpeed = 0;
    this.airborne = false;
  }

  if (this.airborne) {
    // if we are in the air, accelerate downward
    // by increasing the velocity by a constant value
    this.verticalSpeed += delta* 1/3;
  }

  if (GameApp.PressedSpace && !this.airborne) {
    // jump!
    this.airborne = true;
    this.verticalSpeed = -5;
  }

  // remember the delta update!
  // the position will change in accordance to
  // how much time passed and the character's speed
  this.sprite.y += this.verticalSpeed * delta;
}
    */
    return this.getRowByYCoordinate(actionSprite.sprite.y)
  }
}