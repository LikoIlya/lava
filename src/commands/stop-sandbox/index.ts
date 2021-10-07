import { Command } from 'commander';

import { em, debug, getCWD } from "../../console";
import { stopFlextesa } from "../../modules/flextesa";

export const addStopSandboxCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('stop-sandbox')
    .description('Stops a local Flextesa Tezos test network.')
    .action(() => {
      stopSandbox();
    })
    .hook('preAction', debugHook);
}

// Full stop-sandbox command controller
export const stopSandbox = async (readyCallback?: () => void) => {
  em(`Stopping Tezos sandbox...\n`);
  stopFlextesa(readyCallback);
};
