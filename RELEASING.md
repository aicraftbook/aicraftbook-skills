# Releasing

The source of truth for every skill is the private AI Craftbook site repository (`skills/<name>/`). This
repository is generated from it, so GitHub, the website's SKILL.md viewer and the website download always
show the same approved files. Nothing here is edited by hand except through a reviewed pull request that is
then carried back to the source.

1. In the site repository: bump `version` in `skills/<name>/skill.json` and add a `## <version>` entry to its
   `CHANGELOG.md`. Rebuild the kit (`npm run kits`).
2. `npm run skills:lint` and `npm run security:scan`. First-party, text-only skills ship after a clean scan;
   anything with an acknowledged finding needs a named reviewer (`npm run security:approve`).
3. A functional evaluation is recorded on the skill's page. The owner approves a new skill's first release.
4. `npm run skills:export -- --to <this repo>` regenerates this repository. It exports only skills that are
   released, published, evaluated and cleared; it records each skill's version, file fingerprint, download URL
   and SHA-256 in `skills-index.json`.
5. Commit and push the site repository (the website deploys from `main`). Then commit and push here, and push
   the tag `<name>-v<version>`. The release workflow re-runs the checks and publishes notes that link the same
   download the website serves.
6. `npm run skills:drift` (site repository) confirms the source, this repository and the live download match.
   It also runs every week.

Only organisation admins can push to `main` without a pull request and create release tags.
