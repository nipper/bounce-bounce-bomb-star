import Phaser from "phaser";

import GameScene from "./scenes/first_scene";
import TitleScene from "./scenes/title_scene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [TitleScene, GameScene],
};

export default new Phaser.Game(config);
