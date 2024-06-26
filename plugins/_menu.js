const plugins = require("../lib/plugins");
const { command, isPrivate, clockString, pm2Uptime } = require("../lib");
const process = require("process")
const { OWNER_NAME, BOT_NAME } = require("../config");
const { hostname } = require("os");
const translate = require('@vitalets/google-translate-api');
const acrcloud = require("acrcloud");
const fs = require("fs");
const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: process.env.ACR_A,
  access_secret: process.env.ACR_S
});
const long = String.fromCharCode(8206);
const readmore = long.repeat(4001);
const {
    downloadContentFromMessage,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    InteractiveMessage,
    getContentType,
    jidDecode,
    delay
} = require('@whiskeysockets/baileys')
const config = require("../config")
async function findMusic(file){
return new Promise((resolve,reject)=>{
acr.identify(file).then(result => {
  var data = result.metadata?.music[0];
  resolve(data);
});
});
}
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
command(
    {
        pattern: "alive",
        fromMe: isPrivate,
        desc: "alive",
        type: "user"
    }, async (message) => {
        await message.sendMessage(message.jid, { text: `☬ ʜᴏᴛᴀʀᴏ-ᴍᴅ ☬ has been alive since *_${runtime(process.uptime())}_*` })
    }
);
command(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All Commands",
    dontAddCommandList: true,
    type: "user",
  },
  async (message, match) => {
   
    if (match) {
      for (let i of plugins.commands) {
        if (
          i.pattern instanceof RegExp &&
          i.pattern.test(message.prefix + match)
        ) {
          const cmdName = i.pattern.toString().split(/\W+/)[1];
          message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
        }
      }
    } else {
      let { prefix } = message;
      let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Africa/Lagos" })
        .split(",");
      let menu = `
     ☬ ʜᴏᴛᴀʀᴏ-ᴍᴅ ☬
   *BY : Tᴀɪʀᴀ Mᴀᴋɪɴᴏ*
 ${readmore}
      `;
      let cmnd = [];
      let cmd;
      let category = [];
      plugins.commands.map((command, num) => {
        if (command.pattern instanceof RegExp) {
          cmd = command.pattern.toString().split(/\W+/)[1];
        }

        if (!command.dontAddCommandList && cmd !== undefined) {
          let type = command.type ? command.type.toLowerCase() : "misc";

          cmnd.push({ cmd, type });

          if (!category.includes(type)) category.push(type);
        }
      });
      cmnd.sort();
      category.sort().forEach((cmmd) => {
        //menu += `\n\t⦿---- *${cmmd.toUpperCase()}* ----⦿\n`;
        menu += `\n
╭═══════════════ ⪩
╰╮╰┈➤ *${cmmd.toUpperCase()}*
╭═══════════════ ⪩\n`;
        let comad = cmnd.filter(({ type }) => type == cmmd);
        comad.forEach(({ cmd }) => {
          menu += `┃  ${cmd.trim()} \n`;
        });
        //menu += `\n`;
        menu += `╰════════════════ ⪨`;
      });
      return await message.sendMessage(message.jid,menu);
    }
  }
);


