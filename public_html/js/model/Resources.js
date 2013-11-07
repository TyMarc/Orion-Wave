var Resources = Base.extend({
	constructor : function(hydrogen, energy){
        if(hydrogen != undefined){
            this.hydrogen = hydrogen;
        }
        else{
            this.hydrogen = 3000;
        }

        if(energy != undefined){
            this.energy = energy;
        }
        else{
            this.energy = 38000;
        }
    }
});