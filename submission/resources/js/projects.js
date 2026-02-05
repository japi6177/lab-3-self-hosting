const items = document.querySelectorAll(".item");
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");

let index = 0;

function updateCarousel() {
  items.forEach((item, i) => {
    item.className = "item";

    const total = items.length;
    const prevIndex = (index - 1 + total) % total;
    const nextIndex = (index + 1) % total;

    //Change item classes
    if (i === index) {
      item.classList.add("active");
    } else if (i === prevIndex) {
      item.classList.add("prev");
    } else if (i === nextIndex) {
      item.classList.add("next");
    } else {
      item.classList.add("hidden");
    }

    //click the transparent things
    item.onclick = () => {
      index = i;
      updateCarousel();
    };
  });
}

prevBtn.onclick = () => {
  index = (index - 1 + items.length) % items.length;
  updateCarousel();
};

nextBtn.onclick = () => {
  index = (index + 1) % items.length;
  updateCarousel();
};

updateCarousel();
