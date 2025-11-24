const eatIn = [
  "Chicken Sandwich","Burrito","Crunchwrap","Chicken & Rice",
  "Pizza","Dante’s Choice","Alexander’s Choice"
];
const eatOut = [
  "Subway","McDonalds","Burger King","Wendy’s","Arby’s",
  "Taco Bell","Chipotle","Dante’s Choice","Alexander’s Choice"
];

const videoGames = [
  "Roblox","Minecraft","Outlast Trials","Smite/2",
  "Deceit 2","Stardew","Amanda The Adventurer",
  "The Walking Dead","Dante’s Choice","Alexander’s Choice"
];

const boardGames = [
  "Yahtzee","Monopoly","Cards","Dante’s Choice","Alexander’s Choice"
];

const watchList = ["Smosh","C&C","Jenn","The 100","Dante’s Choice","Alexander’s Choice"];

const doInside = [
  "Nap","Shower","Lay Down","Bake something","Paint","Watch a movie"
];
const doOut = [
  "Play a board game","Go for a drive","Jim Thorpe","LV Mall",
  "King of Prussia Mall","See a movie","Dante’s Choice","Alexander’s Choice"
];

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function display(text) {
  document.getElementById("result").textContent = text;
}

function chooseEat(mode) {
  if (!mode) mode = Math.random() < 0.5 ? "in" : "out";
  display(mode === "in" ? rand(eatIn) : rand(eatOut));
}

function choosePlay(type) {
  if (!type) type = Math.random() < 0.5 ? "video" : "board";
  display(type === "video" ? rand(videoGames) : rand(boardGames));
}

function chooseWatch() {
  display(rand(watchList));
}

function chooseDo(mode) {
  if (!mode) mode = Math.random() < 0.5 ? "in" : "out";
  display(mode === "in" ? rand(doInside) : rand(doOut));
}
