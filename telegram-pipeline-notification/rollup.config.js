import typescript from "rollup-plugin-typescript";

const input = "src/index.ts";
const output = {
    file: "dist/index.js",
    format: "cjs",
};
const plugins = [
    typescript(),
];
const external = ["https"];

export default { input, output, plugins, external, };
