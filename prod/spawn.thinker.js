var spawnThinker = {
    populationLimits: {
      harvester: 6,
      builder: 5,
      upgrader: 4,
      repairman: 0,
      shooter: 1,
      claimer: 0
    },
    calculateCost: function(bodyParts) {
        return _.reduce(bodyParts, function(sum, n) { return sum + (0+BODYPART_COST[n]); }, 0);
    },

    cull: function() {
      // TODO kill surplus creeps
      return false;
    },
    bodyForRole: function(role, cost) {
        var basePerRole = {
            builder: [WORK, CARRY, MOVE],
            claimer: [TOUGH, CLAIM, MOVE],
            harvester: [WORK, CARRY, MOVE],
            healer: [TOUGH, MOVE, HEAL, HEAL, TOUGH, HEAL, MOVE, MOVE],
            repairman: [WORK, CARRY, MOVE],
            shooter: [TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, MOVE],
            upgrader: [WORK, CARRY, MOVE]
        };

        const extrasPerRole = {
            builder: [WORK, CARRY, MOVE],
            claimer: [TOUGH, MOVE],
            harvester: [WORK, CARRY, MOVE],
            healer: [HEAL, TOUGH, MOVE],
            repairman: [WORK, CARRY, MOVE],
            shooter: [RANGED_ATTACK, TOUGH, MOVE],
            upgrader: [WORK, CARRY, MOVE]
        };
        var config = basePerRole[role];
        var newCost = this.calculateCost(config);
        var addedAny = false;
        while(newCost <= cost) {
          var nextPart = extrasPerRole[role][Math.round(Math.random() * extrasPerRole[role].length)];
          config.push(nextPart);
          newCost = this.calculateCost(config);
          console.log(`New cost for ${role} would be ${cost} for parts ${config}`);
          addedAny = true;
        }
        if(addedAny) { config.pop(); }
        return config;
    },

    getSpawnEnergyAvailable: function(spawnName) {
      return Game.spawns[spawnName].room.energyAvailable;
    },
    generateName: function(role) {
      const rn = (Math.random() * 100000).toString().substring(0, 5);
      return `${role}_${rn}`;
    },
    create: function(spawnName) {
      if(Game.spawns[spawnName].spawning) { return -2; }
      if(this.isWaitingOnMoreEnergy(spawnName)) { return -1; }

        const buildOrder = ['harvester', 'upgrader', 'builder', 'repairman', 'shooter', 'claimer'];
        for(var role of buildOrder) {
          const pop = this.countCreeps(role);
          if(pop < this.populationLimits[role]) {
            console.log(`Need another ${role} (We have ${pop})`);
            var body = this.bodyForRole(role, this.getSpawnEnergyAvailable(spawnName));
            var name = this.generateName(role);
            console.log(`Creating ${role} role of body ${body}: ${name}`);
            var result = Game.spawns[spawnName].createCreep(body, name, { role: role });
            return ( result == OK );
          }
        }
        return -3;
    },
    // TODO : if(defenseMinister.underAttack()) { return true; }

    isWaitingOnMoreEnergy: function(spawnName) {
      console.log(`${spawnName} harvesters ${this.countCreeps('harvester')} and pop % ${this.getPopulationPercent(Game.spawns[spawnName].room)} and room energy % ${this.getRoomEnergyPercent(Game.spawns[spawnName].room)}`);

      if(this.getPopulationPercent() < 50.0) { return false; }
      if(this.countCreeps('upgrader') < 1) { return false; }
      if(this.countCreeps('harvester') < this.populationLimits['harvester']) { return false; }

      return (this.getRoomEnergyPercent(Game.spawns[spawnName].room) < 70.0);
    },

    countCreeps: function(role) {
      if( ! role ) { return Object.keys(Game.creeps).length; }
      return _.filter(Game.creeps, (k) => k.memory.role == role).length;
    },


    // Returns 0.0 to 100.0
    getRoomEnergyPercent: function(room) {
      return (room.energyAvailable / room.energyCapacityAvailable) * 100.0;
    },
    getPopulationPercent: function(room) {
      var popMax = _.reduce(this.populationLimits, function(sum, n) { return sum + (0+n); }, 0);
      if(popMax < 0) { popMax = 1; }
      return ( this.countCreeps() / popMax ) * 100.0;
    }

};

module.exports = spawnThinker;
