// Custom rule: `declare global` bypasses boundaries/dependencies since it introduces no
// import statement for the dependency graph to see (see docs/adr/0000-podzial-na-moduly-domenowe.md).

/** @type {import("eslint").Rule.RuleModule} */
const noDeclareGlobal = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `declare global` blocks, which make symbols globally visible without an import.",
    },
    schema: [],
    messages: {
      forbidden:
        "`declare global` is forbidden: it bypasses the boundaries/dependencies module boundary rule since no import statement exists for it to see.",
    },
  },
  create(context) {
    return {
      TSModuleDeclaration(node) {
        if (node.kind === "global") {
          context.report({ node, messageId: "forbidden" });
        }
      },
    };
  },
};

export default { rules: { "no-declare-global": noDeclareGlobal } };
