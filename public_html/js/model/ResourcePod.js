var ResourcePod = Base.extend({
    constructor : function Extractor(hydrogen) {
        this.maxCapacity = 1000;
        this.hydrogen = 0;
    },

    isFull : function() {
        var full = false;
        if(this.hydrogen >= this.maxCapacity) {
            this.hydrogen =  this.maxCapacity;
            full = true;
        }
        return full;
    }
});