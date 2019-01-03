(function() {
    var c = document.cookie.split("; ");
    var cn = "{cookie_name}";
    var sa = "{source_main}";
    var sb = "{source_experiment}";
    for (var i in c) {
        if (c[i].indexOf(cn) >= 0) {
            document.cookie = cn + "=" + (c[i].indexOf(sa) >= 0 ? sb : sa) + "; Path=/; Domain=.yourdictionary.com";
            break;
        }
    }
    location.reload();
})();
