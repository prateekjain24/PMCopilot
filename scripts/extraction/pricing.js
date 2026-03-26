(function () {
  function parsePrice(text) {
    if (!text) return null;
    var match = text.match(/[\$\u00A3\u20AC]?\s*([\d,]+(?:\.\d{1,2})?)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
    return null;
  }

  function parseCurrency(text) {
    if (!text) return null;
    if (/\$/.test(text)) return "USD";
    if (/\u00A3/.test(text)) return "GBP";
    if (/\u20AC/.test(text)) return "EUR";
    return null;
  }

  function isMonthlyPrice(text) {
    return /\/\s*(mo|month|monthly)/i.test(text);
  }

  function isAnnualPrice(text) {
    return /\/\s*(yr|year|annually|annual)/i.test(text);
  }

  var tiers = [];

  // Common selectors for pricing cards/sections
  var cardSelectors = [
    '[class*="pricing-card"]',
    '[class*="pricing-plan"]',
    '[class*="pricing-tier"]',
    '[class*="plan-card"]',
    '[class*="price-card"]',
    '[class*="pricing"] [class*="card"]',
    '[class*="pricing"] [class*="col"]',
    '[class*="tier"]',
    '[data-tier]',
    '[data-plan]'
  ];

  var cards = [];
  for (var s = 0; s < cardSelectors.length; s++) {
    var found = document.querySelectorAll(cardSelectors[s]);
    if (found.length > 1) {
      cards = found;
      break;
    }
  }

  // Fallback: look for repeated sibling structures within a pricing section
  if (cards.length === 0) {
    var pricingSection = document.querySelector('[class*="pricing"]') || document.querySelector("#pricing");
    if (pricingSection) {
      var children = pricingSection.children;
      if (children.length > 1) {
        cards = children;
      }
    }
  }

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardText = card.innerText || "";

    // Extract tier name (usually h2, h3, or first prominent text)
    var nameEl = card.querySelector("h2, h3, h4, [class*='name'], [class*='title']");
    var name = nameEl ? nameEl.innerText.trim() : null;

    // Extract prices
    var priceEls = card.querySelectorAll('[class*="price"], [class*="amount"], [class*="cost"]');
    var monthlyPrice = null;
    var annualPrice = null;
    var currency = null;

    if (priceEls.length > 0) {
      for (var p = 0; p < priceEls.length; p++) {
        var priceText = priceEls[p].innerText.trim();
        var parsed = parsePrice(priceText);
        if (parsed !== null) {
          if (!currency) currency = parseCurrency(priceText);
          if (isAnnualPrice(priceText)) {
            annualPrice = parsed;
          } else {
            monthlyPrice = parsed;
          }
        }
      }
    } else {
      // Fallback: scan card text for price patterns
      var priceMatches = cardText.match(/[\$\u00A3\u20AC]\s*[\d,]+(?:\.\d{1,2})?[^]*?\/\s*\w+/g);
      if (priceMatches) {
        for (var m = 0; m < priceMatches.length; m++) {
          var pm = priceMatches[m];
          var parsedFallback = parsePrice(pm);
          if (parsedFallback !== null) {
            if (!currency) currency = parseCurrency(pm);
            if (isAnnualPrice(pm)) {
              annualPrice = parsedFallback;
            } else {
              monthlyPrice = parsedFallback;
            }
          }
        }
      }
    }

    // Extract features list
    var features = [];
    var featureEls = card.querySelectorAll("li, [class*='feature']");
    for (var f = 0; f < featureEls.length; f++) {
      var featureText = featureEls[f].innerText.trim();
      if (featureText && featureText.length < 200) {
        features.push(featureText);
      }
    }

    // Check if highlighted/recommended
    var highlighted = false;
    var cardClasses = (card.className || "").toLowerCase();
    var cardAttrs = card.outerHTML.substring(0, 500).toLowerCase();
    if (
      /popular|recommended|featured|highlight|best|primary|selected/.test(cardClasses) ||
      /popular|recommended|featured|best.value/.test(cardAttrs) ||
      card.querySelector('[class*="popular"], [class*="recommended"], [class*="badge"]')
    ) {
      highlighted = true;
    }

    // Extract CTA
    var ctaEl = card.querySelector('a[href], button');
    var ctaText = ctaEl ? (ctaEl.innerText || "").trim() : null;
    var ctaHref = ctaEl && ctaEl.href ? ctaEl.href : null;

    if (name || monthlyPrice !== null || annualPrice !== null) {
      tiers.push({
        name: name,
        monthlyPrice: monthlyPrice,
        annualPrice: annualPrice,
        currency: currency,
        features: features,
        highlighted: highlighted,
        ctaText: ctaText,
        ctaHref: ctaHref
      });
    }
  }

  // Enterprise CTA
  var enterpriseCTA = null;
  var enterpriseLinks = document.querySelectorAll('a[href*="contact"], a[href*="enterprise"], a[href*="sales"]');
  for (var e = 0; e < enterpriseLinks.length; e++) {
    var eText = (enterpriseLinks[e].innerText || "").trim().toLowerCase();
    if (/contact|enterprise|sales|talk|demo/i.test(eText)) {
      enterpriseCTA = {
        text: enterpriseLinks[e].innerText.trim(),
        href: enterpriseLinks[e].href
      };
      break;
    }
  }

  // Billing toggle
  var billingToggle = !!(
    document.querySelector('[class*="toggle"][class*="bill"]') ||
    document.querySelector('[class*="billing"] [class*="toggle"]') ||
    document.querySelector('[class*="switch"][class*="annual"]') ||
    document.querySelector('input[type="checkbox"][class*="billing"]') ||
    document.querySelector('[role="switch"]')
  );

  // Free trial
  var pageText = (document.body.innerText || "").toLowerCase();
  var freeTrialAvailable =
    /free trial|start free|try free|try for free|14[- ]day|30[- ]day trial|7[- ]day trial/.test(pageText);

  // Comparison table
  var comparisonTable = !!(
    document.querySelector('table[class*="comparison"]') ||
    document.querySelector('[class*="comparison"] table') ||
    document.querySelector('table[class*="feature"]') ||
    document.querySelector('[class*="feature-comparison"]')
  );

  return JSON.stringify({
    tiers: tiers,
    enterpriseCTA: enterpriseCTA,
    billingToggle: billingToggle,
    freeTrialAvailable: freeTrialAvailable,
    comparisonTable: comparisonTable
  });
})();
