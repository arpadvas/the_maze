var button = document.querySelector(".button");
var container = document.querySelector(".container");

button.addEventListener("click", function() {
  container.style.display = "none";
  startGame();
});