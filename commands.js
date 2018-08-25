var cmdFile = require("./commands.json");
var cmdLabel = cmdFile.label;
var cmdList = cmdFile.commands;

module.exports = {
	getCommandLabel: function() {
		return cmdLabel;
	},
	getCommandList: function() {
		return cmdList;
	},
	getNumberOfCommands: function() {
		return cmdFile.num_commands;
	},
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
	getCommandDescription: function(cmd) {
		return cmd.desc;
	},
	
	// Function that use data
	stripLabel: function(m) {
		return m.substring(cmdLabel.length);
	},
	getCommandArguments: function(data) {
		var cmdArgs = data.split(" ");
		if(cmdArgs[0].startsWith(cmdLabel)) cmdArgs[0] = this.stripLabel(cmdArgs[0]);
		return cmdArgs;
	},
	getCommand: function(data) {
		var cmd = this.getRawCommand(data);
		if(cmd !== undefined && cmd.alias !== undefined) return cmdList[cmd.alias];
		return cmd;
	},
	getRawCommand: function(data) {
		return cmdList[this.getCommandArguments(data)[0]];
	},
	isCommand: function(data) {
		if(data.startsWith(cmdLabel)) {
			var temp = this.getCommand(data);
			return temp !== null && temp !== undefined;
		}
		return false;
	}
}












