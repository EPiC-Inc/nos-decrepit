var cmdFile = require("./commands.json");
var cmdLabel = cmdFile.label;
var cmdList = cmdFile.commands;

module.exports = {
	// Functions that use commands
	getCommandID: function(cmd) {
		return cmd.id
	},
	getCommandScope: function(cmd) {
		/*
		NOT YET IMPLEMENTED
		-1 = admins only
		0 = everyone
		*/
		return cmd.scope;
	},
	getCommandHelp: function(cmd) {
		return cmd.help;
	},
	getCommandHelp: function(cmd) {
		return cmd.help;
	},
	getCommandDescription: function(cmd) {
		return cmd.desc;
	},
	
	// Function that use data
	getCommandArguments: function(data) {
		var cmdArgs = data.split(" ");
		cmdArgs[0] = cmdArgs[0].substring(cmdLabel.length);
		return cmdArgs;
	},
	getCommand: function(data) {
		var cmd = cmdList[this.getCommandArguments(data)[0]];
		if(cmd.alias !== undefined) return cmdList[cmd.alias];
		return cmd;
	},
	isCommand: function(data) {
		if(data.startsWith(cmdLabel)) {
			var temp = this.getCommand(data);
			return temp !== null && temp !== undefined;
		}
		return false;
	}
}












