var cc = require('creep.choices');

var roleShooter = {

    // require('role.builder').pickBestTarget(Game.rooms['W22S35'].find(FIND_CONSTRUCTION_SITES))
    /*
    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        if( ! ramparts || ! ramparts.length ) {
            return targets[0];
        }
        return ramparts[0];
    },
    */

    pickBestTarget: function(targets) { return targets[0]; },
    
    /** @param {Creep} creep **/
    run: function(creep) {

            var targets = creep.room.find(FIND_HOSTILE_CREEPS);
            if(targets.length) {
                var bestTarget = this.pickBestTarget(targets);
                var result = creep.rangedAttack(bestTarget);
                // creep.say('💥');
                switch(result) {
                    case ERR_NOT_IN_RANGE: creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#ff6666'}}); break;
                    case OK: break;
                    default: console.log(`Cannot shoot ${bestTarget}: ${result}`); break;
                }
            } else {
                // Nothing to build so let's repair.
                // TODO make a series of fallback behaviors.
                // rolePatrol.run(creep);
                 // creep.say('🤔');
            }

    }
};


module.exports = roleShooter;
