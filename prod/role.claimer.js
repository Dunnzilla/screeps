var cc = require('creep.choices');

var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if( ! Game.flags['Claim'] ) { return; }

        var bestTarget = Game.flags['Claim'];

        creep.say('⭐️');
        var result = creep.claimController(bestTarget);
        switch(result) {
            case ERR_NOT_IN_RANGE: creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#0033FF'}}); break;
            case OK: break;
            default: console.log(`Cannot claim ${bestTarget}: ${result}`); break;
        }
    }
};


module.exports = roleClaimer;
