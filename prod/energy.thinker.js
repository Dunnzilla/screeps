var energyThinker = {
  // Returns nearest object from which a creep can withdraw energy
  getClosestATM: function(creep) {
    var validWithDrawStructures = [STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_CONTAINER];
    creep.pos.findClosestByRange(FIND_STRUCTURES,
      { filter: (s) => { return _.indexOf(validWithDrawStructures, s.structureType) && s.isActive() } })
  }
};

module.exports = energyThinker;
