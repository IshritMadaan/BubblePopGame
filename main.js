/**
 * Debounces a function, ensuring it's only called after a specified delay
 * since the last invocation.
 *
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} A new function that, when called, will debounce the original function.
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Game state
let timer;
let score;
let hitval;
let totalhits;

function initGameState() {
  score = 0;
  totalhits = 0;
  hitval = 5;
  timer = 10;
}

const mainElement = document.querySelector("main");
const mainMenu = document.getElementById("main-menu");
const gameMenu = document.getElementById("game-menu");
const endScreenT = document.getElementById("end-screen");

function setupMainMenu() {
  mainElement.innerHTML = "";
  const clone = mainMenu.content.cloneNode(true);
  mainElement.appendChild(clone);

  const startButton = mainElement.querySelector("#start-game");
  startButton.addEventListener("click", () => {
    const clone = gameMenu.content.cloneNode(true);
    mainElement.replaceChildren(clone);
    startGame();
  });
}

document.addEventListener("DOMContentLoaded", setupMainMenu);

function initBubbles() {
  const bubbleArea = document.getElementById("pbottom");
  bubbleArea.innerHTML = "";
  const comStyles = window.getComputedStyle(bubbleArea);
  const gap = parseInt(comStyles.getPropertyValue("gap"));
  const padding = parseInt(comStyles.getPropertyValue("padding"));

  const { width: containerWidth, height: containerHeight } =
    bubbleArea.getBoundingClientRect();

  const tempBubble = document.createElement("div");
  tempBubble.classList.add("bubble");
  tempBubble.style.visibility = "hidden";
  bubbleArea.appendChild(tempBubble);

  const bubbleRect = tempBubble.getBoundingClientRect();
  const bubbleWidth = bubbleRect.width;
  const bubbleHeight = bubbleRect.height;

  bubbleArea.removeChild(tempBubble);

  if (bubbleWidth === 0 || bubbleHeight === 0) {
    console.warn(
      "Bubble dimensions are zero. CSS might not be loaded or --size is too small."
    );
    return;
  }

  const availableContentWidth = containerWidth - padding * 2;
  const availableContentHeight = containerHeight - padding * 2;

  // Formula: floor((availableSpace + gap) / (itemSize + gap))
  let theoreticalColCount = Math.floor(
    (availableContentWidth + gap) / (bubbleWidth + gap)
  );
  theoreticalColCount = Math.max(0, theoreticalColCount);

  let theoreticalRowCount = Math.floor(
    (availableContentHeight + gap) / (bubbleHeight + gap)
  );
  theoreticalRowCount = Math.max(0, theoreticalRowCount);

  console.log({
    containerWidth,
    containerHeight,
    bubbleWidth,
    bubbleHeight,
    gap,
    padding,
    theoreticalColCount,
    theoreticalRowCount,
  });

  // Calculate the total number of bubbles that *can* fit
  const totalBubblesToFit = theoreticalColCount * theoreticalRowCount;

  for (let i = 1; i <= totalBubblesToFit; i++) {
    makeBubble();
  }
}

window.addEventListener("resize", debounce(initBubbles, 200));

function startTimer() {
  document.querySelector("#timerval").textContent = timer;
  const timerint = setInterval(function () {
    timer--;
    document.querySelector("#timerval").textContent = timer;
    if (timer === 0) {
      clearInterval(timerint);
      showEndScreen();
    }
  }, 1000);
}

function showEndScreen() {
  const bubbleArea = document.getElementById("pbottom");
  bubbleArea.style.setProperty("grid-template-columns", "1fr");
  bubbleArea.style.setProperty("grid-template-rows", "1fr");
  bubbleArea.innerHTML = "";
  bubbleArea.appendChild(endScreenT.content.cloneNode(true));

  const endScreen = document.querySelector(".end-screen");

  // Update the score and total hits
  endScreen.querySelector("p#scoreval").textContent = `Final Score: ${score}`;
  endScreen.querySelector(
    "p#totalhitsval"
  ).textContent = `Total Hits: ${totalhits}`;

  // Add event listener to replay button
  const replayBtn = document.getElementById("replay-btn");
  replayBtn.addEventListener("click", resetGame);
}

function makeBubble() {
  const bubbleArea = document.getElementById("pbottom");
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = getRandomInt();
  bubbleArea.appendChild(bubble);
}

function getRandomInt() {
  return Math.floor(Math.random() * 10 + 1);
}

function increaseScore() {
  score += 10;
  document.querySelector("#scoreval").textContent = score;
}

function getNewHit() {
  hitval = getRandomInt();
  document.querySelector("#hitval").textContent = hitval;
}

function startGame() {
  initGameState();
  initBubbles();

  // Hit Detection Logic
  const bubbleArea = document.getElementById("pbottom");
  bubbleArea.addEventListener("click", (e) => {
    let bubbleElHit = e.target;
    if (Number(bubbleElHit.textContent) === hitval) {
      // console.log("Correct Hit Hua");

      totalhits += 1;
      increaseScore();
      getNewHit();
      initBubbles();
    } else {
      // console.log("Hit nahi hua");
    }
  });

  startTimer();
  getNewHit();
}

function resetGame() {
  // Bring back the main menu
  setupMainMenu();

  // Start the game
  startGame();
}
