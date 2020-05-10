import Phaser from "phaser";
import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

const GROUND_KEY = "ground";
const PLAYER_KEY = "dude";
let STAR_KEY = "star";
const BOMB_KEY = "bomb";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.player = undefined;
    this.cursors = undefined;
    this.platforms = undefined;
    this.stars = undefined;
    this.scoreLabel = undefined;
    this.bombSpawner = undefined;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet(PLAYER_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");
    this.createPlatforms();
    this.createPlayer();
    this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;
    console.log(this.platforms);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(bombsGroup, this.platforms);
    this.physics.add.collider(
      this.player,
      bombsGroup,
      this.hitBomb,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

    this.platforms.create(600, 400, GROUND_KEY);
    this.platforms.create(50, 250, GROUND_KEY);
    this.platforms.create(750, 220, GROUND_KEY);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, PLAYER_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: PLAYER_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  hitBomb(player) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;
  }

  createStars() {
    this.stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreLabel.add(10);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
      this.bombSpawner.spawn(player.x);
    }
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }
}
