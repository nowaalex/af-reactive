import fs from "fs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const OUTPUT_DIR = "lib";

fs.rmdirSync( OUTPUT_DIR, { recursive: true });

export default {
    input: {
        "models/Atom": "src/models/Atom.js",
        "models/Computed": "src/models/Computed.js",
        "models/Reaction": "src/models/Reaction.js",
        "models/Value": "src/models/Value.js"
    },
    output: {
        format: "es",
        dir: OUTPUT_DIR,
        chunkFileNames: "_/[hash].js",
        hoistTransitiveImports: false
    },
    plugins: [
        babel({ babelHelpers: "runtime" }),
        terser({
            format: {
                beautify: true
            },
            module: true,
            compress: {
                passes: 3
            }
        })
    ]
};