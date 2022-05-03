import "phaser";
import Bubble from "./bubble";
import Fish from "./fish";
import Mountain from "./mountain";
import {config} from "./app";

export class GameScene extends Phaser.Scene 
{
    private width;
    private height;
    private bubbleIndex:integer = -1;
    private fish:Fish;
    private bubbles:Bubble[];
    private bubbleSFX:Phaser.Sound.BaseSound;
    private tabKey:Phaser.Input.Keyboard.Key;

    constructor() 
    {
        super({
            key: "GameScene"
        });

        this.width = config.width;
        this.height = config.height;
    }

    init(params): void 
    {
        
    }

    preload(): void 
    {
        this.load.image("bubble", "dist/sprites/imgBubble.png");
        this.load.image("mountain", "dist/sprites/roundedCorner.png");
        this.load.image("seaFloor", "dist/sprites/tileableTexture.png")
        this.load.image("fishBody", "dist/sprites/body1.png");
        this.load.image("fishMouth", "dist/sprites/mouthIdle00.png");
        this.load.image("circle", "dist/sprites/circle.png");
        this.load.image("sparkle", "dist/sprites/sparkle_1.png")
        this.load.audio("bubbleSound", "dist/audio/NodesMerge.mp3");
        this.load.multiatlas("tailAndFinAnimations", "dist/animations/fishSpriteSheet.json", "dist/animations");
    }
  
    create(): void 
    {
        // SFX
        this.bubbleSFX = this.sound.add("bubbleSound");

        // background
        const texture = this.textures.createCanvas("gradient", this.width, this.height);
        const context = texture.getContext();
        const grd = context.createLinearGradient(0, 0, 0, 256);    // ERROR LINE
        grd.addColorStop(0, '#91F6FA');
        grd.addColorStop(1, '#68B3B6');
        context.fillStyle = grd;
        context.fillRect(0, 0, this.width, this.height);
        this.add.image(this.width / 2, this.height / 2, "gradient");
        texture.refresh();

        // mountains
        new Mountain(this, 400, 400, 35, 500, 300);
        new Mountain(this, 500, 500, 5, 1000, 200);
        new Mountain(this, 250, 500, 35, 200, 200);
        new Mountain(this, 75, 600, -20, 200, 200);
        new Mountain(this, -25, 575, 0, 200, 200);
        new Mountain(this, 1175, 575, -20, 300, 200);

        // sea floor
        this.add.tileSprite(this.width / 2, this.height + 250, this.width, this.height, "seaFloor");
        
        // fish
        this.fish = new Fish(this, this.width / 2 + 400, this.height / 2);

        // bubbles
        this.bubbles = [];
        this.addBubble(300, 200);
        this.addBubble(450, 300);
        this.addBubble(475, 650);
        this.addBubble(925, 150);

        // keyboard input
        this.input.keyboard.on("keydown", this.handleKeyboardEvent.bind(this));
        this.tabKey = this.input.keyboard.addKey('TAB', true);
    }

    handleKeyboardEvent(event)
    {
        if (this.tabKey.isDown)
        {
            event.enableCapture = true;
            if (this.bubbleIndex >= 0)
            {
                this.bubbles[this.bubbleIndex].unhighlight();
            }
            this.bubbleIndex++;
            if (this.bubbleIndex >= this.bubbles.length)
            {
                this.bubbleIndex = 0;
            }
            this.bubbles[this.bubbleIndex].highlight();
        }
        else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER)
        {
            if (this.bubbleIndex < 0)
                return;

            this.bubbles[this.bubbleIndex].select();
        }
        else if (this.bubbleIndex >= 0 && this.bubbles[this.bubbleIndex].selected)
        {
            let moveVector:Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT)
            {
                moveVector.x = -1;
            }
            else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP)
            {
                moveVector.y = -1;
            }
            else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT)
            {
                moveVector.x = 1;
            }
            else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN)
            {
                moveVector.y = 1;
            }
            this.bubbles[this.bubbleIndex].move(moveVector);
        }
    }

    update(time): void 
    {
        this.bubbles.forEach(bubble => {
            if (bubble.sprite != null)
                bubble.update(time);
        });

        this.fish.update();
    }

    addBubble(x, y):Bubble
    {
        let bubble = new Bubble(this, this.physics, x, y);

        // add collisions to other bubbles
        this.bubbles.forEach(otherBubble => {
            this.physics.add.overlap(bubble.sprite, otherBubble.sprite, this.bubbleHitBubble.bind(this));
        });

        this.bubbles.push(bubble);
        return bubble;
    }

    bubbleHitBubble(bubble1, bubble2)
    {
        if (bubble1.bubble.dragEndTimer <= 0 && bubble2.bubble.dragEndTimer <= 0)
            return;

        // reset bubble highlight
        if (this.bubbleIndex >= 0)
        {
            this.bubbles[this.bubbleIndex].unhighlight();
            this.bubbleIndex = -1;
        }

        // find the 2nd bubble in the array and remove it from the array
        let bubble2Index = -1;
        let bubbleCounter = 0;
        this.bubbles.forEach(bubble => {
            if (bubble == bubble2.bubble)
            {
                bubble2Index = bubbleCounter;
            }
            bubbleCounter++;
        });
        if (bubble2Index >= 0)
        {
            this.bubbles.splice(bubble2Index, 1);
        }

        // make bubble1 value == bubble1 + bubble2 and remove bubble2
        bubble1.bubble.incValue(bubble2.bubble.value);
        bubble2.bubble.destroy();
        bubble1.bubble.pop();

        this.bubbleSFX.play();
    }
};