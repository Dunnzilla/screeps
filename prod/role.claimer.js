var cc = require('creep.choices');

var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
      // If I have manually set a Claim flag, run all Claimers to it.
      if( Game.flags['Claim'] ) {
        creep.moveTo(Game.flags['Claim'].pos, {visualizePathStyle: {stroke: '#0033FF'}});
      }

      creep.say('â­ï¸');
      var bestTarget = Game.flags['Claim'].pos.findClosestByRange(
          FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTROLLER }
      );
      if( ! bestTarget ) { return; }

      var result = creep.claimController(bestTarget);
      switch(result) {
          case ERR_NOT_IN_RANGE:
            creep.moveTo(bestTarget.pos, {visualizePathStyle: {stroke: '#00FF00'}});
            break;
          case OK:
            console.log('--- Claimed! ---');
            break;
          default:
            console.log(`Cannot claim ${bestTarget}: ${result}`);
          break;
      }
    }
};


module.exports = roleClaimer;
