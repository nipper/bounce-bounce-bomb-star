import Phaser from "phaser";
import game from "../main.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("title-scene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("star", "assets/star.png");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.title_text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "Bounce Bounce Bomb Star",
      {
        font: "64px Arial",
      }
    );

    let bounds = this.title_text.getBounds();
    this.subtitle = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + bounds.height / 2 - 10,
      "a game by Sam, Adam & Elliot",
      {
        font: "20px Arial",
      }
    );
    this.subtitle.setDepth(1);
    this.title_text.x = this.cameras.main.centerX - bounds.width / 2;
    this.title_text.y = this.cameras.main.centerY - bounds.height / 2;
    this.title_text.setDepth(2);
    this.title_background = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      bounds.width + 20,
      bounds.height + 20,
      "0x709DF6",
      0.8
    );
    this.title_background.setDepth(0);

    this.title_text.setInteractive();
    this.createStars();

    this.physics.add.collider(this.stars, this.stars);

    this.input.keyboard.once("keydown_ENTER", () => {
      game.scene.start("game-scene");
    });
  }
  createStars() {
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(1.0);
      child.setBounceX(1.0);
      child.setCollideWorldBounds(true);
      child.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200)
      );
    });
  }

  update() {}
}
