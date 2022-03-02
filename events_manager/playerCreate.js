module.exports = {
  name: "playerCreate",
  execute(client, player) {
    client.channels.cache
      .get(player.textChannel)
      .send(
        `The stream has just been created! (on the \`${player.node.options.identifier}\` node)`
      );
  },
};
