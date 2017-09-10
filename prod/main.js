var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairMan = require('role.repairman');
var roleShooter = require('role.shooter');
var spawnThinker = require('spawn.thinker');
var towerBasic = require('tower.basic');
var roleClaimer = require('role.claimer');
var energyThinker = require('energy.thinker');

var mm = require('memory.manager');

module.exports.loop = function () {
    mm.clean();
    if(Game.time % 10 == 0) { energyThinker.linkPump(); }

    var populationLimits = {
        harvester: 6,
        builder: 5,
        upgrader: 4,
        repairman: 3,
        shooter: 1,
        claimer: 0
    };
    Game.rooms.forEach(function workRoom(room) {
      var spawns = room.find(FIND_MY_SPAWNS);
      spawns.forEach(function workSpawn(spawn) {
        spawnThinker.cull(spawn.name, populationLimits);
        spawnThinker.create(spawn.name, populationLimits);
        towerBasic.run();
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }

        const pctEnergy = (room.energyAvailable / room.energyCapacityAvailable) * 100.0;

        for(var creep of room.find(FIND_MY_CREEPS)) {
            if(spawnThinker.getPopulationPercent(populationLimits) < 50.0 && pctEnergy < 75.0) {
                roleHarvester.runOptimized(creep);
            } else {
                switch(creep.memory.role) {
                    case 'claimer': roleClaimer.run(creep); break;
                    case 'harvester': roleHarvester.runOptimized(creep); break;
                    case 'upgrader': roleUpgrader.run(creep); break;
                    case 'builder': roleBuilder.run(creep); break;
                    case 'repairman': roleRepairMan.run(creep); break;
                    case 'shooter': roleShooter.run(creep); break;
                }
            }
        }
      });
    });

    // require('spawn.thinker').create('Spawn1', {harvester: 5})
    }
}
