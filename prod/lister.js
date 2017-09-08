/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('lister');
 * mod.thing == 'a thing'; // true
 */

var lister = {
    creepSummary: function(creep) {
        var summary = `${creep.name}: Role ${creep.memory.role}, ${creep.body.length}-long body, ${creep.hits}/${creep.hitsMax}HP`;
        if(creep.carry) {
            summary += ' I[';
            for(var key of Object.keys(creep.carry)) {
                summary += `${key}:${creep.carry[key]}`;
            }
            summary += ']';
        }
        return summary;
    },
    report: function() {
        for(var name in Game.rooms) {
            console.log(`Room ${name}: (${Game.rooms[name].energyAvailable}/${Game.rooms[name].energyCapacityAvailable})E`);
        }
        for(var key of Object.keys(Game.creeps)) {
           console.log(this.creepSummary(Game.creeps[key])); 
        }
    }
};

module.exports = lister;

