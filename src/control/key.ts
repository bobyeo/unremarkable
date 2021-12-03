export class Key {
  public isDown = false;
  public isUp = true;
  private downListener = this.downHandler.bind(this)
  private upListener = this.upHandler.bind(this)

  constructor(
    private key: string,
    private press: () => void,
    private release: () => void,
    private onTick: () => void,
    private window: Window & typeof globalThis,
    private disableHold: boolean = false) {
  }

  public tick() {
    this.onTick()
  }

  private downHandler(event: KeyboardEvent) {
    if (event.key === this.key) {
      if (this.isUp || (this.isDown && !this.disableHold)) {
        this.press()
      }
      this.isDown = true
      this.isUp = false
      event.preventDefault()
    }
  };

  private upHandler(event: KeyboardEvent) {
    if (event.key === this.key) {
      if (this.isDown) {
        this.release()
      }
      this.isDown = false
      this.isUp = true
      event.preventDefault()
    }
  };

  public unsubscribe() {
    this.window.removeEventListener("keydown", this.downListener);
    this.window.removeEventListener("keyup", this.upListener);
  }

  public subscribe() {
    window.addEventListener(
      "keydown", this.downListener, false
    );
    window.addEventListener(
      "keyup", this.upListener, false
    )
  }
}