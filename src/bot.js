// Require the necessary discord.js classes
const { Client, Partials, Collection } = require("discord.js");
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;

const Logger = require("./utils/logger");
require("./utils/includes");

console.log("[Discord.js]", "Initializing...");

// Require Modules
const ms = require("ms");

// Import Config
const config = require("./config.js");
const { TOKEN } = config;

const client = new Client({
  // intents: 131071,
  intents: 3276799,
  partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
  allowedMentions: { parse: ["everyone", "roles", "users"] },
  rest: { timeout: ms("1m") }
});

client.config = config;

// Create all components collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();


// Import database Models
const { BirthdateModel, GuildModel, UserModel, PresentationModel, mongoose } =  require("./schemas/index.js");
client.BirthdateModel = BirthdateModel;
client.GuildModel = GuildModel;
client.UserModel = UserModel;
client.PresentationModel = PresentationModel
client.mongoose = mongoose;

// Import functions
client.log = Logger;
require("./utils/functions.js")(client);

// Import Events Handler
require("./utils/handlers/CommandsHandler")(client);
require("./utils/handlers/ComponentsHandler")(client);
require("./utils/handlers/EventsHandler")(client);

process.on("exit", code => { client.log.client(`Le processus s'est arrêté avec le code: ${code}!`) });
process.on("uncaughtException", (err, origin) => {
  client.log.error(`UNCAUGHT_EXCEPTION: ${err}`);
  console._error(`Origine: ${origin}`)
});
process.on("unhandledRejection", (reason, promise) => {
  client.log.warn(`UNHANDLED_REJECTION: ${reason}`);
  console._log(promise);
});
process.on("warning", (...args) => client.log.warn(...args));

module.exports = client;

client.login(TOKEN);

(async() => {
  await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(console.error);

  mongoose.connection.on("error", console.error);
  mongoose.connection.on("err", console.error);
  mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected!"));
  mongoose.connection.on("connected", () => console.log("MongoDB connected!"));
  mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected!"));
  mongoose.connection.on("connecting", () => console.log("MongoDB connecting!"));
})();
