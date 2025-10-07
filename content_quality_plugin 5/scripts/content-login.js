  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (jsonLdScript) {
    try {
      const jsonLdText = jsonLdScript.textContent.trim();
      const jsonData = JSON.parse(jsonLdText);

      console.log("✅ Full JSON-LD object:", jsonData);

      // Basic info
      if (jsonData.name) {
        console.log("Product name:", jsonData.name);
      }
      if (jsonData.description) {
        console.log("Description:", jsonData.description);
      }

      // Get all GTIN13 values from variants
      if (jsonData.hasVariant && Array.isArray(jsonData.hasVariant)) {
        const eans = jsonData.hasVariant
          .map(v => v.gtin13)
          .filter(Boolean);
        console.log("Found GTIN13 values:", eans);
        if (eans.length > 0) {
          ean = eans[0]; // pick the first one if you just need one
        }
      }

      if (!ean) {
        console.log("⚠️ No GTIN13 found, falling back.");
      }

    } catch (err) {
      console.error("❌ Failed to parse JSON-LD:", err);
    }
  } else {
    console.log("⚠️ JSON-LD script not found.");
  }

var globalid = document.querySelector('[rel="canonical"]').href;
var segments = globalid.split('/');
var globalid = segments[segments.length - 2];

const sdd_open = document.createElement("a");
sdd_open.type = "button";
sdd_open.classList.add("btn", "btn-secondary", "btn-sm", "float-left", "bg-attalos", "border-attalos", "m-1");
sdd_open.textContent = "SDD productoverzicht";
sdd_open.id = "sdd_open"

sdd_open.href = "https://attalosagency.com/out/index.php?url=https://partner.bol.com/sdd/product-overview/products/" + globalid;
sdd_open.target = "_blank"

const prod_open = document.createElement("a");
prod_open.type = "button";
prod_open.classList.add("btn", "btn-secondary", "btn-sm", "float-left", "bg-attalos", "border-attalos");
prod_open.textContent = "SDD productcontent";
prod_open.id = "prod_open"

prod_open.href = "https://attalosagency.com/out/index.php?url=https://partner.bol.com/sdd/product-content/product/" + ean;
prod_open.target = "_blank"




const card = document.createElement("div");
card.classList.add("card", "mb-3", "w-50", "h-100", "border-danger");



var title = document.querySelector(".page-heading");

const links = document.createElement("div");
title.insertAdjacentElement("beforebegin", links);
links.insertAdjacentElement("beforebegin", sdd_open);
links.insertAdjacentElement("beforebegin", prod_open);

title.insertAdjacentElement("beforebegin", card);
card.innerHTML = "<div class='m-2'>You're currently not logged in, please <a href='https://attalosagency.com/user-login/' target=_'blank'>login</a> to see the Attalos content score of this product.</div>"

// 🔥 Remove any Bol.com tooltip popovers that interfere with clicks
function removeBadTooltips() {
  document.querySelectorAll('.tooltip.js_tooltip_content').forEach(el => {
    console.log("⚠️ Removing interfering tooltip:", el.id || el);
    el.remove();
  });
}

// Run once immediately
removeBadTooltips();

// Keep watching, because Bol.com often reinjects them dynamically
const observer = new MutationObserver(() => removeBadTooltips());
observer.observe(document.body, { childList: true, subtree: true });
