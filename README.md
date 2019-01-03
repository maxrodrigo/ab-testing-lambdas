# Lambdas@Edge for A/B Testing 

![bookmarklet](https://img.shields.io/badge/dynamic/json.svg?label=bookmarklet&url=https://raw.githubusercontent.com/maxrodrigo/ab-testing-lambdas/master/dist/build.json&query=$.source_experiment&colorB=green&prefix=exp:&style=for-the-badge)

# Considerations

- CF Distribution Origin should whitelist the source header and cookie
- Variables have to be hard-coded because Lambdas@Edge don't allow ENV variables
- Logs are region based. If you can't find them look into a closer region.
- When pointing to an S3 avoid `Host` on `Whitelist Headers`
    > If the bucket has a different name than the domain name

