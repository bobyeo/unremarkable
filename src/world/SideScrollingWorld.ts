import { System } from 'detect-collisions'
import { Resource, Texture } from 'pixi.js'
import { ControllableSprite } from '../sprites/controllableSprite'
import { TerrainSprite } from '../sprites/terrainSprite'

interface ICollisionDirections {
  top: boolean,
  bottom: boolean,
  right: boolean,
  left: boolean
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

  private processCollision(actionSprite: ControllableSprite, response: SAT.Response) {
    const collisionDrections = this.getCollisionDirectionFromSystemResponse(response)
    // process horizontal attempt -- you can't move both left and right
    if (actionSprite.tryMoveRight) {
      actionSprite.sprite.x = collisionDrections.right ? (actionSprite.sprite.x - response.overlapV.x) : actionSprite.potentialHorizontalMovement
    } else if (actionSprite.tryMoveLeft) {
      actionSprite.sprite.x = collisionDrections.left ? (actionSprite.sprite.x - response.overlapV.x) : actionSprite.potentialHorizontalMovement
    }

    // process jump attempt -- does the world physics allow jumping when you're falling? should this be an else if with landing
    if(actionSprite.tryJump) {
      actionSprite.sprite.y = collisionDrections.top ? (actionSprite.sprite.y - response.overlapV.y - 1) : actionSprite.potentialVerticalMovement
    }

    //process landing
    if(collisionDrections.bottom) {
      actionSprite.sprite.y -= response.overlapV.y - 1
      actionSprite.falling = false
    }
    actionSprite.polygon.pos.x = actionSprite.sprite.x
    actionSprite.polygon.pos.y = actionSprite.sprite.y
  }

  private getCollisionDirectionFromSystemResponse(response: SAT.Response): ICollisionDirections {
    const collisionDirections = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    }
    if (response.overlapV.y > 1) {
      collisionDirections.bottom = true
    }
    if (response.overlapV.y < -1) {
      collisionDirections.top = true
    }
    if (response.overlapV.x < -1) {
      collisionDirections.left = true
    }
    if (response.overlapV.x > 1) {
      collisionDirections.right = true
    }
    return collisionDirections
  }

  public processSpriteInWorld(actionSprite: ControllableSprite, delta: number) {
    const calculate = actionSprite.falling || actionSprite.tryJump || actionSprite.tryMoveLeft || actionSprite.tryMoveRight
    if (calculate) {
      const x = actionSprite.potentialHorizontalMovement
      const y = actionSprite.potentialVerticalMovement
      actionSprite.polygon.setPosition(x, y)
      this.trackingSystem.update()
      const potentials = this.trackingSystem.getPotentials(actionSprite.polygon)
      if (potentials.length > 0) {
        potentials.forEach((potentialCollider) => {
          if (this.trackingSystem.checkCollision(actionSprite.polygon, potentialCollider)) {
            if (this.trackingSystem.response.overlap) {
              this.processCollision(actionSprite, this.trackingSystem.response)
              this.trackingSystem.update()
            } else {
              actionSprite.sprite.x = x
              actionSprite.sprite.y = y
              actionSprite.falling = true
            }
          } 
        })
      } else {
        actionSprite.sprite.x = x
        actionSprite.sprite.y = y
        actionSprite.falling = true
      }
    }
  }
}