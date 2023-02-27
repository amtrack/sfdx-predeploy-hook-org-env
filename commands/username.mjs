import {
  SfCommand,
  requiredOrgFlagWithDeprecations,
} from "@salesforce/sf-plugins-core";

export class UsernameCommand extends SfCommand {
  static flags = {
    // "target-org": Flags.requiredOrg(),
    "target-org": requiredOrgFlagWithDeprecations,
  };

  // static args = [];
  // we're only interested in org / targetusername flags
  // ignore all other flags that are specific to source push/deploy/delete
  static strict = false;

  async run() {
    const { flags } = await this.parse(UsernameCommand);
    const username = flags["target-org"].getUsername();
    this.log(username);
    return username;
  }
}
