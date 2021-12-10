
export type ControlKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | ' ' | 'Space'
export class Key {
  public isDown = false;
  public isUp = true;
  private downListener = this.downHandler.bind(this)
  private upListener = this.upHandler.bind(this)

  constructor(
    private key: ControlKey,
    private window: Window & typeof globalThis,
    private disableHold: boolean = false,
    private press?: () => void, // press and release are for function calls that don't happen on a tick
    private release?: () => void,) {
  }

  private downHandler(event: KeyboardEvent) {
    if (event.key === this.key) {
      if (this.press && (this.isUp || (this.isDown && !this.disableHold))) {
        this.press()
      }
      this.isDown = true
      this.isUp = false
      event.preventDefault()
    }
  };

  private upHandler(event: KeyboardEvent) {
    if (event.key === this.key) {
      if (this.isDown && this.release) {
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