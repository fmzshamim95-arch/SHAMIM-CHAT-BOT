// Stylish modern help module for a chat-bot
// Signature appended automatically: "𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭"

// --------- CONFIG ----------
export const config = {
  name: 'help',
  version: '2.0.0',
  hasPermission: 0,
  credits: 'Shamim',
  description: 'Styled help & command list module',
  commandCategory: 'Utilities',
  usages: 'help [command|page]',
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20 // seconds
  }
};

// --------- LANGUAGES ----------
export const languages = {
  en: {
    moduleInfo: 'Show commands and usage in a stylish format.',
    helpList: 'Usage: help [command] — shows details for a command',
    footer: 'Powered by 𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭'
  },
  bn: {
    moduleInfo: 'স্টাইলিশ ভাবে কমান্ড ও ব্যবহার দেখায়।',
    helpList: 'ব্যবহার: help [command] — নির্দিষ্ট কমান্ডের বিবরণ',
    footer: 'Powered by 𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭'
  }
};

// --------- Helpers ----------
const pad = (s, n = 2) => String(s).padEnd(n, ' ');
const sig = '𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭'; // global signature used everywhere

const makeCommandCard = (cmd) => {
  // cmd is expected to have: name, usages, description, author (optional)
  const title = `» ${cmd.name.toUpperCase()} «`;
  const usage = cmd.usages ? `Usage: ${cmd.usages}` : 'Usage: —';
  const desc = cmd.description ? `Desc : ${cmd.description}` : '';
  return [title, usage, desc].filter(Boolean).join('\n');
};

const makeFancyHeader = (title) => {
  const line = '═'.repeat(Math.max(6, title.length + 4));
  return `╔${line}╗\n║  ${title}  ║\n╚${line}╝`;
};

// --------- handleEvent (passive msg watcher) ----------
export async function handleEvent({ api, event, getText }) {
  const { body, threadID, messageID } = event;
  if (!body || typeof body !== 'string') return;

  // Only react to messages that start with prefix '!' (example)
  if (!body.trim().startsWith('!')) return;

  const parts = body.trim().slice(1).split(/\s+/);
  if (!parts.length) return;

  const [cmdName] = parts;
  // If user asked for "help" (passive usage example)
  if (cmdName.toLowerCase() === 'help') {
    const reply = [
      makeFancyHeader('Help (Quick)'),
      getText('moduleInfo'),
      '',
      getText('helpList'),
      '',
      `Signature: ${sig}`
    ].join('\n');

    await api.sendMessage({ body: reply }, threadID, messageID);
  }
}

// --------- run (explicit command execution) ----------
export async function run({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const clientCommands = global?.client?.commands || new Map();

  // If no args -> list commands in pages
  if (!args || !args[0]) {
    // collect command names (avoid duplicates)
    const names = [...new Set(Array.from(clientCommands.keys()))].sort();
    if (names.length === 0) {
      return api.sendMessage({ body: `No commands available.\n\n${sig}` }, threadID, messageID);
    }

    // Build a paginated / grouped list — here simple grouped blocks
    const chunks = [];
    const perPage = 20;
    for (let i = 0; i < names.length; i += perPage) {
      const page = names.slice(i, i + perPage)
        .map((n, idx) => `${pad(i + idx + 1, 3)} • ${n}`)
        .join('\n');
      chunks.push(page);
    }

    // Compose a stylish body
    const body = [
      makeFancyHeader('Available Commands'),
      chunks.slice(0, 1).join('\n\n'), // show first page by default
      '',
      `Total: ${names.length} commands`,
      '',
      `Tip: "${config.usages}"`,
      '',
      getText('footer') || sig
    ].join('\n');

    return api.sendMessage({ body }, threadID, messageID);
  }

  // Else show a specific command detail
  const q = args[0].toLowerCase();
  const cmd = clientCommands.get(q);

  if (!cmd) {
    return api.sendMessage({
      body: `Command "${q}" not found.\n\n${sig}`
    }, threadID, messageID);
  }

  // Create a styled card for the command
  const card = [
    makeFancyHeader(`Command: ${cmd.name}`),
    `Category : ${cmd.commandCategory || '—'}`,
    `Perm     : ${cmd.hasPermission ?? 0}`,
    `Cooldown : ${cmd.cooldowns ?? config.cooldowns}s`,
    cmd.usages ? `Usage    : ${cmd.usages}` : '',
    cmd.description ? `Description: ${cmd.description}` : '',
    '',
    `Credits: ${cmd.credits || config.credits}`,
    '',
    getText('footer') || sig
  ].filter(Boolean).join('\n');

  return api.sendMessage({ body: card }, threadID, messageID);
}

/* 
Notes:
- This module is safe: no names/IDs or external image URLs are embedded.
- Signature "𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭" is appended in every response.
- You can change prefix (currently '!' assumed in handleEvent) or perPage for listing.
- If you want a different visual theme (boxy, minimal, emoji-based), বলো — করে দিব।
*/
