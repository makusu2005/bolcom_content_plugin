// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing



const bad = '<svg class="p-1 rounded-circle" style="background-color:#FEEDED; color:red" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'
const good = '<svg class="p-1 rounded-circle" style="background-color:#d7f5eb; color:green" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>'

var main_image = document.querySelector('[data-test="product-main-image"]').getAttribute("data-zoom-image-url");
if (main_image == null){
  var main_image = document.querySelector('[data-test="product-main-image"]').getAttribute("src");
}
      // https://stackoverflow.com/questions/17615876/how-to-get-the-color-of-a-pixel-from-image
var canvas = document.createElement("canvas");
    // check if 3/4 corners is white
var pic = new Image();
pic.crossOrigin = "Anonymous"; 
pic.onload = function() {
  var ean = document.querySelector("[data-test='taxonomy_data']").textContent;
  ean = JSON.parse(ean);
  ean = JSON.stringify(ean)
  ean = JSON.parse(ean);
  ean = ean["pdpTaxonomyObj"]["productInfo"][0]["ean"];

  var whitebg = 0
  canvas.width = pic.width;
  canvas.height = pic.height;
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(pic, 0, 0);
  var c = canvas.getContext('2d');
  var topleft = c.getImageData(0, 0, 1, 1).data;
  var topright = c.getImageData(pic.width-1, 0, 1, 1).data;
  var bottomleft = c.getImageData(0, pic.height-1, 1, 1).data;
  var bottomright = c.getImageData(pic.width-1, pic.height-1, 1, 1).data;

  if (topleft[0] > 250 && topleft[1] > 250 && topleft[2] > 250 && topleft[3] > 250){
    whitebg += 1
  }
  if (topright[0] > 250 && topright[1] > 250 && topright[2] > 250 && topright[3] > 250){
    whitebg += 1
  }
  if (bottomleft[0] > 250 && bottomleft[1] > 250 && bottomleft[2] > 250 && bottomleft[3] > 250){
    whitebg += 1
  }
  if (bottomright[0] > 250 && bottomright[1] > 250 && bottomright[2] > 250 && bottomright[3] > 250){
    whitebg += 1 
  }
  if (whitebg > 1){
          // at least two corners are white
    var whitebg_content = "White"
  }
  else {
    var whitebg_content = "Not white"
  }
  // calculate score
  var title_len_check = good
  var no_images_check = good
  var image_size_check = good
  var whitebg_content_check = good
  var description_len_check = good
  var has_video_check = good
  var no_reviews_check = good
  var review_score_check = good

  var points = 10
  if (title_len < 40){
    points *= 0.85;
    title_len_check = bad
  }
  else if (title_len < 65){
    points *= 0.9;
    title_len_check = bad
  }
  if (description_len < 400){
    points *= 0.85;
    description_len_check = bad

  }
  else if (description_len < 750){
    points *= 0.9;
    description_len_check = bad

  }
  if (no_images == 1){
    points *= 0.85;
    no_images_check = bad
  }
  else if (no_images < 3){
    points *= 0.9;
    no_images_check = bad

  }
  else if (no_images < 5){
    points *= 0.95;
    no_images_check = bad
  }

  if (pic.width < 600 || pic.height < 600){
    points *= 0.9;
    image_size_check = bad
  }

  if (whitebg_content == "Not white"){
    points -= 1.5
    whitebg_content_check = bad
  }
  if (no_reviews <= 1){
    points *= 0.85;
    no_reviews_check = bad
  }
  else if (no_reviews < 3){
    points *= 0.9;
    no_reviews_check = bad

  }
  else if (no_reviews < 5){
    points *= 0.95;
    no_reviews_check = bad

  }
  if (review_score < 3.5 && review_score != 0){
    points -= 1;
    review_score_check = bad    
  }
  else if (review_score == 0){
    review_score_check = bad 
  }
  if (has_video == "no video"){
    points -= 1
    has_video_check = bad
  }
  if (true){
  points = Math.round (points * 100) / 100
  // add only numbers in title
  // add image quality
  // add to the page
  const badge = document.createElement("div");
  const spinner = document.createElement("div");
  const spinner_inner = document.createElement("span");
  const score = document.createElement("span");
  const sdd_open = document.createElement("a");
  sdd_open.type = "button";
  sdd_open.classList.add("btn", "btn-secondary", "btn-sm", "float-end");
  sdd_open.textContent = "Open listing in SDD";
  sdd_open.id = "sdd_open"
  
  sdd_open.href = "https://partner.bol.com/click/click?p=2&t=url&s=15789&f=TXL&name=attalos&url=https://partner.bol.com/sdd/product-content/product/" + ean;
  sdd_open.target = "_blank"
  score.id = "score";
  score.classList.add("rounded", "p-2", "fs-1")
  spinner_inner.classList.add("sr-only");
  spinner.classList.add("spinner-border", "text-primary");
  spinner.id = "spinner";
  spinner.role = "status";




  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "w-50", "h-100")
  const row = document.createElement("div");
  row.classList.add("row", "g-0")
  const col1 = document.createElement("div");
  col1.classList.add("col-md-4", "rounded-left", "justify-content-center", "align-items-center", "d-flex")
  col1.style.height = "100px";
  const col2 = document.createElement("div");
  col2.classList.add("col-md-8")
  const card_body = document.createElement("div");
  card_body.classList.add("card_body")
  const card_title = document.createElement("h5");
  card_title.classList.add("card-title", "p-1")
  card_title.textContent = "Attalos content score"
  const card_text = document.createElement("p");
  card_text.classList.add("card-text", "p-1")
  card_text.textContent = 'The Attalos content score is a classification of 0 - 10 of the content of the listing.'
  score.textContent = `${points}`;  
  card.id = "popoverOption";
  card.rel = "popover";
  card.href = "#";
  card.dataset.container = "body";
  card.dataset.placement = "bottom";
  card.dataset.trigger = "hover";
  card.dataset.title = "Score calculation";
  card.dataset.content = `
<table  style="width:100%; padding: 5px;">
<tbody>
<tr>
<td colspan="2"><strong>Product Media</strong><hr style="margin-bottom:5px" /></td>
</tr>
<tr style="padding:120px">
<td>5 or more images<br /><small>current: ${no_images}</small></td>
<td style="float:right">${no_images_check}</td>
</tr>
<tr>
<td>Main image white background<br /><small>current: ${whitebg_content}</small></td>
<td style="float:right">${whitebg_content_check}

</td>
</tr>
<tr>
<td>Shortest size min 600px<br /><small>current size: ${pic.height}px x ${pic.width}px</small></td>
<td style="float:right">${image_size_check}</td>
</tr>
<tr>
<td>1 video<br /><small>current: ${has_video}</small></td>
<td style="float:right">${has_video_check}</td>
</tr>
<tr>
<td colspan="2"><br /><strong>Listing text</strong><hr style="margin-bottom:5px" /></td>
</tr>
<tr>
<td>Title length > 65 characters<br /><small>current: ${title_len}</small></td>
<td style="float:right">${title_len_check}</td>
</tr>
<tr>
<td>Description length > 750 characters<br /><small>current: ${description_len}</small></td>
<td style="float:right">${description_len_check}</td>
</tr>
<tr>
<td colspan="2" ><br /><strong>Reviews & rating</strong><hr style="margin-bottom:5px" /></td>
</tr>
<tr>
<td>At least 5 reviews<br /><small>current: ${no_reviews}</small></td>
<td style="float:right">${no_reviews_check}</td>
</tr>
<tr>
<td>Minimum review score of 3.5<br /><small>current: ${review_score}</small></td>
<td style="float:right">${review_score_check}</td>
</tr>

</tbody>
</table>`;

  title.insertAdjacentElement("beforebegin", card);
  card.insertAdjacentElement("afterbegin", row);
  row.insertAdjacentElement("afterbegin", col1);
  col1.insertAdjacentElement("afterbegin", spinner);
  spinner.insertAdjacentElement("afterbegin", spinner_inner);
  row.insertAdjacentElement("beforeend", col2);
  col2.insertAdjacentElement("afterbegin", card_body)
  card_body.insertAdjacentElement("afterbegin", card_title)
  card_body.insertAdjacentElement("beforeend", card_text)
  // <button type="button" class="btn btn-secondary btn-sm">Small button</button>

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
  $( document ).ready(function() {
    $('#popoverOption').popover({html:true, placement: 'bottom'});
  });
  setTimeout(function() {
    $('#spinner').hide();
  }, 1500); // <-- time in milliseconds
  setTimeout(function() {
    if (points < 5){
      col1.classList.add("bg-danger")
    }
    else if (points < 7.5){
      col1.classList.add("bg-warning")

    }
    else {
      col1.classList.add("bg-success") 

    }
    col2.insertAdjacentElement("afterbegin", sdd_open);
    col1.insertAdjacentElement("afterbegin", score);
    // hide url 
    $('a[href]#sdd_open').each(function () {
      var href = this.href;

      $(this).removeAttr('href').css('cursor', 'pointer').click(function () {
        if (href.toLowerCase().indexOf("#") >= 0) {

        } else {
          window.open(href, '_blank');
        }
      });
    });

  }, 1500);
  } // <-- time in milliseconds
}
  pic.src = main_image; 
  var description = document.querySelector(".product-description");
  var globalid = document.querySelector('[data-test="add-to-basket"]').id;
  var title_text = document.querySelector('[data-test="title"]');
  var title = document.querySelector(".page-heading");
  var reviews = document.querySelector('[data-test="rating-suffix"]');
  var video = document.querySelector('[data-test="button-play"]');
  var images = document.querySelectorAll('.image-slot-thumb');
  if (title_text) {
    const text = title_text.textContent;
    const wordMatchRegExp = /[^\s]+/g;
    const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
    var wordCount_title = [...words].length;
    var title_len = text.length;
  }

  if (reviews) {
    const text = reviews.textContent;
    var review_score = text.split("/")[0];
    review_score = review_score.replace(",", ".")
    var review_score = Number(review_score); 
    var no_reviews = text.split(" (")[1];
    no_reviews = no_reviews.split(" ")[0];
    no_reviews = Number(no_reviews)
  }
  else {
    review_score = 0
    no_reviews = 0
  }
  if (description) {
    const text = description.textContent;
  /**
   * Regular expression to find all "words" in a string.
   *
   * Here, a "word" is a sequence of one or more non-whitespace characters in a row. We don't use the
   * regular expression character class "\w" to match against "word characters" because it only
   * matches against the Latin alphabet. Instead, we match against any sequence of characters that
   * *are not* a whitespace characters. See the below link for more information.
   * 
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
   */
    const wordMatchRegExp = /[^\s]+/g;
    const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
    var wordCount_description = [...words].length;
    var description_len = text.length;
  }
  if (video) {
    var has_video = 'has video'
  }
  else {
    var has_video = 'no video'
  }

  if (images) {
    no_images = images.length;
    if (video){
      no_images -= 1;
    }
    if (no_images == 0){
      no_images = 1;
    }

  }
  else {
    no_images = 1;
  }





