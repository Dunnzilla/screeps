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
    var s = Game.getObjectById(creep.memory.repairTargetId);
    if( ! creep.memory.repairTargetId ) { console.log(`${creep.name}: Need new repair target because I have no memory of an old one.`); return true; }
    if( ! s ) { console.log(`${creep.name}: Need new repair target because ${creep.memory.repairTargetId} isn't around any more.'`); return true; }

    if( s.structureType == STRUCTURE_RAMPART ) {
        var rampartRepaired = s.hits > 100000;
         console.log(`${creep.name}: Returning ${rampartRepaired} for ${s} (is its hits greater than 100000)`);
      return s.hits > 100000;
    }
    return ( s.hits >= s.hitsMax );
  },
    pickBestTarget: function(targets) {
        var ramparts = _.filter(targets, (t) => t.structureType == STRUCTURE_RAMPART);
        // If no ramparts, or just 50% of the time, prefer anything other than ramparts.
        if( ! ramparts || ! ramparts.length || Math.random() > 0.5 ) {
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
            console.log(`${creep.name} focusing on repairing ${bt.id}`);
        }
      }
      if( ! creep.memory.repairTargetId || ! Game.structures[creep.memory.repairTargetId] ) {
        return null;
      }
      return Game.getObjectById(creep.memory.repairTargetId);
    },


    run: function(creep) {
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('ð H:4Repair');
        }
        if( ! creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('ð§ repair');
        }

        if(creep.memory.repairing) {
          var rt = this.getRepairTargetStructure(creep);
          if(rt) {
            switch(creep.repair(rt)) {
              case ERR_NOT_IN_RANGE: creep.moveTo(rt); break;
              default: break;
            }
          } else {
            var spawnName = creep.room.find(FIND_MY_SPAWNS)[0].name;
            if(spawnThinker.isWaitingOnMoreEnergy(spawnName)) {
              roleHarvester.runOptimized(creep);
            } else {
              roleUpgrader.run(creep);
            }
            roleHarvester.runOptimized(creep);
          }
        } else {
            cc.stillHarvesting(creep);
        }
    }

};

module.exports = roleRepairMan;
