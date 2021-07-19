import { error, warn } from "../../console";
import { Config, ConfigFile, defaultConfig } from "../config";
import { BuildData } from "../ligo";
import { Bundle } from "./bundle";

export class ContractsBundle extends Bundle {
  config: Config = defaultConfig;

  async readConfigFile(): Promise<Config> {
    const fileName = ConfigFile.getName();

    if (!this.exists(fileName)) {
      warn("This smart contract repository it's missing \"config.json\" file, will proceed with default config instead.");
    } else {
      const config = await this.readJSONFile<Config>(fileName);

      const configFile = new ConfigFile(config);

      try {
        configFile.validate();
      } catch(validationError) {
        error(`Could not read smart contract repository configuration:\n\n${validationError}`);
        process.exit(1);
      }

      this.config = config;
    }

    return this.config;
  }

  async getContractsFiles() {
    return await this.listFiles(this.config.contractsDirectory);
  }

  getContractFile(fileName: string) {
    return this.getPath(this.config.contractsDirectory, fileName);
  }

  async readContract(fileName: string) {
    const contractFile = this.getContractFile(fileName);

    return await this.readTextFile(contractFile);
  }

  getBuildFile(contractName: string) {
    return this.getPath(this.config.outputDirectory, `${contractName}.json`);
  }

  async writeBuildFile(contractName: string, data: any) {
    const buildFile = this.getBuildFile(contractName);

    return await this.writeJSONFile(buildFile, data, true);
  }

  async readBuildFile(contractName: string): Promise<BuildData> {
    const buildFile = this.getBuildFile(contractName);

    return await this.readJSONFile<BuildData>(buildFile);
  }

  async buildFileExists(contractName: string) {
    const buildFile = this.getBuildFile(contractName);

    return this.exists(buildFile);
  }
}