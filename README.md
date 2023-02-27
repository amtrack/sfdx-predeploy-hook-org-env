# sfdx-predeploy-hook-org-env

> sfdx predeploy hook to export target org details as environment variables

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

> **Note**
>
> This is a minimalistic sfdx plugin.
>
> Ideally sfdx supports dynamic Metadata String Replacements with custom Bash/Node.js scripts in the future.

## Installation

```console
sfdx plugins install sfdx-predeploy-hook-org-env
```

## Usage

Make sure your `sfdx-project.json` contains some `replacements`.

Example:

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

To preview the environment variables,
set the environment variable `DEBUG=sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy`
and perform a validation deployment to the target org.

**Example**

MacOS/Linux:

```console
$ DEBUG=sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy sfdx force source deploy --checkonly -u mytargetorg -p force-app
```

Windows PowerShell:

```powershell
$env:DEBUG=sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy
sfdx force source deploy --checkonly -u mytargetorg -p force-app
```

This will output something like:

```
...
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy Setting environment variables for target org +2s
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_ID="00D7g0000006RKmEAM"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USERNAME="john.doe@example.com"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USER_ID="0058F000002RfcKQAS"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USER_EMAIL="john.doe@gmail.com"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USER_FIRSTNAME="John"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USER_LASTNAME="Doe"
sfdx:sfdx-predeploy-hook-org-env:hooks:predeploy SFDX_TARGET_ORG_USER_DISPLAYNAME="John Doe" +0ms
...
```
