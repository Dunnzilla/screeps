

var energyThinker = {

  // Moves energy from links which are typically deposit-only and into
  // links which are close to RoomControllers and Towers etc.
  //
  linkPump: function() {
    // hardcode for now
    return Game.getObjectById('59b5826fb0e18a0436e7d76b').transferEnergy(Game.getObjectById('59b2d70dcd3e5c694fee9c21'))

    var scoreById = {};
    var links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
    if(links.length < 2) { return false; }
    /*
    for(var link of links) {

    }
    var sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => {
            return (
              s.structureType == STRUCTURE_LINK &&
              s.energy < s.energyCapacity);
            }
    });
    */

  },
  getNextEnergyStoringMechanism: function(creep) {
      // Find closest of any of these
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_LINK ||
                  structure.structureType == STRUCTURE_CONTAINER ||
                  structure.structureType == STRUCTURE_TOWER) &&
                  structure.energy < structure.energyCapacity;
              }
      });
      // Last preferred: stores. If all other structures are full of energy, start stuffing it into stores.
      if( ! target ) {
          target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (s) => { return ( s.structureType == STRUCTURE_STORAGE &&
                s.storeCapacity > _.sum(s.store)); }}
          );
      }
      return target;
  },

  // Returns nearest object from which a creep can withdraw energy
  getClosestATM: function(creep) {
    var validWithDrawStructures = [STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_CONTAINER];
    /*
    if(creep.memory.role == 'builder') {
        validWithDrawStructures.push(STRUCTURE_EXTENSION);
    }
    */
    
    // TODO Once poplimits are in game memory and not main local: if( spawnThinker.getPopulationPercent() >= 100.0) { validWithDrawStructures.push(STRUCTURE_SPAWN); }
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


  slurp: function(creep, structure) {
    if(structure instanceof Source) {
      return creep.harvest(structure);
    }
    var result = false;

    switch(structure.structureType) {
      case STRUCTURE_STORAGE:
      case STRUCTURE_LINK:
      case STRUCTURE_CONTAINER:
      case STRUCTURE_EXTENSION:
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
