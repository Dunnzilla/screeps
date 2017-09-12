/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.choices');
 * mod.thing == 'a thing'; // true
 */

var energyThinker = require('energy.thinker');

var creepChoices = {
    rankSources: function(room) {
        var sources = room.find(FIND_SOURCES);
        var sucklers = [];
        sources.forEach(function (source,ndx) {
           sucklers[ndx] = Game.creeps[Object.keys(Game.creeps)[0]].room.lookForAtArea(LOOK_CREEPS,source.pos.y-2,source.pos.x-2,source.pos.y+2,source.pos.x+2,true).length;
        });
        var best = -1;
        var bestNdx = 0;
        sources.forEach(function(source,ndx) {
            if(best == -1 || sucklers[ndx] < best) {
                best = sucklers[ndx];
                bestNdx = ndx;
            }
            console.log(`Next source: ${source.pos.x},${source.pos.y} with ${sucklers[ndx]} suckling`);
        });
        var s = sources[bestNdx];
        console.log(`Returning source ${s}, from ndx ${bestNdx}, at position ${s.pos.x},${s.pos.y}`);
        return s;
    },

    pickBestSource: function(creep) {
        var bestSource = null;
        if( creep.memory.preferredSource && creep.memory.preferredSource !== null ) {
            bestSource = Game.getObjectById(creep.memory.preferredSource);
            if( ! bestSource ) {
                bestSource = this.rankSources(creep.room);
            }
        } else {
            bestSource = this.rankSources(creep.room);
            if( ! bestSource ) {
                creep.say('!!!!!!');
                console.log(`Could not get *any* best source for ${creep.name}`);
            }
            console.log(`Creep ${creep.name} has new preferred source: ${bestSource}`);
            creep.memory.preferredSource = bestSource.id;
        }
        return bestSource;
    },
    creepUsesATM: function(creep) {
      // const rolesWhoUseATMs = ['upgrader', 'builder', 'repairman'];
      const rolesWhoUseATMs = ['builder', 'repairman'];
      return _.indexOf(rolesWhoUseATMs, creep.memory.role) !== -1;
    },

    stillHarvesting: function(creep) {
        if(creep.carry.energy >= creep.carryCapacity) {
            return false;
        }
        var bestSource = undefined;
        if(this.creepUsesATM(creep)) {
          bestSource = energyThinker.getClosestATM(creep);
        }
        if( ! bestSource ) {
          bestSource = this.pickBestSource(creep);
        }
        if( ! bestSource ) { console.log(`Could not find best source for ${creep.name} to slurp`); return; }

        switch(energyThinker.slurp(creep, bestSource)) {
          case ERR_NOT_IN_RANGE:
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            break;
          default:
          break;
        }
        return true;
    }

};
module.exports = creepChoices;
