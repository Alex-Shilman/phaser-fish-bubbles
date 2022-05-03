import { Physics } from "phaser";

export default class Bubble
{
    public sprite;
    public value:integer;
    public dragging:Boolean;
    public selected:Boolean = false;
    public dragEndTimer:number;

    private particles:Phaser.GameObjects.Particles.ParticleEmitterManager;
    private emitter:Phaser.GameObjects.Particles.ParticleEmitter;
    private text:Phaser.GameObjects.Text;
    private scene;
    private speed:integer = 20;

    constructor(scene, physics, x, y)
    {
        this.scene = scene;
        this.sprite = physics.add.sprite(x, y, "bubble");
        this.sprite.bubble = this;
        
        this.value = Phaser.Math.Between(0, 9);
        const style = { font: "48px OmnesSemibold", fill: "#ff0000", wordWrap: true, wordWrapWidth: this.sprite.width, align: "center" };
        this.text = scene.add.text(x, y, this.value, style);
        this.setTextPosition(x, y);

        this.sprite.setScale(0.75);

        // drag
        this.sprite.setInteractive();
        scene.input.setDraggable(this.sprite);
        this.sprite.on("pointerdown", this.dragStart.bind(this));
        this.sprite.on("pointerup", this.dragEnd.bind(this));
        this.sprite.on("drag", (pointer, dragX, dragY) => {
            this.sprite.x = dragX;
            this.sprite.y = dragY;
            this.setTextPosition(dragX, dragY);
        });

        // physics
        this.setVelocity();
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1);

        this.dragEndTimer = 0;

        // particles
        this.particles = scene.add.particles("sparkle");
    }

    setTextPosition(x, y)
    {
        this.text.x = x - this.text.width / 2;
        this.text.y = y - this.text.height / 2;
    }

    update(time)
    {
        this.setTextPosition(this.sprite.x, this.sprite.y);
        if (this.emitter != null)
        {
            this.emitter.setPosition(this.sprite.x, this.sprite.y);
        }
        if (this.dragEndTimer > 0)
            this.dragEndTimer -= time;
    }

    move(moveVector)
    {
        this.sprite.x += moveVector.x * this.speed;
        this.sprite.y += moveVector.y * this.speed;
    }

    setVelocity()
    {
        this.sprite.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    dragStart()
    {
        this.dragging = true;
        this.sprite.setVelocity(0, 0);
    }

    dragEnd()
    {
        this.dragging = false;
        this.setVelocity();
        this.dragEndTimer = 0.5;
    }

    incValue(increment)
    {
        this.value += increment;
        this.text.setText(this.value.toString());
    }

    pop()
    {
        this.emitter = this.particles.createEmitter({
            x: this.sprite.x,
            y: this.sprite.y,
            speed: 200,
            lifespan: 600,
            blendMode: "SCREEN",
            scale: { start: 1, end: 0 }
        });
        this.scene.time.delayedCall(500, this.endParticles, [], this);
    }

    endParticles()
    {
        this.emitter.on = false;
    }

    destroy()
    {
        this.sprite.destroy();
        this.text.destroy();
    }

    highlight()
    {
        this.sprite.tint = 0x00FF00;
    }

    unhighlight()
    {
        this.sprite.tint = 0xFFFFFF;
    }

    select()
    {
        this.selected = !this.selected;

        if (this.selected)
        {
            this.sprite.tint = 0xFF0000;
            this.sprite.setVelocity(0, 0);
        }
        else
        {
            this.sprite.tint = 0xFFFFFF;
            this.setVelocity();
            this.dragEndTimer = 0.5;
        }
    }
}