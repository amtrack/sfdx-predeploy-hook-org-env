import { getTargetOrgFromHook } from "./target-org.mjs";

export async function hook(options) {
  const org = await getTargetOrgFromHook(options);
  const identity = await org.getConnection().identity();
  process.env["SFDX_TARGET_ORG_ID"] = identity.organization_id;
  process.env["SFDX_TARGET_ORG_USERNAME"] = identity.username;
  process.env["SFDX_TARGET_ORG_USER_ID"] = identity.user_id;
  process.env["SFDX_TARGET_ORG_USER_EMAIL"] = identity.email;
  process.env["SFDX_TARGET_ORG_USER_FIRSTNAME"] = identity.first_name;
  process.env["SFDX_TARGET_ORG_USER_LASTNAME"] = identity.last_name;
  process.env["SFDX_TARGET_ORG_USER_DISPLAYNAME"] = identity.display_name;
}
