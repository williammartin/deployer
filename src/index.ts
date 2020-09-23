import { App } from "./App";
import { DockerClient } from "./DockerClient";
import { FileLoader } from "./FileLoader";
import { PolicyEnforcer } from "./PolicyEnforcer";

if (process.argv.length <= 2) {
    process.stderr.write('no config provided');
    process.exit(1)
}

const app = new App(new FileLoader(process.argv[2]), new PolicyEnforcer(), new DockerClient())
app.run().catch((error) => {
    process.stderr.write(error.message);
    process.exit(1)
})