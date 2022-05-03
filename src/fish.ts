export default class Fish extends Phaser.GameObjects.Container
{
    private bodySprite:Phaser.Physics.Arcade.Sprite;
    private mouthSprite:Phaser.Physics.Arcade.Sprite;
    private eyeContainer:Phaser.GameObjects.Container;
    private tailSprite:Phaser.Physics.Arcade.Sprite;
    private upperFinSprite:Phaser.Physics.Arcade.Sprite;
    private lowerFinSprite:Phaser.Physics.Arcade.Sprite;
    private text:Phaser.GameObjects.Text;
    private eyeDirection:number;
    private eyeSpeed:number = 2;

    constructor(scene, x, y)
    {
        super(scene);
        scene.add.existing(this);
        [
            'setUpSprites', 
            'setUpUpperFin', 
            'setUpLowerFin', 
            'setUpTail', 
            'setUpEye', 
            'setUpNumberText'
        ].forEach(method => this[method](scene, x, y));
        
    }

    setUpSprites = (scene, x, y) => {
        this.bodySprite = scene.add.sprite(x, y, "fishBody");
        this.add(this.bodySprite);
        this.mouthSprite = scene.add.sprite(x - 175, y, "fishMouth");
        this.add(this.mouthSprite);
    }

    setUpUpperFin = (scene, x, y) => {
        var finFrameNames = scene.anims.generateFrameNames("tailAndFinAnimations", {
            start: 1, end: 25, zeroPad: 0,
            prefix: "topFin1_", suffix: ".png"
        });
        var backFinFrameNames = scene.anims.generateFrameNames("tailAndFinAnimations", {
            start: 25, end: 1, zeroPad: 0,
            prefix: "topFin1_", suffix: ".png"
        });
        scene.anims.create({ key: "fin", frames: finFrameNames, frameRate: 20, repeat: 0 });
        scene.anims.create({ key: "backFin", frames: backFinFrameNames, frameRate: 20, repeat: 0 });
        this.upperFinSprite = scene.add.sprite(x - 25, y - 160, "fishFin0");
        this.add(this.upperFinSprite);
        this.upperFinSprite.anims.play("fin");
        this.upperFinSprite.on("animationcomplete", this.changeUpperFinAnimation, this);
    }

    setUpLowerFin = (scene, x, y) => {
        this.lowerFinSprite = scene.add.sprite(x, y + 155, "fishFin0");
        this.lowerFinSprite.angle = 180;
        this.lowerFinSprite.scaleX *= -1;
        this.add(this.lowerFinSprite);
        this.lowerFinSprite.anims.play("fin");
        this.lowerFinSprite.on("animationcomplete", this.changeLowerFinAnimation, this);
    }

    setUpTail = (scene, x, y) => {
        const [ tailFrameNames, backTailFrameNames ] = [{ start: 1, end: 25 }, { start: 25, end: 1 }].map(({ start, end}) => 
        scene.anims.generateFrameNames("tailAndFinAnimations", {
            start, end, zeroPad: 0,
            prefix: "tail1_", suffix: ".png"
        }));
    
        [
            { key: "tail", frames: tailFrameNames, frameRate: 20, repeat: 0 }, 
            { key: "backTail", frames: backTailFrameNames, frameRate: 20, repeat: 0 }
        ].forEach(({...props}) => scene.anims.create({...props}))
        
        this.tailSprite = scene.add.sprite(x + 165, y - 15, "fishTail0");
        this.add(this.tailSprite);
        this.tailSprite.anims.play("tail");
        this.upperFinSprite.on("animationcomplete", this.changeTailAnimation, this);
    }

    setUpNumberText = (scene, x, y) => {
        const value = Phaser.Math.Between(0, 9);
        const style = { font: "96px OmnesSemibold", fill: "#000000", wordWrap: true, wordWrapWidth: 100, align: "center" };
        this.text = scene.add.text(x - 75, y, value, style);
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;
        this.add(this.text);
    }

    setUpEye = (scene, x, y) => {
        this.eyeContainer = scene.add.container(x - 175, y - 25);
        const outerEyeSprite = scene.add.sprite(0, 0, "circle");
        outerEyeSprite.scale = 0.75;
        outerEyeSprite.tint = 0xCCCCCC;
        this.eyeContainer.add(outerEyeSprite);
        const innerEyeSprite = scene.add.sprite(-5, 0, "circle");
        innerEyeSprite.scale = 0.5;
        innerEyeSprite.tint = 0x000000;
        this.eyeContainer.add(innerEyeSprite);
        this.add(this.eyeContainer);
        this.eyeDirection = 1;
    }

    update()
    {
        this.eyeContainer.angle += this.eyeDirection * this.eyeSpeed;
        if (this.eyeDirection == 1 && this.eyeContainer.angle >= 90)
        {
            this.eyeDirection = -1;
        }
        else if (this.eyeDirection == -1 && this.eyeContainer.angle <= -90)
        {
            this.eyeDirection = 1;
        }
    }

    changeUpperFinAnimation() {
        const { anims } = this.upperFinSprite;
        anims.play(anims.currentAnim.key === "fin" ? "backFin" : "fin");
    }

    changeLowerFinAnimation() {
        const { anims } = this.lowerFinSprite;
        anims.play(anims.currentAnim.key === "fin" ? "backFin" : "fin");
    }

    changeTailAnimation() {
        const { anims } = this.tailSprite;
        anims.play(anims.currentAnim.key === "tail" ? "backTail" : "tail");
    }
}