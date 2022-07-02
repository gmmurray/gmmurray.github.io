import { CREDIT_SCENE_KEY } from '../constants';

const lineHeight = 15;

const fontFamily = 'Monospace';
const fontSize = `${lineHeight}px`;

export class CreditsScene extends Phaser.Scene {
  private _texts = ['asuhdude', 'asuhdude', 'asuhdude'];
  private _textContainer: Phaser.GameObjects.Container;
  private _screenDimension: number = 0;
  private _showScrollingText = false;
  constructor() {
    super(CREDIT_SCENE_KEY);
  }

  public create = () => {
    this._screenDimension = this.cameras.main.width / 2;

    const textObjects = this._texts.map((text, index) =>
      this.add
        .text(0, index * lineHeight, text, { fontSize, fontFamily })
        .setOrigin(0.5),
    );

    this._textContainer = this.add
      .container(this._screenDimension, this._screenDimension, textObjects)
      .setVisible(false);

    const introText = this.add
      .text(
        this._screenDimension,
        this._screenDimension,
        `Thank you for playing my game`,
        { fontFamily, fontSize: `${lineHeight * 3}px` },
      )
      .setOrigin(0.5);

    this.time.delayedCall(5000, () => {
      introText.destroy();
      this._textContainer.setVisible(true);
      this._showScrollingText = true;
    });
  };

  public update = () => {
    if (this._showScrollingText) {
      this._moveScrollingText();
    }
  };

  private _moveScrollingText = () => {
    if (
      this._textContainer &&
      this._textContainer.y > -this._calculateContainerHeight()
    ) {
      this._textContainer.setY(this._textContainer.y - 0.75);
    }
  };

  private _calculateContainerHeight = () => this._texts.length * lineHeight;
}
