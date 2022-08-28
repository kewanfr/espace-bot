module.exports = {
  name: "presenceUpdate",
  once: false,
  async execute(client, oldPresence, newPresence) {
    // client.updateStats(newPresence.guild);
    // client.updatePresenceStats();
    if(client.verifGuild(newPresence.guild)){
      // client.updateStats();
    }
  },
};
