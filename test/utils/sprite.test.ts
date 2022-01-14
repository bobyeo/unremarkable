import { Sprite } from 'pixi.js'
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