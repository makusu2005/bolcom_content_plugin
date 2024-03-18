var ean = document.querySelector("[data-test='taxonomy_data']").textContent;
ean = JSON.parse(ean);
ean = JSON.stringify(ean)
ean = JSON.parse(ean);
ean = ean["pdpTaxonomyObj"]["productInfo"][0]["ean"];
var globalid = document.querySelector('[data-test="add-to-basket"]').id;

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

