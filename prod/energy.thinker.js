var energyThinker = {
  // Returns nearest object from which a creep can withdraw energy
  getClosestATM: function(creep) {
    var validWithDrawStructures = [STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_CONTAINER];
    return creep.pos.findClosestByRange(FIND_STRUCTURES,
      { filter: (s) => { return _.indexOf(validWithDrawStructures, s.structureType) && s.isActive() } });
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
  }
};

module.exports = energyThinker;
