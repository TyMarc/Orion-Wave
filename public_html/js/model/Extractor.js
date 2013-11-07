var Extractor = Building.extend({
    constructor : function Extractor(id, position, colorId, planet){
        this.planet = planet;
        this.image = new Image();
        this.image.src = "images/Extractor/extractor" + colorId + ".png"
        this.base(id, position, 400, 300, "Extractor", this.image);
        this.currentPod;
        this.pods = [];
        this.collectRate = 100;

        this.podImage = new Image();
        this.podImage.src = "images/pod.png";
        this.podAngle = 0;
    },

    update : function(framerate) {
        this.base(framerate);
        if(this.finish() && this.planet.hydrogen > 0) {
            if(this.currentPod === undefined) {
                this.currentPod = new ResourcePod();
            }
            var value = Math.floor(this.collectRate * framerate / 1000);
            this.planet.hydrogen -= value;
            this.currentPod.hydrogen += value;
            if(this.currentPod.isFull()) {
                this.pods.push(this.currentPod);
                this.currentPod = undefined;
            }
        }
    },

    draw : function(context, camera, selectedUnits) {
        this.base(context, camera, selectedUnits);
        if(camera.isInViewport(this.position, this.image.width, this.image.height)) {
            var c = 0;
            for(var i in this.pods) {
                context.save();
                //context.translate(camera.width-48, 38);
                this.podAngle -= 0.02;
                context.rotate(Math.PI / 180 * this.podAngle + (0.5*c));
                context.drawImage(this.podImage, this.image.width/3 , this.image.height/3);
                context.restore();
                c++;
            }
        }
    }
});