const card = document.createElement("div");
card.classList.add("card", "mb-3", "w-50", "h-100", "border-danger");
var title = document.querySelector(".page-heading");
title.insertAdjacentElement("beforebegin", card);
card.innerHTML = "<div class='m-2'>You're currently not logged in, please <a href='https://attalosagency.com/user-login/' target=_'blank'>login</a> to see the Attalos content score of this product.</div>"