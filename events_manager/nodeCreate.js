module.exports = {
  name: "nodeCreate",
  execute(client, node) {
    console.log(`Node ${node.options.identifier} created`);
  },
};
