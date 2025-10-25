export const BOT_NAME = '𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭';
export const PREFIX = '-';
export const PER_PAGE = 14;

export const config = {
  name: 'help_futuristic',
  version: '3.0.0-future',
  hasPermission: 0,
  credits: BOT_NAME,
  description: 'Futuristic help panel with heavy branding of ' + BOT_NAME,
  commandCategory: 'System',
  usages: 'help [command|page]',
  cooldowns: 4,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 0
  }
};

// bilingual texts
const I18N = {
  en: {
    headerTitle: `⚡ ${BOT_NAME} • SYSTEM PANEL ⚡`,
    moduleInfo: 'Stylish command list and details.',
    helpHint: `Type "${PREFIX}help <command>" to view details.`,
    noCommands: 'No commands found.',
    notFound: 'Command not found.'
  },
  bn: {
    headerTitle: `⚡ ${BOT_NAME} • সিস্টেম প্যানেল ⚡`,
    moduleInfo: 'স্টাইলিশ কমান্ড তালিকা ও বিবরণ।',
    helpHint: `বিস্তারিত দেখতে লিখুন "${PREFIX}help <command>" ।`,
    noCommands: 'কোনো কমান্ড পাওয়া যায়নি।',
    notFound: 'কমান্ড পাওয়া যায়নি।'
  }
};

// visual elements (unique look)
const line = (len = 48) => '═'.repeat(len);
const boxTop = (title) => `╔${'═'.repeat(title.length + 4)}╗\n║  ${title}  ║\n╚${'═'.repeat(title.length + 4)}╝`;
const neon = (t) => `»» ${t} ««`;
const footerBlock = () => `\n${line(48)}\n${BOT_NAME} — FUTURISTIC HELP PANEL\n${BOT_NAME} | ${BOT_NAME}\n${line(48)}`;

// safe formatter
const fmt = (...parts) => parts.filter(Boolean).join('\n');

// detect language function (basic)
const detectLang = (getText) => {
  // if getText provided (bot framework), try it; else default 'en'
  // We'll keep it simple: prefer 'bn' if a Bangla-specific key exists
  return 'en';
};

// build command card (futuristic)
const buildCommandCard = (cmd) => {
  const title = neon(cmd.name.toUpperCase());
  const block = [
    boxTop(title),
    `Category  : ${cmd.commandCategory || '—'}`,
    `Perm      : ${cmd.hasPermission ?? 0}`,
    `Cooldown  : ${cmd.cooldowns ?? config.cooldowns}s`,
    `Usage     : ${cmd.usages || '—'}`,
    cmd.description ? `Description: ${cmd.description}` : '',
    `Credits   : ${cmd.credits || config.credits}`,
    footerBlock()
  ].filter(Boolean).join('\n');
  // add extra BOT_NAME stamps inside card for heavy branding
  return `${block}\n${BOT_NAME} • ${BOT_NAME} • ${BOT_NAME}`;
};

// ---------------------- handleEvent ----------------------
// Passive quick reaction for messages starting with the prefix.
export async function handleEvent({ api, event, getText }) {
  try {
    const { body, threadID, messageID } = event;
    if (!body || typeof body !== 'string') return;
    const text = body.trim();
    if (!text.startsWith(PREFIX)) return;

    const parts = text.slice(PREFIX.length).split(/\s+/);
    const cmd = (parts.shift() || '').toLowerCase();

    // quick compact help panel on "!help"
    if (cmd === 'help' && parts.length === 0) {
      const lang = detectLang(getText);
      const txt = I18N[lang] || I18N.en;
      const reply = fmt(
        boxTop(txt.headerTitle),
        `\n${txt.moduleInfo}`,
        `\n${txt.helpHint}`,
        `\n💠 Powered & Curated by ${BOT_NAME}`,
        `\nTip: ${BOT_NAME} recommends reading command details for best use.`,
        footerBlock()
      );
      return api.sendMessage({ body: reply }, threadID, messageID);
    }
  } catch (err) {
    console.error(`[${BOT_NAME}] handleEvent error:`, err);
  }
}

