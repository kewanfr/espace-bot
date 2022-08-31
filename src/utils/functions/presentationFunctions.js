const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const PresentationModel = require("../../schemas/presentationModel");
const { departementsByRegions, orientations, genres, pronoms, recherche, statut } = require("../infos");
const mongoose  = require('mongoose');

var presentationFieldsParse = async ({member, guild}, values) => {
  const fieldsName = {
    "prenom": "Prénom/Pseudo",
    "age": "Age",
    "localisation": "Département/Ville(s)",
    "region": "Région",
    "gender": "Genre",
    "pronoms": "Pronoms",
    "orientation": "Orientation",
    "search": "Ce que je recherche sur le serveur",
    "statut": "Statut",
    "instagram": "Instagram",
    "twitter": "Twitter",
    "snapchat": "Snapchat",
    "desc_physique": "Description Physique",
    "hobbies": "Hobbies/Passions",
    "desc_perso": "Description Personnelle",
  }

  let resultat = {};
  let presentation = `╔════════Presentation de <@${member.user.id}>\n`;

  for (var key in fieldsName) {
    if(values[key]) {
      let value = values[key];
      if(key == "instagram") {
        value = `https://www.instagram.com/${value.replace("@", "")}`;
      }
      if(key == "twitter") {
        value = `https://twitter.com/${value.replace("@", "")}`;
      }

      resultat[fieldsName[key]] = value;
      presentation += `${key == "gender" || key == "desc_physique" ? "╠\n" : ""}╠**${fieldsName[key]}**: ${value}\n${key == "statut" ? "╠\n" : ""}`;
    }
  }

  presentation += `╚═══════════════════════`;

  return presentation;
};

module.exports = {
  setPresentation: async (client, {guild, member}, presentation) => {
    let { user } = member;

		let dbUser = await client.getUserInfos(member, guild);

		let result = {};

		if(dbUser.age) result.age = `${dbUser.age} ans`;
		if(dbUser.gender && dbUser.gender.length > 0) result.gender = dbUser.gender.map((g) => `${genres[g].emoji} ${genres[g].name}`).join(", ");
		if(dbUser.pronoms && dbUser.pronoms.length > 0) result.pronoms = dbUser.pronoms.map((g) => `${pronoms[g].emoji} ${pronoms[g].name}`).join(", ");
		if(dbUser.orientation && dbUser.orientation.length > 0) result.orientation = dbUser.orientation.map((g) => `${orientations[g].emoji} ${orientations[g].name}`).join(", ");
		if(dbUser.search && dbUser.search.length > 0) result.search = dbUser.search.map((g) => `${recherche[g].emoji} ${recherche[g].name}`).join(", ");
		result.region = dbUser.region ? departementsByRegions[dbUser.region].name : "";
		if(dbUser.statut && dbUser.statut.length > 0) result.statut = dbUser.statut.map((g) => `${statut[g].emoji} ${statut[g].name}`).join(", ");

		let presentationDb = await PresentationModel.findOne({ userID: user.id, guildID: guild.id });
    if(!presentationDb) {

			
      presentationDb = await new PresentationModel({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        guildID: guild.id,
				status: "pending",

				prenom: presentation.prenom,
				localisation: presentation.localisation,
				desc_physique: presentation.desc_physique,
				hobbies: presentation.hobbies,
				desc_perso: presentation.desc_perso,
      });

			for(const field in result) {
				presentationDb[field] = result[field];
			}

      await presentationDb.save().catch(console.error);
    }

		for(const field in presentation) {
			presentationDb[field] = presentation[field];
		}
		for(const field in result) {
			presentationDb[field] = result[field];
		}
		await presentationDb.save().catch(console.error);

		return presentationDb;
  },
  getPresentationDb: async (client, {guild, member}) => {
    let { user } = member;

		let dbUser = await client.getUserInfos(member, guild);
		
		let presentationDb = await PresentationModel.findOne({ userID: user.id, guildID: guild.id });
		if(presentationDb) {
			return presentationDb;
		}
		return false;
  },
  getPresentation: async (client, {guild, member}, statusMatter) => {
    let { user } = member;

		let presentationDb = await PresentationModel.findOne({ userID: user.id, guildID: guild.id });
		let dbUser = await client.getUserInfos(member, guild);
		if(statusMatter && presentationDb && presentationDb.status !== "published") return `❌ La présentation de ce membre n'existe pas ou n'est pas publiée.`;
		if(!presentationDb.age && dbUser.age) {
			presentationDb.age = dbUser.age;
			await presentationDb.save().catch(console.error);
		}
		if(presentationDb) {
			return await presentationFieldsParse({guild, member}, presentationDb);
		}
		return `❌ La présentation de ce membre n'existe pas ou n'est pas publiée.`;
  },
  

}