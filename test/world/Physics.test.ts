import { Texture } from 'pixi.js'
import { ControllableSprite } from '../../src/sprites/controllableSprite'
import { TerrainSprite } from '../../src/sprites/terrainSprite'
import { PhysicsEngine } from '../../src/world/Physics'

describe('PhysicsEngine', () => {
  const engine = new PhysicsEngine()
  const grass = '../../images/grass1.png'
  const texture = Texture.from(grass)
  const terrain = new TerrainSprite(texture)
  const actionSprite = new ControllableSprite([texture], [texture], window)

  describe('#onGround', () => {
    describe('when the terrain is level with bottom and horizontally aligned', () => {
      beforeEach(() => {
        terrain.sprite.x = 0
        terrain.sprite.y = 20
        terrain.sprite.width = 20
        terrain.sprite.height = 20

        actionSprite.sprite.x = 0
        actionSprite.sprite.y = 0
        actionSprite.sprite.width = 20
        actionSprite.sprite.height = 20
      })

      it('returns true', () => {
        expect(engine.onGround(actionSprite, [terrain])).toBe(true)
      })
    })

    describe('when the terrain is level with bottom but NOT horizontally aligned', () => {
      beforeEach(() => {
        terrain.sprite.x = 21
        terrain.sprite.y = 20
        terrain.sprite.width = 20
        terrain.sprite.height = 20

        actionSprite.sprite.x = 0
        actionSprite.sprite.y = 0
        actionSprite.sprite.width = 20
        actionSprite.sprite.height = 20
      })

      it('returns true', () => {
        expect(engine.onGround(actionSprite, [terrain])).toBe(false)
      })
    })

    describe('when the terrain is NOT level with bottom and NOT horizontally aligned', () => {
      beforeEach(() => {
        terrain.sprite.x = 21
        terrain.sprite.y = 21
        terrain.sprite.width = 20
        terrain.sprite.height = 20

        actionSprite.sprite.x = 0
        actionSprite.sprite.y = 0
        actionSprite.sprite.width = 20
        actionSprite.sprite.height = 20
      })

      it('returns true', () => {
        expect(engine.onGround(actionSprite, [terrain])).toBe(false)
      })
    })

    describe('when the terrain is NOT level with bottom and horizontally aligned', () => {
      beforeEach(() => {
        terrain.sprite.x = 0
        terrain.sprite.y = 21
        terrain.sprite.width = 20
        terrain.sprite.height = 20

        actionSprite.sprite.x = 0
        actionSprite.sprite.y = 0
        actionSprite.sprite.width = 20
        actionSprite.sprite.height = 20
      })

      it('returns true', () => {
        expect(engine.onGround(actionSprite, [terrain])).toBe(false)
      })
    })
  })
})
