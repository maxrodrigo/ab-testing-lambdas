# ab-testing-lambdas
AWS Lambdas for A/B Testing 

# Considerations

- CF Distribution Origin should whitelist the source header/cookie (X-Source)
- Vars have to be hard coded because Lambdas@Edge don't allow ENV variables
- Logs are region based. If you can see them look into a different region.
