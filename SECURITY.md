# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| Latest 0.x minor | Yes |
| Previous 0.x minor | Security fixes for 3 months after the next minor |
| Older | No |

## Reporting a vulnerability

Please **do not** open a public issue, discussion or pull request for a security problem.

Report it privately through GitHub's private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability**, or go directly to <https://github.com/ahmetcantryk/merid/security/advisories/new>.

Include what you found, how to reproduce it, the affected versions and the impact you expect.

## What happens next

- You will get an acknowledgement within 5 working days.
- We will confirm the issue, agree on severity with you, and keep you updated in the advisory.
- A fix is released as a patch, and the advisory is published with credit to you unless you prefer to stay anonymous.

## Scope

Merid is a client-side UI library. Relevant reports include cross-site scripting through component props, unsafe handling of user content, and supply-chain issues in the published package. Vulnerabilities in the documentation site are also in scope.
