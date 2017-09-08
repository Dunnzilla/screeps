var cc = require('creep.choices');

var spawnThinker = {
    calculateCost: function(bodyParts) {
        return _.reduce(bodyParts, function(sum, n) { return sum + (0+BODYPART_COST[n]); }, 0);
    },

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
        var config = [WORK, CARRY, MOVE, MOVE];
        const extras = [WORK, CARRY, MOVE];
        var newCost = this.calculateCost(config);
        while(newCost < cost) {
          var nextPart = extras[Math.round(Math.random() * extras.length)];
          config.push(nextPart);
          newCost = this.calculateCost(config);
        }
        config.pop();
        return config;
    },


    create: function(spawnName, populationLimits) {
      if(Game.spawns[spawnName].spawning) { return false; }

        const buildOrder = ['harvester', 'upgrader', 'builder', 'repairman', 'shooter', 'claimer'];
        for(var role in buildOrder) {
          const pop = _.filter(Game.creeps, (k) => k.memory.role == role).length;
          if(pop < populationLimits[role]) {
            var body = this.bodyForRole(role, Game.spawns[spawnName].energy);
            var name = `${role}_${(Math.random() * 100000).toString().substring(0, 5);}`;
            console.log(`Creating ${role} role of body ${body}`);
            Game.spawns[spawnName].createCreep(body, name, { role: role });
            return true;
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
