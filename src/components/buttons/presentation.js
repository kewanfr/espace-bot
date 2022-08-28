module.exports = {
  data: {
    name: 'presentation',
  },
  async execute(client, interaction) {

    require("../../utils/functions/presentationModal")(client, interaction);
  }
}