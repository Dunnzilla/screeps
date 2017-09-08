var cc = require('creep.choices');

var roleClaimer = {

    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        if( ! ramparts || ! ramparts.length ) {
            return targets[0];
        }
        return ramparts[0];
    },

    pickBestTarget: function(targets) { return targets[0]; },
    
    /** @param {Creep} creep **/
    run: function(creep) {

        var bestTarget = Game.getObjectById('5982fd1cb097071b4adbec43');
        if(bestTarget) {
            creep.say('⭐️');
            var result = creep.claimController(bestTarget);
            switch(result) {
                case ERR_NOT_IN_RANGE: creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#0033FF'}}); break;
                case OK: break;
                default: console.log(`Cannot claim ${bestTarget}: ${result}`); break;
            }
        } else {
             creep.say('🤔');
        }

    }
};


module.exports = roleClaimer;
