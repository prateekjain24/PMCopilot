# Browser Extraction Scripts

JavaScript scripts injected into web pages by the web-teardown agent via Chrome automation. Located in `extraction/`.

## Scripts

| Script | Extracts |
|--------|----------|
| `homepage.js` | Hero text, CTAs, navigation structure, key features |
| `pricing.js` | Plan names, prices, feature lists, billing options |
| `seo.js` | Meta tags, Open Graph, structured data, canonical URLs |
| `techstack.js` | Detected frameworks, analytics, CDNs, third-party scripts |

## Pattern

All scripts follow the same pattern:
- **IIFE** (Immediately Invoked Function Expression) returning a JSON string
- Use `var` (not `let`/`const`) for maximum browser compatibility
- No side effects — read-only DOM access
- Return `JSON.stringify(result)` for the agent to parse
- Handle missing elements gracefully (return `null` for absent data)

## Example Structure

```javascript
(function() {
  var result = {
    title: document.title || null,
    // ... extraction logic
  };
  return JSON.stringify(result);
})();
```
