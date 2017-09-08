/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairman');
 * mod.thing == 'a thing'; // true
 */
var cc = require('creep.choices');
var roleUpgrader = require('role.upgrader');
var spawnThinker = require('spawn.thinker');
var roleHarvester = require('role.harvester');

var roleRepairMan = {
    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        if( ! ramparts || ! ramparts.length || Math.random() > 0.5 ) {  // If no ramparts, or just 50% of the time, prefer anything other than ramparts.
            return targets[0];
        }
        return ramparts[0];
    },

    run: function(creep) {
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 H:4Repair');
        }
        if( ! creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }
        
        if(creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            
            if(targets.length > 0) {
                // console.log(`Moving to ${targets[0]} for repairs`);
                var bt = this.pickBestTarget(targets);
                if(bt && creep.repair(bt) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bt);
                }
            } else {
                if(spawnThinker.isWaitingOnMoreEnergy('Spawn1')) {
                    roleHarvester.runOptimized(creep);
                }
                roleUpgrader.run(creep);
            }
        } else {
            cc.stillHarvesting(creep);
        }

    }
    
};

module.exports = roleRepairMan;
