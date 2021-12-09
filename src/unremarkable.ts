import { Application, AnimatedSprite, utils, Rectangle } from 'pixi.js'
import { ControllablleSprite } from './sprites/controllableSprite';
import { SideScrollingWorld } from './world/SideScrollingWorld';

const DEFAULT_GRAVITY = 10
//Create a Pixi Application
let app = new Application({ width: 256, height: 256 });
let { loader, renderer, stage, view } = app
renderer.backgroundColor = 0xe1eff6;
autoResize();
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(view);
loader
  .add('images/domoFull.json')
  .add('images/terrain.json')
  .load(setup);
let id
let terrainId
let controllableDomo: ControllablleSprite
let world: SideScrollingWorld

function setup() {
  terrainId = loader.resources["images/terrain.json"].textures
  if (terrainId) {
    const rock1 = terrainId['rock1.png']
    const rock2 = terrainId['rock2.png']
    const grass1 = terrainId['grass1.png']
    world = new SideScrollingWorld([rock1, rock2, grass1], [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ], window, DEFAULT_GRAVITY)
    world.build()
  }

  id = loader.resources["images/domoFull.json"].textures
  if (id) {
    const walk1 = id['walk1.png']
    const walk2 = id['walk2.png']
    const walk3 = id['walk3.png']
    const walkRight = [walk1, walk2, walk3]
    const walk4 = id['walk4.png']
    const walk5 = id['walk5.png']
    const walk6 = id['walk6.png']
    const walkLeft = [walk4, walk5, walk6]
    controllableDomo = new ControllablleSprite(walkRight, walkLeft, window, 1)

    controllableDomo.listen()
    controllableDomo.sprite.animationSpeed = .1
    world.addAnimatedSprite(controllableDomo)
  }
  const sprites = world.level.map(terrain => terrain.sprite)
  const actionSprites = world.animatedSprites.map(actionSprite => actionSprite.sprite)
  stage.addChild(...sprites, ...actionSprites)
  renderer.render(app.stage);
  app.ticker.add(delta => spriteLoop(delta));
}

function spriteLoop(delta: number) {
  world.tick(delta)
}

function autoResize() {
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.resize(window.innerWidth, window.innerHeight);
}