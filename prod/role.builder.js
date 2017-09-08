var cc = require('creep.choices');
var roleRepairMan = require('role.repairman');
var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    // require('role.builder').pickBestTarget(Game.rooms['W22S35'].find(FIND_CONSTRUCTION_SITES))
    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        if( ! ramparts || ! ramparts.length ) {
            return targets[0];
        }
        return ramparts[0];
    },
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 H:4Build');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var bestTarget = this.pickBestTarget(targets);
                if(creep.build(bestTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Nothing to build so let's upgrade.
                // TODO make a series of fallback behaviors.
                roleUpgrader.run(creep);
            }
        }
        else {
            cc.stillHarvesting(creep);
        }
    }
};

module.exports = roleBuilder;

