import { Parser } from "@oclif/core";
import { Org } from "@salesforce/core";

export async function getTargetOrgFromHook(hookOptions) {
  // dynamically parse the flags for the `sf project deploy start` command
  const { flags } = await Parser.parse(hookOptions.argv, hookOptions.Command);
  if (flags["target-org"] && typeof flags["target-org"] !== "string") {
    return flags["target-org"];
  }
  const aliasOrUsername = flags["target-org"] ?? flags.targetusername;
  const org = aliasOrUsername
    ? // use the command line flag if given
      await Org.create({ aliasOrUsername })
    : // fallback to SF_TARGET_ORG environment variable or default org
      await Org.create();
  return org;
}
