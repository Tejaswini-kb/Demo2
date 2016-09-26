/*!
 * cookie-monster - a simple cookie library
 * v0.2.0
 * https://github.com/jgallen23/cookie-monster
 * copyright Greg Allen 2013
 * MIT License
 */
var monster = {
  set: function(name, value, days, path, secure) {
    var date = new Date(),
    expires = '',
    type = typeof(value),
    valueToUse = '',
    secureFlag = '';
    path = path || "/";
    if (days) {
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    if (type === "object"  && type !== "undefined") {
      if(!("JSON" in window)) throw "Bummer, your browser doesn't support JSON parsing.";
      valueToUse = JSON.stringify({v:value});
    } else {
      valueToUse = encodeURIComponent(value);
    }
    if (secure){
      secureFlag = "; secure";
    }

    document.cookie = name + "=" + valueToUse + expires + "; path=" + path + secureFlag;
  },
  get: function(name) {
    var nameEQ = name + "=",
    ca = document.cookie.split(';'),
    value = '',
    firstChar = '',
    parsed={};
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        value = c.substring(nameEQ.length, c.length);
        firstChar = value.substring(0, 1);
        if(firstChar=="{"){
          parsed = JSON.parse(value);
          if("v" in parsed) return parsed.v;
        }
        if (value=="undefined") return undefined;
        return decodeURIComponent(value);
      }
    }
    return null;
  },
  remove: function(name) {
    this.set(name, "", -1);
  },
  increment: function(name, days) {
    var value = this.get(name) || 0;
    this.set(name, (parseInt(value, 10) + 1), days);
  },
  decrement: function(name, days) {
    var value = this.get(name) || 0;
    this.set(name, (parseInt(value, 10) - 1), days);
  }
};

// IIFE for AllYou mobile detection.
(function(cookie, redirect){
  var cookieName = "TI_PREFS";
  var cookieValue = cookie.get(cookieName);

  var match = function(pattern) {
    return pattern.test(navigator.userAgent);
  };

  var mobileRedirect = function() {
    var l = document.location;
    var destination;

   /** if (!(/^\/m\//.test(l.pathname))) {
      // Cookie orig_ref is for ominiture tracking across redirects
      // So the referrer does not get lost when redirecting to mobile from desktop
      monster.set('orig_ref', document.referrer, 1);
      destination = l.protocol + "//" + l.host + "" + l.pathname;

      if (l.search) {
        destination += l.search;
      }

      if (l.hash) {
        destination += l.hash;
      }

      setTimeout(function(destination){
        document.location.replace(destination);
      }.bind(this, destination), 0);
    }
  };**/

  // Bail (and possibly redirect) if the cookie is already set to a proper value.
  if (cookieValue == "phone") {
    if (redirect === true) {
      mobileRedirect();
    }
    return;
  }
  else if (cookieValue == "default") {
    return;
  }

  if (!(window.navigator && navigator.userAgent)) {
    // If we can't get the user agent, assume desktop.
    cookie.set(cookieName, "default");
  }

  // This has been converted from https://github.com/varnish/varnish-devicedetect/.
  if (match(/(ads|google|bing|msn|yandex|baidu|ro|career|)bot/i) ||
      match(/(baidu|jike|symantec)spider/i) ||
      match(/scanner/i) ||
      match(/(web)crawler/i)) {
        cookieValue = "default";
      }
  else if (match(/ipad/i)) {
    cookieValue = "default";
  }
  else if (match(/ip(hone|od)/i)) {
    cookieValue = "phone";
  }
  /* how do we differ between an android phone and an android tablet?
   *        http://stackoverflow.com/questions/5341637/how-do-detect-android-tablets-in-general-useragent */
  else if (match(/android.*(mobile|mini)/i)) {
    cookieValue = "phone";
  }
  // android 3/honeycomb was just about tablet-only, and any phones will probably handle a bigger page layout.
  else if (match(/android 3/i)) {
    cookieValue = "default";
  }
  // May very well give false positives towards android tablets. Suggestions welcome.
  else if (match(/android/i)) {
    cookieValue = "default";
  }
  else if (match(/Mobile.+Firefox/)) {
    cookieValue = "phone";
  }
  else if (match(/^HTC/) ||
      match(/Fennec/) ||
      match(/IEMobile/) ||
      match(/BlackBerry/) ||
      match(/SymbianOS.*AppleWebKit/) ||
      match(/Opera Mobi/)) {
        cookieValue = "phone";
      }
  else if (match(/symbian/i) ||
      match(/^sonyericsson/i) ||
      match(/^nokia/i) ||
      match(/^samsung/i) ||
      match(/^lg/i) ||
      match(/bada/i) ||
      match(/blazer/i) ||
      match(/cellphone/i) ||
      match(/iemobile/i) ||
      match(/midp-2.0/i) ||
      match(/u990/i) ||
      match(/netfront/i) ||
      match(/opera mini/i) ||
      match(/palm/i) ||
      match(/nintendo wii/i) ||
      match(/playstation portable/i) ||
      match(/portalmmm/i) ||
      match(/proxinet/i) ||
      match(/sonyericsson/i) ||
      match(/symbian/i) ||
      match(/windows\ ?ce/i) ||
      match(/winwap/i) ||
      match(/eudoraweb/i) ||
      match(/htc/i) ||
      match(/240x320/i) ||
      match(/avantgo/i)) {
        cookieValue = "phone";
      }

  cookie.set(cookieName, cookieValue);
  if (cookieValue == "phone") {
    if (redirect === true) {
      mobileRedirect();
    }
  }
}(monster, LSGMobileRedirect));
