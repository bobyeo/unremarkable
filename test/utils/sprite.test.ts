import { Sprite } from 'pixi.js'
import { SpriteUtils } from '../../src/utils/sprite'

describe('#intersect', ( ) => {
  const mainSprite =  new Sprite()
  const spriteSameHeightWideRight = new Sprite()
  const spriteDirectlyBelow = new Sprite()
  beforeAll(() => {
    spriteSameHeightWideRight.height = 20
    spriteSameHeightWideRight.width = 20
    spriteSameHeightWideRight.x = 21
    spriteSameHeightWideRight.y = 0
    mainSprite.x = 0,
    mainSprite.y = 0,
    mainSprite.height = 20,
    mainSprite.width =20
    spriteDirectlyBelow.height = 20
    spriteDirectlyBelow.width = 20
    spriteDirectlyBelow.x = 0
    spriteDirectlyBelow.y = 21
  })

  it('does not detect a collision with a sprite at same y but outside x', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteSameHeightWideRight)).toBe(false)
  })

  it('does not detect a collision with a sprite outside y but same x', () => {
    expect(SpriteUtils.intersect(mainSprite, spriteDirectlyBelow)).toBe(false)
  })
})