let ENV_PATH = ".env";
const dotenv = require("dotenv");
const fs = require("fs");
const yaml = require("js-yaml");
const { program } = require("commander");

program
  .version("0.0.3", "-v, --vers", "output the current version")
  .option(
    "-e, --env <path>",
    "Path relative to root to env file (Eg:.env)",
    ".env"
  )
  .requiredOption("-i, --inyml <type>", "Input the yaml to add variables")
  .requiredOption(
    "-o, --outyml <type>",
    "Output where will write the new file modified"
  )
  .argument(
    "<runnables...>",
    "one or more runnable name will receive the variables"
  );
// .requiredOption(
//   "-r, --runnable <type>",
//   "Name of runnable will receive the variables"
// );

program.parse(process.argv);

const ONLY_NUMBER = new RegExp(/^[0-9]+$/);

function buildYml({ parsed }, { inyml, outyml, env }, runnables) {
  try {
    if (!parsed) {
      throw new Error(`File ${ENV_PATH} not found.`);
    }
    const fileContents = fs.readFileSync(inyml, "utf8");
    const data = yaml.load(fileContents);
    console.log("runnable", runnables);
    for (const key in runnables) {
      const runnable = runnables[key];
      console.log(`Starting injecting in ${runnable}.variables`);
      const paths = `${runnable}.variables`.split(".");

      let dataTree = data;

      for (const path of paths) {
        if (path in dataTree) {
          dataTree = dataTree[path];
        } else {
          throw new Error(`'${path}' runnable not found in ${inyml}`);
        }
      }
      // console.log(dataTree);
      if ("defines" in dataTree && dataTree.defines === "variables") {
        console.log(`nice! have ${Object.keys(dataTree).length - 1} vars`);

        for (const key of Object.keys(parsed)) {
          if (Object.keys(dataTree).includes(key)) {
            console.log(
              `${key} already exist in ${inyml}-> Not overriding existing variables`
            );
            continue;
          }
          let someEnv = parsed[key];
          // console.log(key);
          if (ONLY_NUMBER.test(someEnv)) {
            let someNumber = parseInt(someEnv);
            dataTree[key.trim()] = { type: "int", value: someNumber, env: key };
            //   console.log(someNumber);
          } else {
            dataTree[key.trim()] = { type: "string", value: someEnv, env: key };
            //   console.log(someEnv);
          }
        }
        // console.log(dataTree);
        //   console.log(data);

        const runName = data;
        // console.log(`runName`, runName);
        const runContent = runName[runnable];
        let network = env.split(".");
        network = network[network.length - 1];
        data[`${runnable}-${network}`] = runContent;
        delete data[`${runnable}`];
        // console.log(`data`, data);

        yamlStr = yaml.dump(data, {
          styles: {
            "!!null": "empty",
          },
          lineWidth: -1,
        });
        // console.log(yamlStr);
        fs.writeFileSync(outyml, yamlStr, "utf8");
      } else {
        console.error(`variables path missing defines:variables`);
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

const options = program.opts();

ENV_PATH = `./${options.env}`;

const objEnv = dotenv.config({ path: ENV_PATH });

console.log(`ENV in ${ENV_PATH} loaded.`);

buildYml(objEnv, options, program.args);
