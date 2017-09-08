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
    bodyForRole: function(role, cost) {
        return [MOVE, MOVE, WORK, CARRY];
    },


    create: function(spawnName, populationLimits) {
        const buildOrder = ['harvester', 'upgrader', 'builder', 'repairman', 'shooter', 'claimer'];
        for(var role in buildOrder) {
          const pop = _.filter(Game.creeps, (k) => k.memory.role == 'repairman').length;
          if(pop < populationLimits[role]) {
            var body = this.bodyForRole(role, 300);
            var name = undefined;
            console.log(`Creating ${role}` role of body ${body});
            Game.spawns[spawnName].createCreep(body, name, { role: role });
            return true;
          } else {
            console.log('Plenty of ${role} (${populationLimits[role]})');
          }
        }
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
