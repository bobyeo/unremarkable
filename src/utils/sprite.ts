import { Sprite } from '@pixi/sprite';

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
}