const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Envoyer un embed",
  type: ["slash"],
  aliases: [],
  build: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Faire envoyer un embed par le bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("message_content")
        .setDescription("Contenu du message")  
        .setRequired(false) 
    )
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon où envoyer le message")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Titre de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Couleur de l'embed")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("author")
        .setDescription("Auteur de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("author_name")
        .setDescription("Nom de l'auteur de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("author_icon")
        .setDescription("Icone de l'auteur de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("author_url")
        .setDescription("URL de l'auteur de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("Image de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("thumbnail")
        .setDescription("Vignette de l'embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription("Pied de l'embed")  
        .setRequired(false) 
    ),
  deletemsg: true,
  runSlash: async (client, interaction) => {
    let title = interaction.options.getString("title");
    let description = interaction.options.getString("description");
    let color = interaction.options.getString("color");
    let author = interaction.options.getUser("author");
    let author_name = interaction.options.getString("author_name");
    let author_icon = interaction.options.getString("author_icon");
    let author_url = interaction.options.getString("author_url");
    let image = interaction.options.getString("image");
    let thumbnail = interaction.options.getString("thumbnail");
    let footer = interaction.options.getString("footer");
    let msgContent = interaction.options.getString("message_content");
    let channel = interaction.options.getChannel("salon");
    

    if(!title && !description && !color && !author && !author_name && !author_icon && !author_url && !image && !thumbnail && !footer) return interaction.reply({content: "❌ Vous devez entrer un message à envoyer !", ephemeral: true});

    let embed = new EmbedBuilder();

    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    if(color) embed.setColor(color);
    if(author) embed.setAuthor({ name: author.username, icon_url: author.displayAvatarURL });
    let authorObj = {};
    if(author_name) authorObj.name = author_name;
    if(author_icon) authorObj.icon_url = author_icon;
    if(authorObj) embed.setAuthor(authorObj);
    if(image) embed.setImage(image);
    if(thumbnail) embed.setThumbnail(thumbnail);
    if(footer) embed.setFooter({text: footer});

    let msgObject = {
      embeds: [embed]
    }
    if(msgContent) msgObject.content = msgContent;
    if(channel) {
      await channel.send(msgObject);
    } else {
      await interaction.channel.send(msgObject);
    }

    interaction.reply({content: "✅ Embed envoyé !", ephemeral: true});
  },
};
