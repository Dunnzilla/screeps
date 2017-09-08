/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower.basic');
 * mod.thing == 'a thing'; // true
 */

var towerBasic = {
  run: function() {
    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    towers.forEach(function(tower) {
        var myEnergyPct = (tower.energy / tower.energyCapacity) * 100.0;
        if(myEnergyPct > 90.0) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART && structure.hits < 100000
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        
        var hurtAllies = _.filter(Game.creeps, (c) => c.hits < c.hitsMax);
        if(hurtAllies.length > 0) {
            tower.heal(hurtAllies[0]);
        }
    });
    //var tower = Game.getObjectById('59ae3192824efa42450ab015');
    
  }  
};
module.exports = towerBasic;
