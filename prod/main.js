var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairMan = require('role.repairman');
var roleShooter = require('role.shooter');
var spawnThinker = require('spawn.thinker');
var towerBasic = require('tower.basic');
var roleClaimer = require('role.claimer');

var mm = require('memory.manager');

module.exports.loop = function () {
    mm.clean();

    var populationLimits = {
        harvester: 6,
        builder: 5,
        upgrader: 4,
        repairman: 3,
        shooter: 1,
        claimer: 0
    };

    spawnThinker.cull('Spawn1', populationLimits);
    spawnThinker.create('Spawn1', populationLimits);

    // require('spawn.thinker').create('Spawn1', {harvester: 5})
    towerBasic.run();
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }


    const pctEnergy = (Game.rooms['W22S35'].energyAvailable / Game.rooms['W22S35'].energyCapacityAvailable) * 100.0;

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

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
}
