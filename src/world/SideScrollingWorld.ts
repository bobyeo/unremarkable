import { System } from 'detect-collisions'
import { Resource, systems, Texture } from 'pixi.js'
import { ControllableSprite } from '../sprites/controllableSprite'
import { TerrainSprite } from '../sprites/terrainSprite'

type CollisionDirection = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
export class SideScrollingWorld {
  public level: TerrainSprite[] = []
  public readonly animatedSprites: ControllableSprite[] = []
  private terrainPlacementCursorX = 0
  private terrainPlacementCursorY = this.window.innerHeight
  private readonly initWorldHeight = this.window.innerHeight
  private terrainRowHeight = 0
  private trackingSystem: System

  // NOTE: World coordinates: 
  // Upper left: 0,0
  // Bottom left: 0, window height
  // Bottom right: window width, window height
  // Top right: window width, 0
  constructor(private terrainTextures: Texture<Resource>[], private worldMatrix: number[][], private window: Window & typeof globalThis, private gravity: number) {
    // assume all terrain blocks are the same height for now
    this.terrainRowHeight = this.terrainTextures[0].height
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

  private processCollision(actionSprite: ControllableSprite, response: SAT.Response) {
    switch(this.getCollisionDirectionFromSystemResponse(response)) {
      case 'BOTTOM':
        actionSprite.falling = false
        break
      case 'TOP':
        break 
      case 'LEFT':
        break 
      case 'RIGHT':
        break 
    }
    actionSprite.sprite.x -= response.overlapV.x
    actionSprite.polygon.pos.x = actionSprite.sprite.x
    actionSprite.sprite.y -= response.overlapV.y
    actionSprite.polygon.pos.y = actionSprite.sprite.y
  }

  // TODO: determine what effect it has to prefer vertical hits to horizontal
  private getCollisionDirectionFromSystemResponse(response: SAT.Response): CollisionDirection {
    if (response.overlapV.y > 0) {
      return 'BOTTOM'
    }
    if (response.overlapV.y < 0) {
      return 'TOP'
    }
    if (response.overlapV.x < 0) {
      return 'LEFT'
    }
    return 'RIGHT'
  }

  public processSpriteInWorld(actionSprite: ControllableSprite, delta: number) {
    const calculate = actionSprite.falling || actionSprite.tryJump || actionSprite.tryMoveLeft || actionSprite.tryMoveRight
    if (calculate) {
      const x = actionSprite.potentialHorizontalMovement
      const y = actionSprite.potentialVerticalMovement
      actionSprite.polygon.setPosition(x, y)
      this.trackingSystem.update()
      this.trackingSystem.getPotentials(actionSprite.polygon).forEach((potentialCollider) => {
        if (this.trackingSystem.checkCollision(actionSprite.polygon, potentialCollider)) {
          if (this.trackingSystem.response.a.tag === 'action') {
            if (this.trackingSystem.response.overlap) {
              this.processCollision(actionSprite, this.trackingSystem.response)
              this.trackingSystem.update()
            } else {
              actionSprite.sprite.x = x
              actionSprite.sprite.y = y
              actionSprite.falling = true
            }
          }
        }
      })
    }
  }
}