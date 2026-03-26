(function () {
  var title = document.title || null;

  var metaDescEl = document.querySelector('meta[name="description"]');
  var metaDescription = metaDescEl ? metaDescEl.getAttribute("content") : null;

  var ogTitleEl = document.querySelector('meta[property="og:title"]');
  var ogTitle = ogTitleEl ? ogTitleEl.getAttribute("content") : null;

  var h1El = document.querySelector("h1");
  var h1 = h1El ? h1El.innerText.trim() : null;

  var h2Els = document.querySelectorAll("h2");
  var h2s = [];
  for (var i = 0; i < h2Els.length; i++) {
    var text = h2Els[i].innerText.trim();
    if (text) {
      h2s.push(text);
    }
  }

  var viewportHeight = window.innerHeight;
  var buttonEls = document.querySelectorAll('a[href], button, input[type="submit"], input[type="button"]');
  var ctaButtons = [];
  for (var j = 0; j < buttonEls.length; j++) {
    var el = buttonEls[j];
    var elText = (el.innerText || el.value || "").trim();
    if (!elText) continue;
    var style = window.getComputedStyle(el);
    var isButton =
      el.tagName === "BUTTON" ||
      el.tagName === "INPUT" ||
      style.display === "inline-block" ||
      style.display === "block" ||
      el.getAttribute("role") === "button" ||
      (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent");
    if (!isButton && el.tagName === "A") {
      var hasButtonClass = el.className && /btn|button|cta/i.test(el.className);
      if (!hasButtonClass) continue;
    }
    var rect = el.getBoundingClientRect();
    var position = rect.top < viewportHeight ? "above-fold" : "below-fold";
    ctaButtons.push({
      text: elText,
      href: el.href || null,
      position: position
    });
  }

  var navContainer = document.querySelector("nav") || document.querySelector("header");
  var navLinks = [];
  if (navContainer) {
    var linkEls = navContainer.querySelectorAll("a[href]");
    for (var k = 0; k < linkEls.length; k++) {
      var linkText = linkEls[k].innerText.trim();
      if (linkText) {
        navLinks.push({
          text: linkText,
          href: linkEls[k].href
        });
      }
    }
  }

  return JSON.stringify({
    title: title,
    metaDescription: metaDescription,
    ogTitle: ogTitle,
    h1: h1,
    h2s: h2s,
    ctaButtons: ctaButtons,
    navLinks: navLinks
  });
})();
