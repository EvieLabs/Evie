/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

// Include discord.js ShardingManger
const { ShardingManager } = require('discord.js');

// Create your ShardingManger instance
const manager = new ShardingManager('index.js', {
	// for ShardingManager options see:
	// https://discord.js.org/#/docs/main/v12/class/ShardingManager
	totalShards: 'auto',
	token: 'ODk1ODA4NTg2NzQyMTI0NjE1.YV98wg.L0G6V6EpOUTIg2R5ulJ3BvsOxVo',
});

// Emitted when a shard is created
manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));

// Spawn your shards
manager.spawn();