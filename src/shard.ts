/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

// Include discord.js ShardingManger
const { ShardingManager } = require('discord.js');
const token = process.env.PORT

// Create your ShardingManger instance
const manager = new ShardingManager('index.js', {
	// for ShardingManager options see:
	// https://discord.js.org/#/docs/main/v12/class/ShardingManager
	totalShards: 'auto',
	token: token,
});

// Emitted when a shard is created
manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));

// Spawn your shards
manager.spawn();