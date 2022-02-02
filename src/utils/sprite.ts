import { Sprite } from '@pixi/sprite';
import { ControllableSprite } from '../sprites/controllableSprite';
import { TerrainSprite } from '../sprites/terrainSprite';

export class SpriteUtils {
  static intersect = (spriteA: Sprite, spriteB: Sprite): boolean => {
    const {y: topA, x: leftA } = spriteA
    const bottomA = topA + spriteA.height
    const rightA = leftA + spriteA.width

    const { x: leftB, y: topB } = spriteB
    const bottomB = topB + spriteB.height
    const rightB = leftB + spriteB.width

    if (leftB > rightA || leftA > rightB || bottomB < topA || bottomA < topB) {
      return false;
    }
    return true
  }

  static possibleIntersect = (actionSprite: ControllableSprite, terrainSprite: TerrainSprite): boolean => {
    if(this.intersect(actionSprite.sprite, terrainSprite.sprite)) {
      return true
    }
    const maxTop = actionSprite.top + actionSprite.jumpSpeed // FIXME: this should divide jumpspeed by terrain's viscosity or whatever we end up calling it
    const maxBottom = actionSprite.bottom + actionSprite.fallSpeed // FIXME: this should divide fallspeed by terrain's viscosity or whatever we end up calling it
    const maxRight = actionSprite.right + actionSprite.stepSize // FIXME: same same
    const maxLeft = actionSprite.left + actionSprite.stepSize // FIXME: same same

    const hitsAbove = terrainSprite.bottom > actionSprite.top && terrainSprite.bottom <= maxTop
    const hitsBelow = terrainSprite.top < actionSprite.bottom && terrainSprite.top >= maxBottom
    const hitsRight = terrainSprite.left > actionSprite.right && terrainSprite.left <= maxRight
    const hitsLeft = terrainSprite.right > actionSprite.left && terrainSprite.left <= maxLeft

    return hitsAbove || hitsBelow || hitsRight || hitsLeft
  }
}