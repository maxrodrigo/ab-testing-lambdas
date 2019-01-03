# AWS Lambdas@Edge for A/B Testing 

```js
javascript:!function(){var o=document.cookie.split(\"; \"),i=\"_yd_ab_source\",n=\"G2bHPu5G\";for(var a in o)if(o[a].indexOf(i)>=0){document.cookie=i+\"=\"+(o[a].indexOf(n)>=0?\"0rlHlu9d\":n)+\"; Path=\/; Domain=.yourdictionary.com\";break}location.reload()}();
```

# Considerations

- CF Distribution Origin should whitelist the source header and cookie
- Variables have to be hard-coded because Lambdas@Edge don't allow ENV variables
- Logs are region based. If you can't find them look into a closer region.
- When pointing to an S3 avoid `Host` on `Whitelist Headers`
    > If the bucket has a different name than the domain name
