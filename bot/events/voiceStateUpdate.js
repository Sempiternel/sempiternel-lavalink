module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
    if (newState.channelId) return;

    const channel = oldState.channel;
    if (channel.members.filter((member) => !member.user.bot).size) return;

    const player = channel.client.manager.get(channel.guild.id);
    if (player) player.disconnect();
  },
};
