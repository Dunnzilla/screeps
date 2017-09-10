var cc = require('creep.choices');

var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        var bestTarget = Game.getObjectById('5982fd1cb097071b4adbec43');
        if(bestTarget) {
            creep.say('⭐️');
            var result = creep.claimController(bestTarget);
            switch(result) {
                case ERR_NOT_IN_RANGE: creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#0033FF'}}); break;
                case OK: break;
                default: console.log(`Cannot claim ${bestTarget}: ${result}`); break;
            }
        } else {
             creep.say('🤔');
        }

    }
};


module.exports = roleClaimer;
