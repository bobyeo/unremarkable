import { Sprite, Texture } from 'pixi.js'
import { ControllableSprite } from '../../src/sprites/controllableSprite'
import { TerrainSprite } from '../../src/sprites/terrainSprite'
import { SpriteUtils } from '../../src/utils/sprite'

describe('#intersect', ( ) => {
  const mainSprite =  new Sprite()
  const spriteSameHeightWideRight = new Sprite()
  const spriteDirectlyBelow = new Sprite()
  const spriteTouchingBottom = new Sprite()
  const spriteTouchingLeft = new Sprite()
  const spriteTouchingRight = new Sprite()
  const spriteFullIntersection = new Sprite()
  const TESTING_DIMENSION = 20
  const allSprites = [
    mainSprite,
    spriteDirectlyBelow,
    spriteSameHeightWideRight,
    spriteTouchingBottom,
    spriteTouchingLeft,
    spriteTouchingRight,
    spriteFullIntersection
  ]

  beforeAll(() => {
    allSprites.forEach((sprite) => {
      sprite.width = TESTING_DIMENSION
      sprite.height = TESTING_DIMENSION
    })

    spriteSameHeightWideRight.x = TESTING_DIMENSION + 1
    spriteSameHeightWideRight.y = 0

    mainSprite.x = 0,
    mainSprite.y = 0,

    spriteDirectlyBelow.x = 0
    spriteDirectlyBelow.y = TESTING_DIMENSION + 1

    spriteTouchingBottom.x = 0
    spriteTouchingBottom.y = TESTING_DIMENSION

    spriteTouchingRight.x = TESTING_DIMENSION
    spriteTouchingRight.y = 0

    spriteFullIntersection.x = TESTING_DIMENSION / 2
    spriteFullIntersection.y = TESTING_DIMENSION / 2
  })

  it('does not detect a collision with a sprite at same y but outside x', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteSameHeightWideRight)).toBe(false)
  })

  it('does not detect a collision with a sprite outside y but same x', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteDirectlyBelow)).toBe(false)
  })

  it('does detect a collision with an aligned x sprite with touching y', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteTouchingBottom)).toBe(true)
  })

  it('does detect a collision with touching x sprite with aligned y', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteFullIntersection)).toBe(true)
  })

  it('does detect a collision with overlapping sprite', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteTouchingRight)).toBe(true)
  })
})

describe('#possibleIntersect', ( ) => {
  const STEP_SIZE = 15
  const JUMP_SPEED = 20
  const TESTING_DIMENSION = 20
  const CORRECTION_DIMENSION = 5
  const STARTING_X = 0
  const STARTING_Y = 0
  const texture = Texture.from('../../images/grass1.png')

  const mainSprite =  new ControllableSprite([texture],[texture], window, STEP_SIZE, JUMP_SPEED)
  const terrainWithinMovementToRight = new TerrainSprite(texture)
  const allSprites = [
    mainSprite,
    terrainWithinMovementToRight,
  ]

  beforeAll(() => {
    mainSprite.sprite.x = STARTING_X
    mainSprite.sprite.y = STARTING_Y
    terrainWithinMovementToRight.sprite.y = 0

    allSprites.forEach((sprite) => {
      sprite.sprite.width = TESTING_DIMENSION
      sprite.sprite.height = TESTING_DIMENSION
    })

  })

  it('detects a possible collision with sprite to left within range', () => {
    terrainWithinMovementToRight.sprite.x = mainSprite.right + STEP_SIZE - CORRECTION_DIMENSION
    expect(SpriteUtils.possibleIntersect(mainSprite, terrainWithinMovementToRight)).toBe(true)
  })

  it('detects a possible collision with sprite to left already intersecting', () => {
    terrainWithinMovementToRight.sprite.x = mainSprite.right - CORRECTION_DIMENSION
    expect(SpriteUtils.possibleIntersect(mainSprite, terrainWithinMovementToRight)).toBe(true)
  })

  it('does not detect a possible collision with sprite to left outside range', () => {
    terrainWithinMovementToRight.sprite.x = mainSprite.right + STEP_SIZE + CORRECTION_DIMENSION
    expect(SpriteUtils.possibleIntersect(mainSprite, terrainWithinMovementToRight)).toBe(false)
  })

  it('detects a possible collision with sprite to left at exact edge of range', () => {
    terrainWithinMovementToRight.sprite.x = mainSprite.right + STEP_SIZE
    expect(SpriteUtils.possibleIntersect(mainSprite, terrainWithinMovementToRight)).toBe(true)
  })
})