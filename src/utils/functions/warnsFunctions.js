const { userMention } = require("discord.js");
const { warnsModel } = require("../../schemas");

module.exports = {
  returnWarns: async (content) => {
    return content.map((w, i) => `**ID**: ${i + 1}\n**Averti par**: ${userMention(w.executorID)}\n**Date**: ${w.date}\n**Type**: ${w.type}\n**Raison**: ${w.reason}\n**Gravité**: ${w.severity}\n\n`).join(" ");
  },
  addWarn: async (interaction, Target, Reason, Type, WarnDate, Severity) => {
    let data = await warnsModel
        .findOne({ userID: Target.id, guildID: interaction.guild.id })
        .catch(console.error);

      if (!data) {
        data = new warnsModel({
          guildID: interaction.guild.id,
          userID: Target.id,
          userTag: Target.tag,
          content: [
            {
              executorID: interaction.user.id,
              executorTag: interaction.user.tag,
              reason: Reason,
              type: Type,
              date: WarnDate,
              severity: Severity,
            },
          ],
        });
      } else {
        const obj = {
          executorID: interaction.user.id,
          executorTag: interaction.user.tag,
          reason: Reason,
          type: Type,
          date: WarnDate,
          severity: Severity,
        };
        data.content.push(obj);
      }
      
      await data.save();
  }

}