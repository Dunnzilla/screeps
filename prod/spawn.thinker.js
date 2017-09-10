var cc = require('creep.choices');

var spawnThinker = {
    calculateCost: function(bodyParts) {
        return _.reduce(bodyParts, function(sum, n) { return sum + (0+BODYPART_COST[n]); }, 0);
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
          console.log(`New cost for ${role} would be ${cost} for parts ${config}`);
        }
        config.pop();
        return config;
    },

    getSpawnEnergyAvailable: function(spawnName) {
      return Game.spawns[spawnName].room.energyAvailable;
    },
    generateName: function(role) {
      const rn = (Math.random() * 100000).toString().substring(0, 5);
      return `${role}_${rn}`;
    },
    create: function(spawnName, populationLimits) {
      if(Game.spawns[spawnName].spawning) { return false; }
      if(this.isWaitingOnMoreEnergy(spawnName)) { return false; }

        const buildOrder = ['harvester', 'upgrader', 'builder', 'repairman', 'shooter', 'claimer'];
        for(var role of buildOrder) {
          const pop = this.countCreeps(role);
          if(pop < populationLimits[role]) {
            console.log(`Need another ${role} (We have ${pop})`);
            var body = this.bodyForRole(role, this.getSpawnEnergyAvailable(spawnName));
            var name = this.generateName(role);
            console.log(`Creating ${role} role of body ${body}: ${name}`);
            var result = Game.spawns[spawnName].createCreep(body, name, { role: role });
            return ( result == OK );
          }
        }
        return false;
    },
    // TODO : if(defenseMinister.underAttack()) { return true; }

    isWaitingOnMoreEnergy: function(spawnName) {
      // If we have harvesters and are > 50% population
      // then let's wait for more energy.
      if(this.countCreeps('harvester') < 1) { return false; }
      if(this.getPopulationPercent() < 50.0) { return false; }
      return (this.getRoomEnergyPercent(Game.spawns[spawnName].room) < 100.0);
    },

    countCreeps: function(role) {
      if( ! role ) { return Object.keys(Game.creeps).length; }
      return _.filter(Game.creeps, (k) => k.memory.role == role).length;
    },


    // Returns 0.0 to 100.0
    getRoomEnergyPercent: function(room) {
      return (room.energyAvailable / room.energyCapacityAvailable) * 100.0;
    },
    getPopulationPercent: function(spawnName, populationLimits) {
      var popMax = _.reduce(populationLimits, function(sum, n) { return sum + (0+n); }, 0);
      if(popMax < 0) { popMax = 1; }
      return ( this.countCreeps() / popMax ) * 100.0;
    }

};

module.exports = spawnThinker;
