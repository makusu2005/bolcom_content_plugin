// ✅ Define helper function first
function extractEanFromJsonLd() {
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const s of scripts) {
      const text = s.textContent.trim();
      if (!text) continue;

      const data = JSON.parse(text);
      const objs = Array.isArray(data) ? data : [data];

      for (const obj of objs) {
        if (!obj || typeof obj !== "object") continue;
        const type = (obj["@type"] || "").toLowerCase();
        if (!["product", "productgroup"].includes(type)) continue;

        if (obj.gtin13) return obj.gtin13;
        if (obj.ean) return obj.ean;

        if (Array.isArray(obj.hasVariant)) {
          const found = obj.hasVariant.find(v => v.gtin13 || v.ean || v.gtin);
          if (found) return found.gtin13 || found.ean || found.gtin;
        }

        if (Array.isArray(obj.identifier)) {
          const found = obj.identifier.find(id =>
            ["gtin13", "ean", "gtin"].includes((id.propertyID || "").toLowerCase())
          );
          if (found) return found.value;
        }
      }
    }
  } catch (err) {
    console.error("❌ JSON-LD parse error:", err);
  }
  return null;
}

// ✅ Then call it once, outside the function
const ean = extractEanFromJsonLd();

if (ean) {
  console.log("✅ Extracted EAN:", ean);
} else {
  console.warn("⚠️ No EAN found in JSON-LD");
}

// You can still log the full object for debugging if you like:
const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
if (jsonLdScript) {
  try {
    const jsonData = JSON.parse(jsonLdScript.textContent.trim());
    console.log("✅ Full JSON-LD object:", jsonData);
  } catch (err) {
    console.error("❌ Failed to parse JSON-LD:", err);
  }
}

// ====================
// 🔽 Your existing code
// ====================

var globalid = document.querySelector('[rel="canonical"]').href.split("/").slice(-2, -1)[0];

const sdd_open = document.createElement("a");
sdd_open.type = "button";
sdd_open.classList.add("btn", "btn-secondary", "btn-sm", "float-left", "bg-attalos", "border-attalos", "m-1");
sdd_open.textContent = "SDD productoverzicht";
sdd_open.id = "sdd_open";
sdd_open.href = `https://attalosagency.com/out/index.php?url=https://partner.bol.com/sdd/product-overview/products/${globalid}`;
sdd_open.target = "_blank";

const prod_open = document.createElement("a");
prod_open.type = "button";
prod_open.classList.add("btn", "btn-secondary", "btn-sm", "float-left", "bg-attalos", "border-attalos");
prod_open.textContent = "SDD productcontent";
prod_open.id = "prod_open";
prod_open.href = `https://attalosagency.com/out/index.php?url=https://partner.bol.com/sdd/product-content/product/${ean}`;
prod_open.target = "_blank";

const card = document.createElement("div");
card.classList.add("card", "mb-3", "w-50", "h-100", "border-danger");

const title = document.querySelector(".page-heading");
const links = document.createElement("div");
title.insertAdjacentElement("beforebegin", links);
links.insertAdjacentElement("beforebegin", sdd_open);
links.insertAdjacentElement("beforebegin", prod_open);

title.insertAdjacentElement("beforebegin", card);
card.innerHTML =
  "<div class='m-2'>You're currently not logged in, please <a href='https://attalosagency.com/user-login/' target='_blank'>login</a> to see the Attalos content score of this product.</div>";

// 🔥 Remove Bol.com tooltips that interfere with clicks
function removeBadTooltips() {
  document.querySelectorAll(".tooltip.js_tooltip_content").forEach(el => {
    console.log("⚠️ Removing interfering tooltip:", el.id || el);
    el.remove();
  });
}
removeBadTooltips();
new MutationObserver(removeBadTooltips).observe(document.body, { childList: true, subtree: true });
