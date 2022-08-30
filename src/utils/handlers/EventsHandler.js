const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

const { connection } = require("mongoose");

module.exports = async (client) => {
  const { log } = client;
  (await pGlob(`${process.cwd()}/src/events/discord/*/*.js`)).forEach((eventFile) => {
    const event = require(eventFile);

    if(!eventList.includes(event.name)) return log.warn(`Evenement non-chargé: nom invalide\nFichier -> ${eventFile}`);
    if(!event.name) return log.warn(`Evenement non-chargé: pas de nom\nFichier -> ${eventFile}`);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }

    log.event(`- ${event.name}`);
  });
};

const eventList = ["apiResponse", "applicationCommandCreateD", "applicationCommandDeleteD", "applicationCommandUpdateD", "channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "debug", "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove", "guildCreate", "guildDelete", "guildIntegrationsUpdate", "guildMemberAdd", "guildMemberAvailable", "guildMemberRemove", "guildMembersChunk", "guildMemberUpdate", "guildScheduledEventCreate", "guildScheduledEventDelete", "guildScheduledEventUpdate", "guildScheduledEventUserAdd", "guildScheduledEventUserRemove", "guildUnavailable", "guildUpdate", "interactionD", "interactionCreate", "invalidated", "invalidRequestWarning", "inviteCreate", "inviteDelete", "messageD", "messageCreate", "messageDelete", "messageDeleteBulk", "messageReactionAdd", "messageReactionRemove", "messageReactionRemoveAll", "messageReactionRemoveEmoji", "messageUpdate", "presenceUpdate", "rateLimit", "ready", "roleCreate", "roleDelete", "roleUpdate", "shardDisconnect", "shardError", "shardReady", "shardReconnecting", "shardResume", "stageInstanceCreate", "stageInstanceDelete", "stageInstanceUpdate", "stickerCreate", "stickerDelete", "stickerUpdate", "threadCreate", "threadDelete", "threadListSync", "threadMembersUpdate", "threadMemberUpdate", "threadUpdate", "typingStart", "userUpdate", "voiceStateUpdate", "warn", "webhookUpdate"];