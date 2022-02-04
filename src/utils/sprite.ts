import { Sprite } from '@pixi/sprite';
import { ControllableSprite } from '../sprites/controllableSprite';
import { TerrainSprite } from '../sprites/terrainSprite';

export class SpriteUtils {
  static isColliding = (spriteA: Sprite, spriteB: Sprite) => {
    const spriteABounds = spriteA.getBounds()
    const spriteBBounds = spriteB.getBounds()

    return spriteABounds.x < spriteBBounds.x + spriteBBounds.width
        && spriteABounds.x + spriteABounds.width > spriteBBounds.x
        && spriteABounds.y < spriteBBounds.y + spriteBBounds.height
        && spriteABounds.y + spriteABounds.height > spriteBBounds.y
  }
}