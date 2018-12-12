# ab-testing-lambdas
AWS Lambdas for A/B Testing 

# Considerations

- CF Distribution Origin should whitelist the source header/cookie (X-Source)
- Vars have to be hard coded because Lambdas@Edge don't allow ENV variables
- Logs are region based. If you can see them look into a different region.
- When pointing to an S3 avoid `Host` on `Whitelist Headers`
    > If the bucket has a different name than the domain name

## Cookie switcher bookmarklet

```js
javascript:(function(){var c=document.cookie.split("; ");for(var i in c){if(c[i].indexOf("X-Source")>=0){document.cookie="X-Source="+(c[i].indexOf("yd-v1")>=0?"yd-v2":"yd-v1")+";path=/";break}location.reload()}})()
```
