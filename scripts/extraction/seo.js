(function () {
  // Title
  var title = document.title || null;

  // Meta description
  var descEl = document.querySelector('meta[name="description"]');
  var description = descEl ? descEl.getAttribute("content") : null;

  // Canonical URL
  var canonicalEl = document.querySelector('link[rel="canonical"]');
  var canonical = canonicalEl ? canonicalEl.getAttribute("href") : null;

  // Robots meta
  var robotsEl = document.querySelector('meta[name="robots"]');
  var robots = robotsEl ? robotsEl.getAttribute("content") : null;

  // Open Graph tags
  var ogTags = {};
  var ogEls = document.querySelectorAll('meta[property^="og:"]');
  for (var i = 0; i < ogEls.length; i++) {
    var property = ogEls[i].getAttribute("property");
    var content = ogEls[i].getAttribute("content");
    if (property && content) {
      ogTags[property] = content;
    }
  }

  // Twitter Card tags
  var twitterCards = {};
  var twitterEls = document.querySelectorAll('meta[name^="twitter:"]');
  for (var j = 0; j < twitterEls.length; j++) {
    var tName = twitterEls[j].getAttribute("name");
    var tContent = twitterEls[j].getAttribute("content");
    if (tName && tContent) {
      twitterCards[tName] = tContent;
    }
  }

  // Structured data (JSON-LD)
  var structuredData = [];
  var jsonLdEls = document.querySelectorAll('script[type="application/ld+json"]');
  for (var k = 0; k < jsonLdEls.length; k++) {
    var raw = jsonLdEls[k].textContent || "";
    try {
      var parsed = JSON.parse(raw);
      structuredData.push(parsed);
    } catch (e) {
      // Malformed JSON-LD -- skip this entry
    }
  }

  // Hreflang tags
  var hreflang = [];
  var hreflangEls = document.querySelectorAll('link[rel="alternate"][hreflang]');
  for (var l = 0; l < hreflangEls.length; l++) {
    hreflang.push({
      lang: hreflangEls[l].getAttribute("hreflang"),
      href: hreflangEls[l].getAttribute("href")
    });
  }

  // Headings
  var headings = { h1: [], h2: [], h3: [] };
  var h1Els = document.querySelectorAll("h1");
  for (var m = 0; m < h1Els.length; m++) {
    var h1Text = h1Els[m].innerText.trim();
    if (h1Text) headings.h1.push(h1Text);
  }
  var h2Els = document.querySelectorAll("h2");
  for (var n = 0; n < h2Els.length; n++) {
    var h2Text = h2Els[n].innerText.trim();
    if (h2Text) headings.h2.push(h2Text);
  }
  var h3Els = document.querySelectorAll("h3");
  for (var o = 0; o < h3Els.length; o++) {
    var h3Text = h3Els[o].innerText.trim();
    if (h3Text) headings.h3.push(h3Text);
  }

  return JSON.stringify({
    title: title,
    description: description,
    canonical: canonical,
    robots: robots,
    ogTags: ogTags,
    twitterCards: twitterCards,
    structuredData: structuredData,
    hreflang: hreflang,
    headings: headings
  });
})();
