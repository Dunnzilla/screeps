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
  doesNeedNewTarget: function(creep) {
    if( ! creep.memory.repairTargetId ) { return true; }
    if( ! Game.structures[creep.memory.repairTargetId] ) { return true; }
    var s = Game.structures[creep.memory.repairTargetId];

    if( s.structureType == STRUCTURE_RAMPART ) {
      return s.hits > 100000;
    }
    return ! ( s.hits < s.hitsMax );
  },
    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        if( ! ramparts || ! ramparts.length || Math.random() > 0.5 ) {  // If no ramparts, or just 50% of the time, prefer anything other than ramparts.
            return targets[0];
        }
        return ramparts[0];
    },

    getRepairTargetStructure: function(creep) {
      if(this.doesNeedNewTarget(creep)) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        targets.sort((a,b) => a.hits - b.hits);

        if(targets.length > 0) {
            // console.log(`Moving to ${targets[0]} for repairs`);
            var bt = this.pickBestTarget(targets);
            creep.memory.repairTargetId = bt.id;
            creep.say(`💾T:${bt.name}`);
        }
      }
      if( ! creep.memory.repairTargetId || ! Game.structures[creep.memory.repairTargetId] ) {
        return null;
      }
      return Game.structures[creep.memory.repairTargetId];
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
          var rt = this.getRepairTargetStructure(creep);
          if(rt) {
            switch(creep.repair(rt)) {
              case ERR_NOT_IN_RANGE: creep.moveTo(rt); break;
              default: break;
            }
          } else {
            if(spawnThinker.isWaitingOnMoreEnergy('Spawn1')) {
              roleHarvester.runOptimized(creep);
            } else {
              roleUpgrader.run(creep);
            }
          }
        } else {
            cc.stillHarvesting(creep);
        }
    }

};

module.exports = roleRepairMan;
