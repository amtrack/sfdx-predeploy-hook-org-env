# sfdx-predeploy-hook-org-env

> sf predeploy hook to export target org details as environment variables

## Use Case

Example:
When deploying Metadata of type `Portal` you'll need to provide an `<admin>` which is a username in the org.
The [Metadata String Replacements](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_string_replace.htm) feature already supports replacing strings with values stored in a file or in an environment variable.

`sfdx-project.json`

```json
{
  ...
  "replacements": [
    {
      "filename": "force-app/main/default/portals/Customer Portal.portal-meta.xml",
      "stringToReplace": "admin@example.com",
      "replaceWithEnv": "ORG_USERNAME"
    }
  ]
}
```

Let's assume that for a Scratch Org we create, we simply want to make the default scratch org user the admin of the portal.

So in this example, we'll set the environment variable `ORG_USERNAME`, but first we need to get the default scratch org username from the org:

```console
export ORG_USERNAME="$(node -pe 'JSON.parse(fs.readFileSync(0, "utf8")).result.username' < <(sf org display --target-org my-target-org --json))"
sf project deploy start --source-dir "force-app/main/default/portals/Customer Portal.portal-meta.xml" --target-org my-target-org
```

Although this works just fine, we need to remember to set this environment variable before deploying or pushing.

> **Note**
>
> For common things like username, email address, org id, it would be handy to have these environment variables with target specific values built-in.
>
> And this is exactly what this sf plugin does!

## Installation

```console
sf plugins install sfdx-predeploy-hook-org-env
```

## Usage

Once you've installed this sf plugin, you can immediately use the following environment variables mentioned for the Metadata String Replacements:

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
> Do you have ideas for other target specific values which could be useful?
>
> Please get in touch by creating an issue.

**Example:**

Make sure your `sfdx-project.json` contains some `replacements` using one of the environment variables listed above.

`sfdx-project.json`:

```json
{
  "packageDirectories": [
    {
      "path": "force-app",
      "default": true
    }
  ],
  "replacements": [
    {
      "filename": "force-app/main/default/portals/Customer Portal.portal-meta.xml",
      "stringToReplace": "admin@example.com",
      "replaceWithEnv": "SFDX_TARGET_ORG_USERNAME"
    },
    {
      "filename": "force-app/main/default/portals/Customer Portal.portal-meta.xml",
      "stringToReplace": "admin@gmail.com",
      "replaceWithEnv": "SFDX_TARGET_ORG_USER_EMAIL"
    }
  ],
  "sourceApiVersion": "62.0"
}
```

Now you can run `sf project deploy start` and the Metadata replacement will automatically use the dynamically generated environment variables for the given target org:

```console
sf project deploy start -m "Portal:Customer Portal" --target-org my-target-org1
sf project deploy start -m "Portal:Customer Portal" --target-org my-target-org2
sf project deploy start -m "Portal:Customer Portal" --target-org my-target-org3
```

## Debugging

To preview the environment variables, set the environment variable `DEBUG` to `*:sfdx-predeploy-hook-org-env:*` and perform a **validation deployment** to the target org.

**Example**

MacOS/Linux:

```console
$ DEBUG="*:sfdx-predeploy-hook-org-env:*" sf project deploy start --source-dir force-app --dry-run --target-org mytargetorg
```

Windows PowerShell:

```powershell
$env:DEBUG="*:sfdx-predeploy-hook-org-env:*"
sf project deploy start --source-dir force-app --dry-run --target-org mytargetorg
```

This will output something like:

```
...
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun Setting environment variables for target org
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_ID="00D7g0000006RKmEAM"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USERNAME="john.doe@example.com"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USER_ID="0058F000002RfcKQAS"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USER_EMAIL="john.doe@gmail.com"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USER_FIRSTNAME="John"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USER_LASTNAME="Doe"
sf:oclif:sfdx-predeploy-hook-org-env:hooks:prerun SFDX_TARGET_ORG_USER_DISPLAYNAME="John Doe"
...
```
