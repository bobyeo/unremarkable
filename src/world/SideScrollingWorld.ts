import { System, TBody } from 'detect-collisions'
import { Resource, Texture } from 'pixi.js'
import { ControllableSprite } from '../sprites/controllableSprite'
import { TerrainSprite } from '../sprites/terrainSprite'

interface ICollisionDirections {
  top: boolean,
  bottom: boolean,
  right: boolean,
  left: boolean
}

interface ICollisionOverlaps {
  top?: number,
  bottom?: number,
  right?: number,
  left?: number
}
export class SideScrollingWorld {
  public level: TerrainSprite[] = []
  public readonly animatedSprites: ControllableSprite[] = []
  private terrainPlacementCursorX = 0
  private terrainPlacementCursorY = this.window.innerHeight
  private trackingSystem: System

  // NOTE: World coordinates: 
  // Upper left: 0,0
  // Bottom left: 0, window height
  // Bottom right: window width, window height
  // Top right: window width, 0
  constructor(private terrainTextures: Texture<Resource>[], private worldMatrix: number[][], private window: Window & typeof globalThis, private gravity: number) {
    this.trackingSystem = new System()
  }

  private placeNext(spriteIndex: number, row: number, column: number) {
    const nextTerrain = new TerrainSprite(this.terrainTextures[spriteIndex], row, column)
    nextTerrain.sprite.x = this.terrainPlacementCursorX
    nextTerrain.sprite.y = this.terrainPlacementCursorY
    this.level.push(nextTerrain)
    this.trackingSystem.insert(nextTerrain.polygon)
    return nextTerrain
  }

  private initCursorForRow(terrain: Texture<Resource>) {
    this.terrainPlacementCursorX = 0
    this.terrainPlacementCursorY = this.terrainPlacementCursorY - terrain.height
  }

  private updateCursorForColumn(terrain: Texture<Resource>) {
    this.terrainPlacementCursorX += terrain.width
  }

  // [[0,0,0,0,0,0,0],[1,1,1,1,1,1,1]]
  public build() {
    this.worldMatrix.forEach((row: number[], rowNumber: number) => {
      this.initCursorForRow(this.terrainTextures[row[0]])
      row.forEach((textureIndex: number, colNumber: number) => {
        const nextTerrain = this.placeNext(textureIndex, rowNumber, colNumber)
        this.updateCursorForColumn(nextTerrain.sprite.texture)
      })
    })
  }

  public addAnimatedSprite(sprite: ControllableSprite) {
    this.animatedSprites.push(sprite)
    this.trackingSystem.insert(sprite.polygon)
  }

  public tick(delta: number) {
    this.animatedSprites.forEach((sprite: ControllableSprite) => {
      this.processSpriteInWorld(sprite, delta)
      sprite.tick(delta)
    })
  }

  private processCollisions(actionSprite: ControllableSprite, collisionOverlaps: ICollisionOverlaps) {
    // process horizontal attempt -- you can't move both left and right
    if (actionSprite.tryMoveRight) {
      actionSprite.sprite.x = collisionOverlaps.right ? (actionSprite.sprite.x - collisionOverlaps.right) : actionSprite.potentialHorizontalMovement
    } else if (actionSprite.tryMoveLeft) {
      actionSprite.sprite.x = collisionOverlaps.left ? (actionSprite.sprite.x - collisionOverlaps.left) : actionSprite.potentialHorizontalMovement
    }

    // process jump attempt -- does the world physics allow jumping when you're falling? should this be an else if with landing
    if(actionSprite.tryJump) {
      actionSprite.sprite.y = collisionOverlaps.top ? (actionSprite.sprite.y - collisionOverlaps.top - 1) : actionSprite.potentialVerticalMovement
      actionSprite.jumping = true
    }

    //process landing
    if(collisionOverlaps.bottom) {
      actionSprite.sprite.y -= collisionOverlaps.bottom
      actionSprite.falling = false
      actionSprite.jumping = false
    }
    actionSprite.polygon.pos.x = actionSprite.sprite.x
    actionSprite.polygon.pos.y = actionSprite.sprite.y
  }

  private getCollisionOverlapsFromSystemResponse(response: SAT.Response, collisionOverlaps: ICollisionOverlaps): ICollisionOverlaps {
    if (response.overlapV.y > 1) {
      collisionOverlaps.bottom = Math.max(response.overlapV.y, collisionOverlaps.bottom || 0)
    }
    if (response.overlapV.y < -1) {
      collisionOverlaps.top = Math.min(response.overlapV.y, collisionOverlaps.top || 0)
    }
    if (response.overlapV.x < -1) {
      collisionOverlaps.left = Math.min(response.overlapV.x, collisionOverlaps.left || 0)
    }
    if (response.overlapV.x > 1) {
      collisionOverlaps.right = Math.max(response.overlapV.x, collisionOverlaps.right || 0)
    }
    return collisionOverlaps
  }

  public processSpriteInWorld(actionSprite: ControllableSprite, delta: number) {
    const calculate = actionSprite.falling || actionSprite.tryJump || actionSprite.tryMoveLeft || actionSprite.tryMoveRight
    if (calculate) {
      const x = actionSprite.potentialHorizontalMovement
      const y = actionSprite.potentialVerticalMovement
      actionSprite.polygon.setPosition(x, y)
      this.trackingSystem.update()
      const potentials = this.trackingSystem.getPotentials(actionSprite.polygon)
      const overlaps = potentials.reduce((overlap, potential) => {
        if (this.trackingSystem.checkCollision(actionSprite.polygon, potential) && this.trackingSystem.response.overlap) {
          return this.getCollisionOverlapsFromSystemResponse(this.trackingSystem.response, overlap)
        }
        return overlap
      }, {} as ICollisionOverlaps)
      const colliding = overlaps.left || overlaps.right || overlaps.top || overlaps.bottom

      if (colliding) {
        this.processCollisions(actionSprite, overlaps)
        this.trackingSystem.update()
      } else {
        actionSprite.sprite.x = x
        actionSprite.sprite.y = y
        actionSprite.falling = true
      }
    }
  }
}