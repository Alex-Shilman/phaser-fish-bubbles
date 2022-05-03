import "phaser";
import { GameScene } from "./gameScene";
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

type GameConfig = Phaser.Types.Core.GameConfig;

export const config: GameConfig = {
    type: Phaser.WEBGL,
    title: "FluencyGame",
    width: 1376,
    height: 768,
    parent: "game",
    scene: [GameScene],
    backgroundColor: "#ffffff",
    plugins: {
        global: [ NineSlicePlugin.DefaultCfg ],
    },
    physics: {
        default: "arcade"
    }
};

window.onload = () => new Phaser.Game(config);