// ---------------------- run ----------------------
// Main explicit command handler when user runs "!help" command.
export async function run({ api, event, args, getText }) {
  try {
    const { threadID, messageID } = event;
    const clientCommands = global?.client?.commands || new Map();
    const lang = detectLang(getText);
    const txt = I18N[lang] || I18N.en;

    // no args => show first page
    if (!args || !args[0]) {
      const names = [...new Set(Array.from(clientCommands.keys()))].sort();
      if (names.length === 0) {
        return api.sendMessage({
          body: `${txt.noCommands}\n\n${BOT_NAME} • ${BOT_NAME}`
        }, threadID, messageID);
      }

      const totalPages = Math.ceil(names.length / PER_PAGE);
      const page = 1;
      const start = (page - 1) * PER_PAGE;
      const pageItems = names.slice(start, start + PER_PAGE);
      const list = pageItems.map((n, i) => ` ${String(start + i + 1).padStart(2, ' ')} ▸ ${n}`).join('\n');

      const body = fmt(
        boxTop(`${BOT_NAME} • COMMANDS`),
        `\n${neon(`Page ${page}/${totalPages}`)}`,
        `\n${line(48)}`,
        list,
        `\n${line(48)}`,
        `Total: ${names.length} commands`,
        `\n${txt.helpHint}`,
        `\n💠 ${BOT_NAME} — make your bot shine!`,
        footerBlock()
      );

      return api.sendMessage({ body }, threadID, messageID);
    }

    // if numeric arg => page navigation
    const query = args[0].toLowerCase();
    if (/^\d+$/.test(query)) {
      const pageNum = Math.max(1, parseInt(query, 10));
      const names = [...new Set(Array.from(clientCommands.keys()))].sort();
      if (names.length === 0) {
        return api.sendMessage({ body: `${txt.noCommands}\n\n${BOT_NAME}` }, threadID, messageID);
      }
      const totalPages = Math.ceil(names.length / PER_PAGE);
      const page = Math.min(pageNum, totalPages);
      const start = (page - 1) * PER_PAGE;
      const pageItems = names.slice(start, start + PER_PAGE);
      const list = pageItems.map((n, i) => ` ${String(start + i + 1).padStart(2, ' ')} ▸ ${n}`).join('\n');

      const body = fmt(
        boxTop(`${BOT_NAME} • COMMANDS`),
        `\n${neon(`Page ${page}/${totalPages}`)}`,
        `\n${line(48)}`,
        list,
        `\n${line(48)}`,
        `Total: ${names.length} commands`,
        `\n${BOT_NAME} • ${BOT_NAME}`
      );

      return api.sendMessage({ body }, threadID, messageID);
    }

    // otherwise treat as command name -> show detailed card
    const q = query;
    const cmd = clientCommands.get(q);
    if (!cmd) {
      return api.sendMessage({
        body: `${txt.notFound} • "${q}"\n\n${BOT_NAME} • Need help? Try "${PREFIX}help"`
      }, threadID, messageID);
    }

    // build and send the futuristic card (heavy branded)
    const card = buildCommandCard({
      name: cmd.name || q,
      usages: cmd.usages || config.usages,
      description: cmd.description || '',
      commandCategory: cmd.commandCategory || '—',
      hasPermission: cmd.hasPermission ?? 0,
      cooldowns: cmd.cooldowns ?? config.cooldowns,
      credits: cmd.credits || config.credits
    });

    return api.sendMessage({ body: card }, threadID, messageID);
  } catch (err) {
    console.error(`[${BOT_NAME}] run error:`, err);
    return api.sendMessage({ body: `⚠️ ${BOT_NAME} encountered an error.\n${BOT_NAME}`, threadID: event.threadID, messageID: event.messageID });
  }
}
