var energyThinker = {
  getNextEnergyStoringMechanism: function(creep) {
      // Find closest of any of these
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_CONTAINER ||
                  structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
              }
      });
      // Last preferred: stores. If all other structures are full of energy, start stuffing it into stores.
      if( ! target ) {
          target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (s) => { return ( s.structureType == STRUCTURE_STORAGE && s.storeCapacity > _.sum(s.store)); }}
          );
      }
      return target;
  },

  // Returns nearest object from which a creep can withdraw energy
  getClosestATM: function(creep) {
    var validWithDrawStructures = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER];
    return creep.pos.findClosestByRange(FIND_STRUCTURES,
      { filter: (s) => {
        return _.indexOf(validWithDrawStructures, s.structureType) != -1 &&
          s.isActive() &&
          ((s.energy && s.energy > 0)
           ||
           (s.store && s.store.energy > 0)
          )
      } });
  },
  structureIsASource: function(s) {
    return (s && s.energy > 0 && ! s.structureType);
  },


  slurp: function(creep, structure) {
    if(this.structureIsASource(structure)) {
      return creep.harvest(structure);
    }
    var result = false;
    switch(structure.structureType) {
      case STRUCTURE_STORAGE:
      case STRUCTURE_LINK:
      case STRUCTURE_CONTAINER:
        result = creep.withdraw(structure, RESOURCE_ENERGY);
        break;
      default:
        console.log(`You asked ${creep.name} to slurp ${structure} but that is not something I know how to get energy from.`);
        break;
    }
    return result;
  }
};

module.exports = energyThinker;
