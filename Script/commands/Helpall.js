function _0x3787(key, offset) {
    const arr = _0x1cee();
    return _0x3787 = function(k, o) {
        k = k - 0xad3;
        return arr[k];
    }, _0x3787(key, offset);
}

function _0x1cee() {
    const strings = [
        'ceil', 'values', 'configModule', 'has', 'forEach', 'help',
        'createRead', 'client', 'random', 'moduleInfo', 'commands',
        'usages', 'cooldowns', 'envConfig', 'autoUnsend', 'delayUnsend',
        'sendMessage', 'attachment', 'messageID', 'threadID', 'api'
    ];
    _0x1cee = function() { return strings; };
    return strings;
}

const _0x4bc721 = _0x3787;

// Module info
module.exports.config = {
    name: 'help',
    version: '1.0.2',
    hasPermission: 0,
    credits: 'Bot Author',
    description: 'Command helper module',
    commandCategory: 'utilities',
    usages: 'help [command]',
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

// Text translations
module.exports.languages = {
    en: {
        moduleInfo: 'This module helps users see available commands and their usage.',
        helpList: 'Use "help [command]" to get detailed information about a command.',
        user: 'User commands',
        adminGroup: 'Admin group commands',
        adminBot: 'Admin bot commands'
    }
};

// Handle event function
module.exports.handleEvent = function({ api, event, getText }) {
    const { body, threadID, messageID } = event;
    if (!body || typeof body !== 'string') return;

    // Extract command
    const args = body.slice(1).trim().split(/\s+/);
    if (!args.length) return;

    // Fetch command info
    const { commands } = global.client;
    const commandName = args[0].toLowerCase();
    const commandData = commands.get(commandName);
    if (!commandData) return;

    const msg = getText(
        'Module info:\nName: ' + commandData.name +
        '\nUsage: ' + commandData.usages
    );

    api.sendMessage({
        body: msg
    }, threadID, messageID);
};

// Handle command execution
module.exports.run = function({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const { commands } = global.client;

    if (!args[0]) {
        // List all commands
        let commandList = '';
        for (const [name] of commands) {
            commandList += '• ' + name + '\n';
        }
        api.sendMessage({
            body: 'Available commands:\n' + commandList
        }, threadID, messageID);
    } else {
        // Show specific command help
        const cmd = commands.get(args[0].toLowerCase());
        if (!cmd) return;
        const msg = getText(
            'Command: ' + cmd.name + '\nUsage: ' + cmd.usages
        );
        api.sendMessage({
            body: msg
        }, threadID, messageID);
    }
};