/*command(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All Commands",
    type: "user",
    dontAddCommandList: true,
  },
  async (message, match, { prefix }) => {
    let menu = "\t\t```Command List```\n";

    let cmnd = [];
    let cmd, desc;
    plugins.commands.map((command) => {
      if (command.pattern) {
        cmd = command.pattern.toString().split(/\W+/)[1];
      }
      desc = command.desc || false;

      if (!command.dontAddCommandList && cmd !== undefined) {
        cmnd.push({ cmd, desc });
      }
    });
    cmnd.sort();
    cmnd.forEach(({ cmd, desc }, num) => {
      menu += `\`\`\`${(num += 1)} ${cmd.trim()}\`\`\`\n`;
      if (desc) menu += `Use: \`\`\`${desc}\`\`\`\n\n`;
    });
    menu += ``;
    return await message.reply(menu);
  }
);*/
command(
 {
    pattern: 'tts',
    fromMe: isPrivate,
    desc: "text to speech",
    type: 'tools'
}, async (message, match) => {
    var match = match || message.reply_message.text
    if (!match) return await message.reply("Reply to a text");
    if (!fs.existsSync("./temp")) {
        fs.mkdirSync("./temp")
    }
    query = match.replace("tts","")
    var lng = '0en';
    if (/[\u0D00-\u0D7F]+/.test(query)) lng = 'ml';
    let
        LANG = lng,
        ttsMessage = query,
        SPEED = 1.0
    if (langMatch = query.match("\\{([a-z]{2})\\}")) {
        LANG = langMatch[1]
        ttsMessage = ttsMessage.replace(langMatch[0], "")
    }
    if (speedMatch = query.match("\\{([0].[0-9]+)\\}")) {
        SPEED = parseFloat(speedMatch[1])
        ttsMessage = ttsMessage.replace(speedMatch[0], "")
    }
    try {
        var audio = await gtts(ttsMessage,LANG)
    } catch {
        return await message.reply("_Unable to convert text to speech._")
    }
    await message.sendMessage(message.jid, {
        audio,
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: Array.from({length: 40}, () => Math.floor(Math.random() * 99))
    }, {
        quoted: message.data
    });
});
/*command(
{
    pattern: 'video2 ?(.*)',
    fromMe: isPrivate,
    desc: "Dunno",
    use: 'util'
}, async (message, match) => {
	var s1 = !match.includes('youtu') ? message.reply_message.jid : match[1]
    if (s1 && s1.includes("instagram")) return;
    if (!s1) return await message.reply("*You need to provide Video Name.*");
    if (!s1.includes('youtu')) return await message.reply("*You need to provide video name.*");
    const getID = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
    var vid = getID.exec(s1)[1]
    const video = await ytv(vid)
    const caption = await ytTitle(vid)
    return await message.client.sendMessage(message.jid, {
            video,
            mimetype: "video/mp4",
            caption,
            thumbnail: await skbuffer(`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`)
        },{quoted:message.data});
    });
*/
command(
{
      pattern: "find ?(.*)",
      fromMe: isPrivate,
      desc: "Finds music name using AI",
      type: 'tools'
  }, async (message, match) => {
      if (!message.reply_message?.audio) return await message.reply("_Reply to a short song")
      if (message.reply_message.duration > 60) return await message.send("_Audio should not be more than 20 seconds_")
      var audio = await message.reply_message.download('buffer');
      var data = await findMusic(audio)
      if (!data) return await message.reply("_No results found!_");
var buttons = [];
function getDuration(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
const Message = {
    text:  `
    *☬ ʜᴏᴛᴀʀᴏ-ᴍᴅ ☬ Song Finder*
*Title:* ${data.title}\n
Artists: ${data.artists?.map(e => e.name + " ")}\n
Released on: ${data.release_date}\n
Duration: ${getDuration(data.duration_ms)}\n
Album: ${data.album?.name}\n
Genres: ${data.genres?.map(e => e.name + " ")}\n
Label: ${data.label}\n
Spotify: ${"spotify" in data.external_metadata?"Available":"Unavailable"}\n
YouTube: ${"youtube" in data.external_metadata?"https://youtu.be/"+data.external_metadata.youtube.vid:"Unavailable"}\n`,
//    footer: '🎼 Listen to full music on',
//    buttons,
//    headerType:1
}
await message.sendMessage(message.jid, Message)
    });

command(
{
    pattern: 'edit ?(.*)',
    fromMe: true,
    desc: 'edit messages',
    type: "tools"
}, (async (message, match, m, client) => {
    if (match[1] && message.reply_message?.text && message.quoted.key.fromMe){                  
    await client.edit(match[1],message.jid,message.quoted.key);
}                                                                           
}));

/*command(
{
    pattern: 'send ?(.*)',
    type: 'utility', 
    fromMe: true, 
    desc: "Sends message"
    }, (async (message, match) => {
    if (!message.reply_message) return await message.reply("*Reply to a message*\n*Ex: .send jid jid ...*")
     if (!match[1]) match[1] = message.jid
    let Jids = [...match[1]?.match(/[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g)] || [message.jid];
        for (let jid of Jids) {
     await message.forwardMessage(jid, message.quoted,{contextInfo:{isForwarded: false},detectLinks: true});
    await new Promise((r) => setTimeout(r, 5000))
        }
}));*/


