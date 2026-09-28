# Changesets

This folder holds pending release notes. Every pull request that changes the published package (`@merid/react`) should add one:

```bash
npx changeset
```

Choose the bump type (patch, minor or major — see the versioning policy in the docs) and write one or two sentences that a user of the library can act on. The release workflow collects changesets into a version pull request and publishes to npm when it is merged.

Documentation-only changes to `apps/docs` do not need a changeset.
