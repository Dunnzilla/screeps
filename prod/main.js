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

    towerBasic.run();
    Object.keys(Game.rooms).forEach(function workRoom(roomName ) {
      var room = Game.rooms[roomName];
      var spawns = room.find(FIND_MY_SPAWNS);
      spawns.forEach(function workSpawn(spawn) {

        if(Game.time % 20 == 0) {
            spawnThinker.cull(spawn.name);
            spawnThinker.create(spawn.name);
        }
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            room.visual.text(
                'ð ï¸' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }

        const pctEnergy = (room.energyAvailable / room.energyCapacityAvailable) * 100.0;

        for(var creep of room.find(FIND_MY_CREEPS)) {
            if(spawnThinker.getPopulationPercent(room) < 50.0 && pctEnergy < 75.0) {
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
}
