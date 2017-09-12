var cc = require('creep.choices');
var energyThinker = require('energy.thinker');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    runOptimized: function(creep) {
        if(creep.memory.transferring && creep.carry.energy == 0) {
            creep.memory.transferring = false;
            creep.say('ð H:4Xfer');
        }
        if( ! creep.memory.transferring && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.transferring = true;
            creep.say('ð§ xfer');
        }

        if( creep.memory.transferring ) {
            var target = energyThinker.getNextEnergyStoringMechanism(creep);
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // No targets, so let's do upgrades until there are some xfer targets.
                roleUpgrader.run(creep);
            }
        } else {
            cc.stillHarvesting(creep);
        }
    }
};

module.exports = roleHarvester;
