const { EmbedBuilder } = require("discord.js");

module.exports = {
  help: {
    name: "embed",
    description: "Envoyer un embed",
    slash: true,
    category: "moderation",
    permission: "ManageMessages",
  },
  slash: [
    {
      name: 'embed',
      description: 'Faire envoyer un embed par le bot',
      default_member_permissions: "ManageMessages",
      options: [
        {
          required: false,
          type: 3,
          name: 'message_content',
          description: 'Contenu du message'
        },
        {
          required: false,
          type: 7,
          name: 'salon',
          description: 'Salon où envoyer le message'
        },
        {
          required: false,
          type: 3,
          name: 'title',
          description: "Titre de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'description',
          description: "Description de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'color',
          description: "Couleur de l'embed"
        },
        {
          required: false,
          type: 6,
          name: 'author',
          description: "Auteur de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'author_name',
          description: "Nom de l'auteur de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'author_icon',
          description: "Icone de l'auteur de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'author_url',
          description: "URL de l'auteur de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'image',
          description: "Image de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'thumbnail',
          description: "Vignette de l'embed"
        },
        {
          required: false,
          type: 3,
          name: 'footer',
          description: "Pied de l'embed"
        }
      ],
    }
  ],
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
    if(authorObj?.name) embed.setAuthor(authorObj);
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
