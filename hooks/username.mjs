import { Org } from "@salesforce/core";

export const hook = async (this, options) => {
    console.log("PreDepoy Hook Running");
  const org = await Org.create({});
  const username = await org.getUsername();
  this.log("hi");
  const thisUsername = await this.org.getUsername();
  console.log({ username, thisUsername });
};
