var cc = require('creep.choices');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    getNextEnergyStoringMechanism: function(creep) {
        // Find closest of any of these
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
        });
        // Last preferred: stores. If all other structures are full of energy, start stuffing it into stores.
        if( ! target ) {
            target = creep.room.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => { return ( s.structureType == STRUCTURE_STORAGE && s.storeCapacity > _.sum(s.store)); }}
            );
        }
        return target;
    },

    /** @param {Creep} creep **/
    runOptimized: function(creep) {
        if(creep.memory.transferring && creep.carry.energy == 0) {
            creep.memory.transferring = false;
            creep.say('🔄 H:4Xfer');
        }
        if( ! creep.memory.transferring && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.transferring = true;
            creep.say('🚧 xfer');
        }
        
        if( creep.memory.transferring ) {
            // TODO Save xfer ID and move to it
            // Game.creeps['Harvester_762db1'].pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER });
            // // get target
            var target = this.getNextEnergyStoringMechanism(creep);
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

