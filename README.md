# sfdx-plugin-org-env-hook

> Export target org details as environment variables

This is useful for [Metadata String Replacements](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_string_replace.htm) before pushing/deploying to an org (especially Scratch Orgs).

Currently supported environment variables:

| Environment Variable               | Description                             | Example              |
| ---------------------------------- | --------------------------------------- | -------------------- |
| `SFDX_TARGET_ORG_USERNAME`         | The username of the target org user     | john.doe@example.com |
| `SFDX_TARGET_ORG_ID`               | The id of the target org                | 00D7g0000006RKmEAM   |
| `SFDX_TARGET_ORG_USER_EMAIL`       | The email of the target org user        | john.doe@gmail.com   |
| `SFDX_TARGET_ORG_USER_FIRSTNAME`   | The first name of the target org user   | John                 |
| `SFDX_TARGET_ORG_USER_LASTNAME`    | The last name of the target org user    | Doe                  |
| `SFDX_TARGET_ORG_USER_DISPLAYNAME` | The display name of the target org user | John Doe             |
| `SFDX_TARGET_ORG_USER_ID`          | The id of the target org user           | 0058F000002RfcKQAS   |

## Example

`sfdx-project.json`:

```json
{
  "packageDirectories": [
    {
      "path": "force-app",
      "default": true
    }
  ],
  "sourceApiVersion": "57.0",
  "replacements": [
    {
      "filename": "*.portal-meta.xml",
      "stringToReplace": "john.doe@example.com",
      "replaceWithEnv": "SFDX_TARGET_ORG_USERNAME"
    },
    {
      "filename": "*.portal-meta.xml",
      "stringToReplace": "john.doe@gmail.com",
      "replaceWithEnv": "SFDX_TARGET_ORG_USER_EMAIL"
    }
  ]
}
```

## Installation

```console
sfdx plugins install sfdx-plugin-org-env-hook
```

> **Note**
>
> This is a minimalistic sfdx plugin.
>
> Ideally sfdx supports dynamic Metadata String Replacements with custom Bash/Node.js scripts in the future.
