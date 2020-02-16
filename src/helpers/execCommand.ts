import {debug} from "@actions/core";
import {spawnSync} from "child_process";

/**
 * Executes command and prints to debug results
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
export default function execCommand(cmd: string, args: Array<string>, cwd: string) {
    debug(
        spawnSync(
            cmd,
            args,
            {
                cwd
            }
        ).output.toString()
    );
}