import { ControllableSprite } from '../sprites/controllableSprite'
import { TerrainSprite } from '../sprites/terrainSprite'

export class PhysicsEngine {
  // this should be called after it's determined if the sprite is falling
  // otherwise it would need the surrounding sprites to determine that
  // maybe it should return a "falling box" and a "jumping box" and a "nothing box"?
  // public getPotentialMovementBoundsPolygon(actionSprite:ControllableSprite) {
  //   if()
  // }
  
  // FIXME: this can be optimized to only loop through nearest sprites?
  // FIXME: add back in helpers for top and bottom left and right
  public onGround(actionSprite:ControllableSprite, terrainSprites: TerrainSprite[]): boolean {
    const bottom = actionSprite.sprite.y + actionSprite.sprite.height
    const right = actionSprite.sprite.x + actionSprite.sprite.width
    const left = actionSprite.sprite.x
    const ground = terrainSprites.find((terrain) => {
      const top = terrain.sprite.y
      const terrainRight = terrain.sprite.x + terrain.sprite.width
      const terrainLeft =  terrain.sprite.x
      const aligned = (terrainLeft <= right && right <= terrainRight) || (terrainLeft <= left && left <= terrainRight)

      return (top === bottom) && aligned
    })
    return ground !== undefined
  }

  // this should be moved to world
  public processSprites(actionSprite: ControllableSprite, terrainSprites: TerrainSprite[]) {
    // determine if we're falling currently
    if(!this.onGround(actionSprite, terrainSprites)) {
      actionSprite.falling = true
      actionSprite.jumping = false
      actionSprite.tryJump = false
    }

    const potentialMoveBounds = this.getPotentialMoveBoundsPolygon(actionSprite)
    // check intersections
    // build a hit matirx like in world
  }

  public getPotentialMoveBoundsPolygon(actionSprite: ControllableSprite): SAT.Polygon {
    let { height, width, x, y } = actionSprite.sprite
    if(actionSprite.falling) {
      height = height + actionSprite.fallSpeed
    } else if(actionSprite.tryJump) {
      height = height + actionSprite.jumpSpeed
      y = y - actionSprite.jumpSpeed
    }

    if(actionSprite.tryMoveRight) {
      width = width + actionSprite.stepSize
    } else if (actionSprite.tryMoveLeft) {
      width = width + actionSprite.stepSize
      x = x - actionSprite.stepSize
    }
    const position = new SAT.Vector(x, y)
    const box = new SAT.Box(position, width, height)

    return box.toPolygon()
  }
}