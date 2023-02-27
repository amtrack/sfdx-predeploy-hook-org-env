import { Parser } from "@oclif/core";
import { Org } from "@salesforce/core";

export async function getTargetOrgFromHook(hookOptions) {
  // dynamically parse the flags for the source deploy/push/delete commands
  const { flags } = await Parser.parse(options.argv, options.Command);
  const aliasOrUsername = flags["target-org"] ?? flags.targetusername;
  const org = aliasOrUsername
    ? // use the command line flag if given
      await Org.create({ aliasOrUsername })
    : // fallback to SFDX_DEFAULTUSERNAME environment variable or default org
      await Org.create();
  return org;
}

export async function hook(options) {
  const org = await getTargetOrgFromHook(options);
  const username = org.getUsername();
  console.log({ username });
  process.env["SFDX_TARGET_ORG_USERNAME"] = username;
  const conn = org.getConnection();
  const userId = conn.userInfo.id;
  console.log({ userId });
  const userResult = await conn.query(`SELECT Email FROM User LIMIT 1`);
  const email = userResult.records[0].Email;
  console.log({ email });
  process.env["SFDX_TARGET_ORG_USER_EMAIL"] = email;
}
