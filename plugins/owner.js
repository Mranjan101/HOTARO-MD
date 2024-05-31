const fs = require("fs")
const axios = require("axios");
const { command, isPrivate, serialize } = require("../lib");
const config = require("../config");
/*command(
{
        pattern: "owner",
        fromMe: false,
        desc: "To find owner number",
        type: "user"
    }, async(message) => {
        const Config = require('../config')
        const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + Config.OWNER_NAME + '\n' +
            'ORG:;\n' +
            'TEL;type=CELL;type=VOICE;waid=' + Config.OWNER_NUMBER + ':+' + Config.OWNER_NUMBER + '\n' +
            'END:VCARD'
        let buttonMessaged = {
            contacts: { displayName: Config.OWNER_NAME, contacts: [{ vcard }] },
            contextInfo: {
                externalAdReply: {
                    title: Config.OWNER_NAME,
                    body: '𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋',
                    renderLargerThumbnail: true,
                    thumbnailUrl:  { url: 'https://i.imgur.com/U26K4xG.jpeg'},
                    mediaType: 2,
                    mediaUrl: 'https://wa.me/919883457657?text=𝗛𝗘𝗟𝗢 𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋',
                    sourceUrl: `https://wa.me/919883457657?text=𝗛𝗘𝗟𝗢 𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋`
                },
            },
        };
        return await message.sendMessage(message.jid, buttonMessaged,);
    }
);*/

command(
{
    pattern: "owner",
    fromMe: isPrivate,
    desc: "Send owner number",
    type: "misc"
}, async (message) => {
   let vnum = config.OWNER_NUNBER;
   let name = config.OWNER_NAME;
   const vcard = 'BEGIN:VCARD\n' +
                 'VERSION:3.0\n' +
                 `FN:` + name + `\n` +
                 'ORG:ʜᴏᴛᴀʀᴏ-ᴍᴅ;\n' +          
                 `TEL;type=CELL;type=VOICE;waid=` + vnum + `:+` + vnum + `\n` +
                 'END:VCARD'
   await message.sendMessage(
    message.jid,
    {
        contacts: {
            displayName: name,
            contacts: [{ vcard }],
        }
    }
)});
command(
{
        pattern: "repo",
        fromMe: isPrivate,                                                                                                      desc: "Sends info about repo.",
        category: "general",
        type: 'misc'
        },
    async(message) => {
        let { data } = await axios.get('https://api.github.com/repos/OfficialAnjanv2/HOTARO-MD')
        let cap = `> ʜᴏᴛᴀʀᴏ-ᴍᴅ repository stats
*➠ Total Stars:* ${data.stargazers_count} *stars*
*➫ Forks:* ${data.forks_count} *forks*
*➠ Repo:* https://github.com/OfficialAnjanv2/HOTARO-MD
*➠ Group:* https://chat.whatsapp.com/JrA3XLQtyka0muECxfYQTR
    > ʜᴏᴛᴀʀᴏ-ᴍᴅ
`
        let buttonMessaged = {
            image: { url: "https://i.imgur.com/U26K4xG.jpeg"},
            caption: cap,
            footer: "☬ ʜᴏᴛᴀʀᴏ-ᴍᴅ ☬",
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: "☬ ʜᴏᴛᴀʀᴏ-ᴍᴅ ☬",
                    body: "𝗛𝗘𝗟𝗢 𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋",
                    thumbnailUrl: { url: "https://i.imgur.com/U26K4xG.jpeg"},
                    mediaType: 4,
                    mediaUrl: 'https://wa.me/919883457657?text=𝗛𝗘𝗟𝗢 𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋',
                    sourceUrl: `https://wa.me/919883457657?text=𝗛𝗘𝗟𝗢 𝐌𝐫-𝐚𝐧𝐣𝐚𝐧👀🦋`,
                }
            }
        };
        return await message.sendMessage(message.jid, buttonMessaged);
    }
)
