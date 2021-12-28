import { Sprite } from 'pixi.js'
import { SpriteUtils } from '../../src/utils/sprite'

describe('#intersect', ( ) => {
  const spriteA = {
    x: 0,
    y: 0,
    height: 20,
    width: 20
  }
  it('detects a collision', () => {
    expect(SpriteUtils.intersect(spriteA as Sprite, spriteA as Sprite)).toBe.bind(true)
  })
})