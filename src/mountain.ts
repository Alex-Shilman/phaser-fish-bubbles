export default class Mountain
{
    private nineslice;

    constructor(scene, x, y, angle, width, height)
    {
        scene.add.existing(this);

        this.nineslice = scene.add.nineslice(
            x, y, width, height, "mountain",
            [15, 15, 15, 15],
        );
        this.nineslice.tint = 0x3E6565;
        this.nineslice.angle = angle;
    }
}