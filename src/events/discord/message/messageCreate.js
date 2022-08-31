module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    
    if(message.author.bot) return;

    const prefix = client.config.prefix;
    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    if(cmdName.length == 0) return;

    let cmd = client.commands.get(cmdName);
    if(!cmd) cmd = client.commands.find(cmd => cmd.help.aliases?.includes(cmdName));
    if(!cmd) return;

    if(cmd.help.deletemsg) message.delete();

    try {
      cmd.run(client, message, args);
    } catch (error) {
      console.log(error);
      await message.channel.send({content: `:x: Une erreur est survenue lors de l'éxecution de la commande`});
    }
  },
};
