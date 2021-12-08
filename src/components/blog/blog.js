// we use event bubbling here, quite simple

document
  .querySelector(".grid-container.blog-content")
  ?.addEventListener("click", function (e) {
    const link = e.target.parentNode.querySelector("a").getAttribute("href");
    location = link;
  });
