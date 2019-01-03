javascript: (function() {
    var c = document.cookie.split("; ");
    var cn = "_yd_ab_source";
    var sa = "G2bHPu5G";
    var sb = "0rlHlu9d";
    for (var i in c) {
        if (c[i].indexOf(cn) >= 0) {
            document.cookie = cn + "=" + (c[i].indexOf(sa) >= 0 ? sb : sa) + "; Path=/; Domain=.yourdictionary.com";
            break;
        }
    }
    location.reload();
})();
