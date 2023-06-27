const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const Path = require("path");

const COMPILER = "msbuild.exe";

export const checkCscInPath = async (exit) => {
    // Check for compiler in %PATH%
    const promises = process.env.path.split(";").map((p) => fs.pathExists(path.resolve(p, COMPILER)));
    const results = await Promise.all(promises);
    const compilerFound = await results.find((result) => !!result);

    if (exit && !compilerFound) {
        console.error(`You need "${COMPILER}" in your %PATH% in order to compile the launcher executable.`);
        process.exit(1);
    }
    else {
        return compilerFound;
    }
};

export  const compileLauncher = async (  csproj, ...params ) => {
    //language=file-reference
    const args = [ Path.join( __dirname, csproj ) ];

    const spawnResult = spawn.sync(COMPILER, args, { stdio: "inherit" });
    if (spawnResult.status !== 0) {
        return Promise.reject({ command: `${COMPILER} ${args.join(" ")}` });
    }
};
