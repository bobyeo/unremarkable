import { Sprite, Texture } from 'pixi.js'
import { ControllableSprite } from '../../src/sprites/controllableSprite'
import { TerrainSprite } from '../../src/sprites/terrainSprite'
import { SpriteUtils } from '../../src/utils/sprite'

describe('#isColliding', ( ) => {
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
    spriteTouchingBottom.y = TESTING_DIMENSION - 1 // should rename this test sprite as it takes a 1 pixel overlap to "collide"

    spriteTouchingRight.x = TESTING_DIMENSION - 1 // should rename this test sprite as it takes a 1 pixel overlap to "collide"
    spriteTouchingRight.y = 0

    spriteFullIntersection.x = TESTING_DIMENSION / 2
    spriteFullIntersection.y = TESTING_DIMENSION / 2
  })

  it('does not detect a collision with a sprite at same y but outside x', () => {
    expect(SpriteUtils.isColliding(mainSprite, spriteSameHeightWideRight)).toBe(false)
  })

  it('does not detect a collision with a sprite outside y but same x', () => {
    expect(SpriteUtils.isColliding(mainSprite, spriteDirectlyBelow)).toBe(false)
  })

  it('does detect a collision with an aligned x sprite with touching y', () => {
    expect(SpriteUtils.isColliding(mainSprite, spriteTouchingBottom)).toBe(true)
  })

  it('does detect a collision with touching x sprite with aligned y', () => {
    expect(SpriteUtils.isColliding(mainSprite, spriteFullIntersection)).toBe(true)
  })

  it('does detect a collision with overlapping sprite', () => {
    expect(SpriteUtils.isColliding(mainSprite, spriteTouchingRight)).toBe(true)
  })
})