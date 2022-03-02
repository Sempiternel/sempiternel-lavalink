module.exports = {
  name: "nodeCreate",
  execute(node) {
    console.log(`Node ${node.options.identifier} created`);
  },
};
