var cc = require('creep.choices');

var spawnThinker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 H4:Upgrade');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ Upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
        } else {
            cc.stillHarvesting(creep);
        }
    },

    cull: function(populationLimits) {
        return false;
    },

    create: function(populationLimits) {
        const buildOrder = ['harvester', 'upgrader', 'builder', 'repairman', 'shooter', 'claimer'];
        buildOrder.forEach(function buildIf(role) {
          const pop = _.filter(Game.creeps, (k) => k.memory.role == 'repairman').length;
          if(pop < populationLimits[role]) {
            
          }
        });
        return false;
    },

    isWaitingOnMoreEnergy: function(spawnName) {
        return true;
    },

    getPopulationPercent: function(populationLimits) {
        return 100.0;
    }

};

module.exports = spawnThinker;
