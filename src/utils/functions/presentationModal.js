const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const { departementsByRegions } = require("../../utils/infos");

module.exports = async (client, interaction) => {
  let dbUser = await client.getUserInfos(interaction.member, interaction.guild);
    let presentationDb = await client.getPresentationDb(interaction);

    let region = departementsByRegions[dbUser.region];

    const modal = new ModalBuilder()
    .setCustomId("mypresentation")
    .setTitle("Présentation");

    const Prenom = new TextInputBuilder()
    .setCustomId("prenom")
    .setLabel("Prénom/Pseudo")
    .setPlaceholder("Prénom ou pseudo")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const Localisation = new TextInputBuilder()
    .setCustomId("localisation")
    .setLabel("Département/Ville(s)")
    .setPlaceholder(region.name)
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  
    const physique = new TextInputBuilder()
    .setCustomId("desc_physique")
    .setLabel("Description Physique")
    .setPlaceholder("Description physique")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);
  
    const hobby = new TextInputBuilder()
    .setCustomId("hobbies")
    .setLabel("Mes hobbies/Passions")
    .setPlaceholder("Mes hobbies/Passions")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);
  
    const infos = new TextInputBuilder()
    .setCustomId("desc_perso")
    .setLabel("Plus d'infos sur moi")
    .setPlaceholder("Plus d'infos sur moi")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

    if(presentationDb.prenom) Prenom.setValue(presentationDb.prenom);
    if(presentationDb.localisation) Localisation.setValue(presentationDb.localisation);
    if(presentationDb.desc_physique) physique.setValue(presentationDb.desc_physique);
    if(presentationDb.hobbies) hobby.setValue(presentationDb.hobbies);
    if(presentationDb.desc_perso) infos.setValue(presentationDb.desc_perso);
    

    modal.addComponents(new ActionRowBuilder().addComponents(Prenom), new ActionRowBuilder().addComponents(Localisation), new ActionRowBuilder().addComponents(physique), new ActionRowBuilder().addComponents(hobby), new ActionRowBuilder().addComponents(infos));

    await interaction.showModal(modal);
}