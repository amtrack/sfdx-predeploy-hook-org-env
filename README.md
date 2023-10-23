# sfdx-predeploy-hook-org-env

> sfdx predeploy hook to export target org details as environment variables

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
export ORG_USERNAME="$(node -pe 'JSON.parse(fs.readFileSync(0, "utf8")).result.username' < <(sfdx force:org:display -u my-target-org --json))"
sfdx force source deploy -p "force-app/main/default/portals/Customer Portal.portal-meta.xml" -u my-target-org
```

Although this works just fine, we need to remember to set this environment variable before deploying or pushing.

> **Note**
>
> For common things like username, email address, org id, it would be handy to have these environment variables with target specific values built-in.
>
> And this is exactly what this sfdx plugin does!

## Installation

```console
sfdx plugins install sfdx-predeploy-hook-org-env
```

## Usage

Once you've installed this sfdx plugin, you can immediately use the following environment variables mentioned for the Metadata String Replacements:

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
  "sourceApiVersion": "57.0"
}
```

Now you can run `sfdx force source push` or `sfdx force source deploy` and the Metadata replacement will automatically use the dynamically generated environment variables for the given target org:

```console
sfdx force source deploy -p "Portal:Customer Portal" -u my-target-org1
sfdx force source deploy -p "Portal:Customer Portal" -u my-target-org2
sfdx force source deploy -p "Portal:Customer Portal" -u my-target-org3
```

## Debugging

To preview the environment variables, set the environment variable `DEBUG` to `*:sfdx-predeploy-hook-org-env:*` and perform a **validation deployment** to the target org.

**Example**

MacOS/Linux:

```console
$ DEBUG="*:sfdx-predeploy-hook-org-env:*" sfdx force source deploy --checkonly -u mytargetorg -p force-app
```

Windows PowerShell:

```powershell
$env:DEBUG="*:sfdx-predeploy-hook-org-env:*"
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
