import { getTargetOrgFromHook } from "./target-org.mjs";

const SUPPORTED_COMMANDS = [
  "project:deploy:start",
  "force:source:deploy",
  "force:source:push",
];

export async function hook(options) {
  if (!SUPPORTED_COMMANDS.includes(options?.Command?.id)) {
    return;
  }
  const org = await getTargetOrgFromHook(options);
  const identity = await org.getConnection().identity();
  const env = {
    SFDX_TARGET_ORG_ID: identity.organization_id,
    SFDX_TARGET_ORG_USERNAME: identity.username,
    SFDX_TARGET_ORG_USER_ID: identity.user_id,
    SFDX_TARGET_ORG_USER_EMAIL: identity.email,
    SFDX_TARGET_ORG_USER_FIRSTNAME: identity.first_name,
    SFDX_TARGET_ORG_USER_LASTNAME: identity.last_name,
    SFDX_TARGET_ORG_USER_DISPLAYNAME: identity.display_name,
  };
  this.debug("Setting environment variables for target org");
  this.debug(
    Object.entries(env)
      .map(([k, v]) => `${k}="${v}"`)
      .join("\n")
  );
  for (const [k, v] of Object.entries(env)) {
    process.env[k] = v;
  }
}
