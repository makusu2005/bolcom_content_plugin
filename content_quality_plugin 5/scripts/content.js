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



chrome.storage.sync.get(["on"]).then((result) => {
  var switchStatus = result.on

  if (switchStatus){
    const bad = '<svg class="p-1 rounded-circle" style="background-color:#FEEDED; color:red" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'
    const good = '<svg class="p-1 rounded-circle" style="background-color:#d7f5eb; color:green" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>'

    //var main_image = document.querySelector('[data-test="product-main-image"]').getAttribute("data-zoom-image-url");
    // Step 1: Select the script tag containing the JSON data
    const scriptTag = document.querySelector('script[data-image-slot-config]');

    // Step 2: Retrieve the JSON data from the script tag
    const jsonData = scriptTag.textContent.trim();

    // Step 3: Parse the JSON data to an object
    const imageData = JSON.parse(jsonData);

    // Step 4: Access the zoomImageUrl property of the first object in the array
    var main_image = imageData[0].zoomImageUrl;
    
    if (main_image == null){
      var main_image = document.querySelector('[data-test="product-main-image"]').getAttribute("src");
    }


    var hasVideo = false;
    for (const item of imageData) {
        if (item.isVideo) {
            hasVideo = true;
            break;
        }
    }

      // https://stackoverflow.com/questions/17615876/how-to-get-the-color-of-a-pixel-from-image
    var canvas = document.createElement("canvas");
    // check if 3/4 corners is white
    var pic = new Image();
    pic.crossOrigin = "Anonymous"; 
    pic.onload = function() {

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
      var reg = /^\d+$/;
  //if (title_text)
      if (title_len < 40){
        points *= 0.85;
        title_len_check = bad
      }
      else if (title_len < 65){
        points *= 0.9;
        title_len_check = bad
      }
      if (description_len == undefined) {
        description_len = 0
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
      if (hasVideo == false){
        points -= 1
        has_video_check = bad
      }
      title_num = (reg.test(title_text))
      if (title_num){
        points = 2;
        title_len = '<b>Title only contains numbers</b>'
      }
      if (true){
        points = Math.round (points * 10) / 10
        // add only numbers in title
        // add image quality
        // add to the page

        const badge = document.createElement("div");
        const spinner = document.createElement("div");
        const spinner_inner = document.createElement("span");
        const score = document.createElement("span");
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
        prod_open.id = "sdd_open"

        prod_open.href = "https://attalosagency.com/out/index.php?url=https://partner.bol.com/sdd/product-content/product/" + ean;
        prod_open.target = "_blank"

        score.id = "score";
        score.classList.add("rounded", "p-2", "fs-1")
        spinner_inner.classList.add("sr-only");
        spinner.classList.add("spinner-border", "text-primary");
        spinner.id = "spinner";
        spinner.role = "status";



        const links = document.createElement("div");
        const card = document.createElement("div");
        card.classList.add("card", "mb-3", "w-50", "h-100", "no-border", "p-3")
        const row = document.createElement("div");
        row.classList.add("row", "g-0")
        const col1 = document.createElement("div");
        col1.classList.add("col-md-2", "rounded-circle", "justify-content-center", "align-items-center", "d-flex", "border-attalos")
        col1.style.height = "100px";
        const col2 = document.createElement("div");
        col2.classList.add("col-md-10")
        const card_body = document.createElement("div");
        card_body.classList.add("card_body")
        const card_text = document.createElement("p");
        card_text.classList.add("card_text")

        card_text.innerHTML = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 110"><defs><style>.cls-3{fill:#37ae84}</style></defs><path d="M49.98 108.28c-25.23 0-45.75-20.52-45.75-45.75s20.52-45.76 45.75-45.76 45.75 20.52 45.75 45.75-20.52 45.75-45.75 45.75Zm0-88c-23.3 0-42.25 18.95-42.25 42.25s18.95 42.25 42.25 42.25 42.25-18.95 42.25-42.25-18.95-42.25-42.25-42.25Z" style="fill:#d5bb5e"/><path style="fill:#fff" d="M30.23 3.12h44.5v51.5h-44.5z"/><rect class="cls-3" x="21.73" y="69.12" width="57" height="10" rx="2" ry="2"/><path class="cls-3" d="M62.23 42.12c-1.1 0-2-.9-2-2V6.62l9.5-3.5v37c0 1.1-.9 2-2 2h-5.5ZM46.73 47.62c-1.1 0-2-.9-2-2v-33.5l10-3.5v37c0 1.1-.9 2-2 2h-6ZM32.23 52.62c-1.1 0-2-.9-2-2V17.57l10-3.45v36.5c0 1.1-.9 2-2 2h-6ZM71.73 65.12h-44v-5c0-1.1.9-2 2-2h40c1.1 0 2 .9 2 2v5ZM129.41 80.4c-3.64 0-7.01-.85-10.12-2.55-3.05-1.76-5.52-4.22-7.39-7.39-1.82-3.23-2.73-6.98-2.73-11.26s.79-7.92 2.38-11.09c1.64-3.17 3.96-5.63 6.95-7.39 2.99-1.76 6.51-2.64 10.56-2.64 2.35 0 4.55.41 6.6 1.23 2.05.82 3.78 1.85 5.19 3.08 1.41 1.17 2.35 2.35 2.82 3.52l.18-6.78h9.06v40.39h-8.98l-.18-7.13c-1 2.11-2.82 3.99-5.46 5.63-2.64 1.58-5.6 2.38-8.89 2.38Zm1.58-7.92c3.34 0 6.16-1.14 8.45-3.43 2.29-2.35 3.43-5.4 3.43-9.15v-.62c0-2.52-.53-4.78-1.58-6.78-1.06-1.99-2.49-3.55-4.31-4.66-1.82-1.11-3.81-1.67-5.98-1.67-3.76 0-6.66 1.23-8.71 3.7-2.05 2.41-3.08 5.54-3.08 9.42s1 7.13 2.99 9.59c2.05 2.41 4.99 3.61 8.8 3.61Zm38.21-25.61h-7.13v-7.74h7.13V22.67l9.59-2.11v18.57h9.33v7.74h-9.33v32.65h-9.59V46.87Zm30.16 0h-7.13v-7.74h7.13V22.67l9.59-2.11v18.57h9.33v7.74h-9.33v32.65h-9.59V46.87Zm44.51 33.53c-3.64 0-7.01-.85-10.12-2.55-3.05-1.76-5.52-4.22-7.39-7.39-1.82-3.23-2.73-6.98-2.73-11.26s.79-7.92 2.38-11.09c1.64-3.17 3.96-5.63 6.95-7.39 2.99-1.76 6.51-2.64 10.56-2.64 2.35 0 4.55.41 6.6 1.23 2.05.82 3.78 1.85 5.19 3.08 1.41 1.17 2.35 2.35 2.82 3.52l.18-6.78h9.06v40.39h-8.98l-.18-7.13c-1 2.11-2.82 3.99-5.46 5.63-2.64 1.58-5.6 2.38-8.89 2.38Zm1.58-7.92c3.34 0 6.16-1.14 8.45-3.43 2.29-2.35 3.43-5.4 3.43-9.15v-.62c0-2.52-.53-4.78-1.58-6.78-1.06-1.99-2.49-3.55-4.31-4.66-1.82-1.11-3.81-1.67-5.98-1.67-3.76 0-6.66 1.23-8.71 3.7-2.05 2.41-3.08 5.54-3.08 9.42s1 7.13 2.99 9.59c2.05 2.41 4.99 3.61 8.8 3.61Zm35.48-57.64h9.42v64.68h-9.42V14.84Zm41.59 65.56c-4.17 0-7.86-.94-11.09-2.82-3.23-1.88-5.72-4.43-7.48-7.66-1.76-3.23-2.64-6.8-2.64-10.74s.85-7.42 2.55-10.65c1.76-3.23 4.25-5.78 7.48-7.66 3.23-1.88 6.95-2.82 11.18-2.82s7.92.94 11.09 2.82c3.23 1.88 5.69 4.43 7.39 7.66 1.76 3.23 2.64 6.78 2.64 10.65s-.88 7.51-2.64 10.74-4.25 5.78-7.48 7.66c-3.17 1.88-6.83 2.82-11 2.82Zm.26-7.74c3.4 0 6.07-1.26 8.01-3.78 1.99-2.52 2.99-5.69 2.99-9.5s-1.06-7.01-3.17-9.59c-2.11-2.64-4.9-3.96-8.36-3.96s-6.04 1.29-8.1 3.87c-1.99 2.58-2.99 5.81-2.99 9.68s1.09 6.92 3.26 9.5c2.17 2.52 4.96 3.78 8.36 3.78Zm44.91 7.74c-2.82 0-5.75-.35-8.8-1.06-2.99-.76-5.13-1.64-6.42-2.64l3.17-7.48c3.52 2.46 7.54 3.7 12.06 3.7s6.78-1.32 6.78-3.96c0-1.17-.47-2.08-1.41-2.73-.94-.64-2.61-1.41-5.02-2.29l-3.34-1.23c-3.52-1.41-6.31-3.08-8.36-5.02-2.05-1.99-3.08-4.61-3.08-7.83 0-3.7 1.44-6.57 4.31-8.62 2.93-2.11 6.83-3.17 11.7-3.17 2.4 0 4.75.26 7.04.79 2.35.53 4.14 1.2 5.37 2.02l-3.43 7.57c-.76-.76-1.99-1.41-3.7-1.94-1.64-.59-3.49-.88-5.54-.88-4.17 0-6.25 1.26-6.25 3.78 0 1.41.56 2.49 1.67 3.26 1.11.7 2.93 1.5 5.46 2.38.23.06 1.14.38 2.73.97 3.75 1.47 6.54 3.14 8.36 5.02 1.82 1.88 2.73 4.28 2.73 7.22 0 3.99-1.53 7.01-4.58 9.06-2.99 2.05-6.81 3.08-11.44 3.08ZM404.3 78.18c-1.74-.94-3.13-2.3-4.15-4.08-1.03-1.78-1.54-3.86-1.54-6.26 0-2.27.47-4.26 1.42-5.98a9.792 9.792 0 0 1 3.98-3.96c1.71-.93 3.69-1.39 5.93-1.39 1.7 0 3.16.22 4.39.65 1.23.43 2.2.97 2.9 1.61l-2.3 4.18c-1.34-1.34-2.86-2.02-4.56-2.02-2.05 0-3.61.62-4.68 1.87s-1.61 2.91-1.61 4.99c0 2.37.55 4.21 1.66 5.52s2.65 1.97 4.63 1.97c.99 0 1.96-.14 2.9-.43s1.67-.62 2.18-1.01l1.87 3.65c-.7.54-1.69 1.03-2.95 1.46-1.26.43-2.66.65-4.2.65-2.18 0-4.14-.47-5.88-1.42ZM425.3 78.06a10.644 10.644 0 0 1-4.08-4.18c-.96-1.76-1.44-3.71-1.44-5.86s.47-4.05 1.42-5.81c.94-1.76 2.3-3.15 4.06-4.18 1.76-1.02 3.79-1.54 6.1-1.54s4.33.51 6.07 1.54c1.74 1.02 3.09 2.42 4.03 4.18.94 1.76 1.42 3.7 1.42 5.81s-.48 4.1-1.44 5.86c-.96 1.76-2.31 3.15-4.06 4.18s-3.75 1.54-6.02 1.54-4.29-.51-6.05-1.54Zm10.58-4.75c1.07-1.38 1.61-3.1 1.61-5.18s-.58-3.83-1.73-5.26-2.67-2.14-4.56-2.14-3.29.7-4.39 2.11c-1.1 1.41-1.66 3.17-1.66 5.28s.59 3.77 1.78 5.16c1.18 1.39 2.7 2.09 4.56 2.09s3.32-.69 4.39-2.06ZM447.19 57.09h5.09l.05 4.03c.61-1.34 1.57-2.45 2.88-3.31 1.31-.86 2.85-1.3 4.61-1.3 2.27 0 4.02.47 5.23 1.42 1.22.94 2.03 2.26 2.45 3.96.42 1.7.62 3.91.62 6.62v10.61h-5.18V68.66c0-2.78-.27-4.79-.82-6.02-.54-1.23-1.66-1.85-3.36-1.85-.96 0-1.94.3-2.93.89-.99.59-1.82 1.45-2.47 2.57-.66 1.12-.98 2.43-.98 3.94v10.94h-5.18V57.1ZM475.51 61.31h-3.89v-4.22h3.89v-8.98l5.23-1.15v10.13h5.09v4.22h-5.09v17.81h-5.23V61.31ZM492.69 78.04c-1.76-1.04-3.06-2.43-3.89-4.18-.83-1.74-1.25-3.66-1.25-5.74 0-2.33.49-4.38 1.46-6.14s2.33-3.11 4.06-4.06c1.73-.94 3.68-1.42 5.86-1.42 3.39 0 5.91.94 7.56 2.81 1.65 1.87 2.47 4.5 2.47 7.9 0 .86-.05 1.76-.14 2.69h-15.84c.35 1.95 1.05 3.36 2.09 4.22 1.04.86 2.49 1.3 4.34 1.3 1.54 0 2.8-.13 3.79-.38.99-.26 1.9-.61 2.74-1.06l1.58 3.7c-.8.51-1.89.96-3.26 1.34-1.38.38-3.04.58-4.99.58-2.62 0-4.82-.52-6.58-1.56Zm11.23-11.74c.03-1.98-.4-3.38-1.3-4.2-.9-.82-2.18-1.22-3.84-1.22-3.36 0-5.3 1.81-5.81 5.42h10.94ZM513.19 57.09h5.09l.05 4.03c.61-1.34 1.57-2.45 2.88-3.31 1.31-.86 2.85-1.3 4.61-1.3 2.27 0 4.01.47 5.23 1.42 1.22.94 2.03 2.26 2.45 3.96.42 1.7.62 3.91.62 6.62v10.61h-5.18V68.66c0-2.78-.27-4.79-.82-6.02-.54-1.23-1.66-1.85-3.36-1.85-.96 0-1.94.3-2.93.89-.99.59-1.82 1.45-2.47 2.57s-.98 2.43-.98 3.94v10.94h-5.18V57.1ZM541.51 61.31h-3.89v-4.22h3.89v-8.98l5.23-1.15v10.13h5.09v4.22h-5.09v17.81h-5.23V61.31ZM568.22 79c-1.65-.4-2.82-.87-3.53-1.42l1.73-4.08c1.92 1.34 4.11 2.02 6.58 2.02s3.7-.72 3.7-2.16c0-.64-.26-1.14-.77-1.49-.51-.35-1.42-.77-2.74-1.25l-1.82-.67c-1.92-.77-3.44-1.69-4.56-2.76s-1.68-2.49-1.68-4.25c0-2.02.79-3.59 2.38-4.73 1.58-1.13 3.7-1.7 6.36-1.7 1.31 0 2.6.14 3.86.43s2.23.66 2.9 1.1l-1.87 4.13c-.42-.42-1.08-.78-1.99-1.08-.91-.3-1.93-.46-3.05-.46-2.27 0-3.41.69-3.41 2.06 0 .77.3 1.35.91 1.75.61.4 1.6.84 2.98 1.32.13.03.62.21 1.49.53 2.05.8 3.57 1.71 4.56 2.74.99 1.02 1.49 2.34 1.49 3.94 0 2.18-.82 3.82-2.47 4.94-1.65 1.12-3.74 1.68-6.26 1.68-1.54 0-3.13-.2-4.78-.6ZM590.3 78.18c-1.74-.94-3.13-2.3-4.15-4.08-1.02-1.78-1.54-3.86-1.54-6.26 0-2.27.47-4.26 1.42-5.98s2.27-3.03 3.98-3.96c1.71-.93 3.69-1.39 5.93-1.39 1.7 0 3.16.22 4.39.65s2.2.97 2.9 1.61l-2.3 4.18c-1.34-1.34-2.86-2.02-4.56-2.02-2.05 0-3.61.62-4.68 1.87-1.07 1.25-1.61 2.91-1.61 4.99 0 2.37.55 4.21 1.66 5.52 1.1 1.31 2.65 1.97 4.63 1.97.99 0 1.96-.14 2.9-.43s1.67-.62 2.18-1.01l1.87 3.65c-.7.54-1.69 1.03-2.95 1.46-1.26.43-2.66.65-4.2.65-2.18 0-4.14-.47-5.88-1.42ZM611.3 78.06a10.644 10.644 0 0 1-4.08-4.18c-.96-1.76-1.44-3.71-1.44-5.86s.47-4.05 1.42-5.81c.94-1.76 2.3-3.15 4.06-4.18 1.76-1.02 3.79-1.54 6.1-1.54s4.33.51 6.07 1.54c1.74 1.02 3.09 2.42 4.03 4.18.94 1.76 1.42 3.7 1.42 5.81s-.48 4.1-1.44 5.86c-.96 1.76-2.31 3.15-4.06 4.18-1.75 1.02-3.75 1.54-6.02 1.54s-4.29-.51-6.05-1.54Zm10.58-4.75c1.07-1.38 1.61-3.1 1.61-5.18s-.58-3.83-1.73-5.26-2.67-2.14-4.56-2.14-3.29.7-4.39 2.11c-1.1 1.41-1.66 3.17-1.66 5.28s.59 3.77 1.78 5.16 2.7 2.09 4.56 2.09 3.32-.69 4.39-2.06ZM633.04 57.09h5.18v4.32c.51-1.47 1.34-2.66 2.5-3.55 1.15-.9 2.46-1.34 3.94-1.34 1.02 0 1.73.1 2.11.29l-.72 5.23c-.29-.19-.91-.29-1.87-.29-1.5 0-2.87.48-4.1 1.44-1.23.96-1.85 2.5-1.85 4.61v11.33h-5.18V57.1ZM653.05 78.04c-1.76-1.04-3.06-2.43-3.89-4.18-.83-1.74-1.25-3.66-1.25-5.74 0-2.33.49-4.38 1.46-6.14s2.33-3.11 4.06-4.06c1.73-.94 3.68-1.42 5.86-1.42 3.39 0 5.91.94 7.56 2.81 1.65 1.87 2.47 4.5 2.47 7.9 0 .86-.05 1.76-.14 2.69h-15.84c.35 1.95 1.05 3.36 2.09 4.22 1.04.86 2.49 1.3 4.34 1.3 1.54 0 2.8-.13 3.79-.38.99-.26 1.9-.61 2.74-1.06l1.58 3.7c-.8.51-1.89.96-3.26 1.34-1.38.38-3.04.58-4.99.58-2.62 0-4.82-.52-6.58-1.56Zm11.23-11.74c.03-1.98-.4-3.38-1.3-4.2-.9-.82-2.18-1.22-3.84-1.22-3.36 0-5.3 1.81-5.81 5.42h10.94Z"/></svg>'
        score.textContent = `${points}`;  
        card.id = "popoverOption";
        card.rel = "popover";
        card.href = "#";
        card.dataset.container = "body";
        card.dataset.placement = "right";
        card.dataset.trigger = "manual";
        card.dataset.title = "Attalos Content Score (ACS) calculation";
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
        title.insertAdjacentElement("beforebegin", links);
        links.insertAdjacentElement("beforebegin", sdd_open);
        links.insertAdjacentElement("beforebegin", prod_open);

        title.insertAdjacentElement("beforebegin", card);
        card.insertAdjacentElement("afterbegin", row);
        row.insertAdjacentElement("afterbegin", col1);
        col1.insertAdjacentElement("afterbegin", spinner);
        spinner.insertAdjacentElement("afterbegin", spinner_inner);
        row.insertAdjacentElement("beforeend", col2);
        col2.insertAdjacentElement("afterbegin", card_body)
        card_body.insertAdjacentElement("beforeend", card_text)

  // <button type="button" class="btn btn-secondary btn-sm">Small button</button>

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
        $( document ).ready(function() {
          $('#popoverOption').popover({html:true, placement: 'right'});

          $('#popoverOption').one('mouseenter', function() {
            $(this).popover('show',);
          });

          $(document).on('click', function() {
            $('#popoverOption').popover('hide');
            $('#popoverOption').one('mouseenter', function() {
              $(this).popover('show');
            });
          });




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
            col1.classList.add("bg-attalos") 

          }
          //col2.insertAdjacentElement("afterbegin", sdd_open);
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
var globalid = document.querySelector('[rel="canonical"]').href;
var segments = globalid.split('/');
var globalid = segments[segments.length - 2];



// Get all elements with the class "breadcrumbs__link"
const breadcrumbsLinks = document.querySelectorAll('.breadcrumbs__link');

// get the breadcrumbs
if (breadcrumbsLinks.length > 0) {
  // Get the last element in the NodeList
  const lastBreadcrumbsLink = breadcrumbsLinks[breadcrumbsLinks.length - 1];
    // Split the URL by '/'
  url = String(lastBreadcrumbsLink);
  var category = url.match(/\d+/g).pop();
};
var ean = document.querySelector("[data-test='taxonomy_data']").textContent;
ean = JSON.parse(ean);
ean = JSON.stringify(ean)
ean = JSON.parse(ean);
ean = ean["pdpTaxonomyObj"]["productInfo"][0]["ean"];

// Send a message to the background script to get the spot value
chrome.runtime.sendMessage({ operation: "getSpotValue", ean: ean, category: category }, response => {
  if (response && response.spotValue) {
    var spot = response.spotValue;
    console.log("Spot value received in content script:", spot);
    const position = document.createElement("div");
    position.classList.add("position", "p-2", "float-left", "border-attalos", "rounded-circle");
    const position_number = document.createElement("span");
    position_number.classList.add("position_number");
    position_number.textContent = `${spot}`;  
    const position_icon = document.createElement("span");
    //position_icon.innerHTML = '<svg style="color: rgb(52, 177, 133);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" fill="#34b185"></path></svg>'
    position_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M89,88h-3.0361328V37.8623047c0-0.5527344-0.4477539-1-1-1H73.5205078c-0.5522461,0-1,0.4472656-1,1V88h-5.9462891  V47.5371094c0-0.5527344-0.4477539-1-1-1H54.1308594c-0.5522461,0-1,0.4472656-1,1V88h-6.2617188V60.03125  c0-0.5527344-0.4477539-1-1-1H34.4257812c-0.5522461,0-1,0.4472656-1,1V88h-6.0424805V41.3847656c0-0.5527344-0.4477539-1-1-1  H14.9399414c-0.5522461,0-1,0.4472656-1,1V88H11c-0.5522461,0-1,0.4472656-1,1s0.4477539,1,1,1h78c0.5522461,0,1-0.4472656,1-1  S89.5522461,88,89,88z" fill="#37ae84" /><path d="M74.5205078,38.8623047h9.4433594V88h-9.4433594V38.8623047z" fill="#37ae84" /><path d="M55.1308594,48.5371094h9.4433594V88h-9.4433594V48.5371094z" fill="#37ae84" /><path d="M35.4257812,61.03125h9.4433594V88h-9.4433594V61.03125z" fill="#37ae84" /><path d="M15.9399414,42.3847656h9.4433594V88h-9.4433594V42.3847656z" fill="#37ae84" /><path d="M74.4414062,31.9902344h9.0922852c0.5522461,0,1-0.4472656,1-1v-7.7753906H89  c0.394043,0,0.7514648-0.2314453,0.9125977-0.5908203s0.0961914-0.7802734-0.1660156-1.0742188l-9.9936523-11.2148438  c-0.3798828-0.4257812-1.1132812-0.4257812-1.4931641,0l-9.9931641,11.2148438  c-0.262207,0.2939453-0.3271484,0.7148438-0.1660156,1.0742188s0.5185547,0.5908203,0.9125977,0.5908203h4.4282227v7.7753906  C73.4414062,31.5429688,73.8891602,31.9902344,74.4414062,31.9902344z M71.2436523,21.2148438l7.7626953-8.7119141  l7.7631836,8.7119141h-3.2358398c-0.5522461,0-1,0.4472656-1,1v7.7753906h-7.0922852v-7.7753906c0-0.5527344-0.4477539-1-1-1  H71.2436523z" fill="#37ae84" /><path d="M15.0961914,26.9472656v7.7744141c0,0.5527344,0.4477539,1,1,1h9.0927734c0.5522461,0,1-0.4472656,1-1v-7.7744141h4.4658203  c0.394043,0,0.7514648-0.2314453,0.9125977-0.5908203s0.0961914-0.7802734-0.1660156-1.0742188l-9.9931641-11.2148438  c-0.3798828-0.4257812-1.1132812-0.4257812-1.4931641,0L9.9213867,25.2822266  c-0.262207,0.2939453-0.3271484,0.7148438-0.1660156,1.0742188s0.5185547,0.5908203,0.9125977,0.5908203H15.0961914z   M20.6616211,16.2353516l7.7626953,8.7119141h-3.2353516c-0.5522461,0-1,0.4472656-1,1v7.7744141h-7.0927734v-7.7744141  c0-0.5527344-0.4477539-1-1-1h-3.1977539L20.6616211,16.2353516z" fill="#37ae84" /><path d="M59.105957,19.140625l-9.9936523,11.2148438c-0.262207,0.2939453-0.3271484,0.7148438-0.1660156,1.0742188  s0.5185547,0.5908203,0.9125977,0.5908203h4.4287109v7.7753906c0,0.5527344,0.4477539,1,1,1h9.0922852c0.5522461,0,1-0.4472656,1-1  v-7.7753906h4.4663086c0.394043,0,0.7514648-0.2314453,0.9125977-0.5908203s0.0961914-0.7802734-0.1660156-1.0742188  L60.5991211,19.140625C60.2192383,18.7148438,59.4858398,18.7148438,59.105957,19.140625z M64.3798828,30.0205078  c-0.5522461,0-1,0.4472656-1,1v7.7753906h-7.0922852v-7.7753906c0-0.5527344-0.4477539-1-1-1h-3.1982422l7.7631836-8.7119141  l7.7631836,8.7119141H64.3798828z" fill="#37ae84" /><path d="M44.7124023,33.3466797h-9.0922852c-0.5522461,0-1,0.4472656-1,1v7.7744141h-4.4663086  c-0.394043,0-0.7514648,0.2314453-0.9125977,0.5908203s-0.0961914,0.7802734,0.1660156,1.0742188l9.9936523,11.2148438  c0.1899414,0.2128906,0.4614258,0.3349609,0.746582,0.3349609s0.5566406-0.1220703,0.746582-0.3349609l9.9936523-11.2148438  c0.262207-0.2939453,0.3271484-0.7148438,0.1660156-1.0742188s-0.5185547-0.5908203-0.9125977-0.5908203h-4.4287109v-7.7744141  C45.7124023,33.7939453,45.2646484,33.3466797,44.7124023,33.3466797z M47.9106445,44.1210938l-7.7631836,8.7119141  l-7.7631836-8.7119141h3.2358398c0.5522461,0,1-0.4472656,1-1v-7.7744141h7.0922852v7.7744141c0,0.5527344,0.4477539,1,1,1  H47.9106445z" fill="#37ae84" /></svg>'
    position_icon.classList.add("position_icon", "m-1", 'float-left');

    breadcrumbs.insertAdjacentElement("beforeend", position_icon);
    breadcrumbs.insertAdjacentElement("beforeend", position);
    position.insertAdjacentElement("beforeend", position_number);

    // Do something with the spot value
    //alert (spot)
  } else {
    console.error("Error fetching spot value");
  }
});



// Try to select the element with the first selector
var breadcrumbs = document.querySelector('[class="fluid-grid fluid-grid--middle"]');

// If the element isn't found, use the second selector
if (!breadcrumbs) {
  breadcrumbs = document.querySelector('[class="fluid-grid fluid-grid--middle u-pb--xs@screen-large-up"]');
}
var title_text = document.querySelector('[data-test="title"]');
var title = document.querySelector(".page-heading");
var reviews = document.querySelector('[data-test="rating-suffix"]');
var video = document.querySelector('[data-test="button-play"]');
var images = document.querySelectorAll('.image-slot-thumb');
if (title_text) {
  var title_text = title_text.textContent;
  const wordMatchRegExp = /[^\s]+/g;
  const words = title_text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  var wordCount_title = [...words].length;
  var title_len = title_text.length;
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
if (hasVideo) {
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

}
});


