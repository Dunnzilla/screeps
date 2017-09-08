var cc = require('creep.choices');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_STORAGE
                        ) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Nothing to transfer energy to.  So let's upgrade stuff.
                roleUpgrader.run(creep);
            }
        }
    },
    
    
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
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
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

