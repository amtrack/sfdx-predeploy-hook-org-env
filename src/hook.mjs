import { getTargetOrgFromHook } from "./target-org.mjs";

export async function hook(options) {
  const org = await getTargetOrgFromHook(options);
  const username = org.getUsername();
  this.debug({ username });
  process.env["SFDX_TARGET_ORG_USERNAME"] = username;
  const user = await getOrgUser(org);
  this.debug({ user });
  process.env["SFDX_TARGET_ORG_USER_EMAIL"] = user.Email;
  process.env["SFDX_TARGET_ORG_USER_FIRSTNAME"] = user.FirstName;
  process.env["SFDX_TARGET_ORG_USER_LASTNAME"] = user.LastName;
  process.env["SFDX_TARGET_ORG_USER_ID"] = user.Id;
}

const getOrgUser = async (org) => {
  const conn = org.getConnection();
  const username = org.getUsername();
  const user = (
    await conn.query(
      `SELECT Id, Email, FirstName, LastName FROM User WHERE Username='${username}'`
    )
  ).records[0];
  return user;
};
