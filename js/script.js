
class Game {
  constructor() {
    this.cookies = 0;
    this.clickPower = 1;
    this.cps = 0;
    this.workers = [];
    this.clickSoundBuy = new Audio("sound/buy.mp3");
    this.clickSound = new Audio("sound/crunch_edit.mp3");
    this.isFangMode = true; // Add this flag to track which image to use
    this.fangImage = "./img/fang_coockie.gif";
    this.reedImage = "./img/Reed.png";

    this.storeItems = [
      {
        id: "cursor",
        name: "Make a nugget",
        baseCost: 15,
        owned: 0,
        power: 1,
        description: "Doubles your click power",
        image: "nuget.webp",
      },
      {
        id: "worker",
        name: "Make some nuggets",
        baseCost: 100,
        owned: 0,
        power: 1,
        description: "Produces 1 nugget per second",
        image: "Dino_nugget.webp",
      },
      {
        id: "Coocki",
        name: "Coockie from the cafeteria",
        baseCost: 130,
        owned: 0,
        power: 3,
        description: "Produces 3 nuggets per second",
        image: "coockie.webp",
      },
      {
        id: "pizza",
        name: "Order a Moe's pizza",
        baseCost: 150,
        owned: 0,
        power: 6,
        description: "Produces 6 pizza per second",
        image: "pizza.webp",
      },
      {
        id: "factory",
        name: "Tracy the nugget maker",
        baseCost: 500,
        owned: 0,
        power: 15,
        description: "Produces 15 nuggets per second",
        image: "Tracy_head.webp",
      },
      {
        id: "fangMultiplier",
        name: "More Fang Eaters",
        baseCost: 200, // Adjust cost as needed
        owned: 0,
        power: 0, // No increase in CPS or Click Power
        description: "Adds another Fang eating nuggets (purely cosmetic)",
        image: "fang_coockie.gif", // Keep consistent with the current image
      },
    ];

    this.initializeGame();
    this.startWorkers();
  }

  playClickSound() {
    // Reset the sound to the beginning if it's already playing
    this.clickSound.currentTime = 0;
    // Randomize volume between 0.3 and 1
    this.clickSound.volume = 0.3 + Math.random() * 0.6;
    // Play the sound
    this.clickSound.play().catch((e) => console.log("Audio play failed:", e));
  }
  saveGame() {
    const save = {
      cookies: this.cookies,
      clickPower: this.clickPower,
      workers: this.workers,
      cps: this.cps,
      storeItems: this.storeItems,
    };
    localStorage.setItem("save", JSON.stringify(save));
  }

  loadGame() {
    const save = JSON.parse(localStorage.getItem("save"));
    if (save) {
      this.cookies = save.cookies;
      this.clickPower = save.clickPower;
      this.cps = save.cps;
      this.storeItems = save.storeItems;
    }
  }
  createParticle(e) {
    const container = document.getElementById("particleContainer");
    const containerRect = container.getBoundingClientRect();
    const particle = document.createElement("img");

    // Use the same image as the main cookie
    particle.src = document.getElementById("cookie").src;
    particle.className = "particle";

    // Get click position relative to container
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    // Set initial position
    particle.style.left = x + "px";
    particle.style.top = y + "px";

    // Random movement values
    const moveX = (Math.random() - 0.5) * 150;
    const moveY = -50 - Math.random() * 50; // Always move upward
    const rotation = (Math.random() - 0.5) * 360;

    // Set CSS variables for the animation
    particle.style.setProperty("--moveX", `${moveX}px`);
    particle.style.setProperty("--moveY", `${moveY}px`);
    particle.style.setProperty("--rotation", `${rotation}deg`);

    // Add to container
    container.appendChild(particle);

    // Start animation
    particle.style.animation = "fadeOut 300ms ease-out forwards";

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 500);
  }
  initializeGame() {
    // DOM elements
    this.cookieElement = document.getElementById("cookie");
    this.cookieCountElement = document.getElementById("cookieCount");
    this.cpsElement = document.getElementById("cps");
    this.clickPowerElement = document.getElementById("clickPower");
    this.storeElement = document.getElementById("store");

    this.loadGame();

    // Event listeners
    this.cookieElement.addEventListener("click", (e) => this.clickCookie(e));

    // Initialize store
    this.renderStore();

    // Update display
    this.updateDisplay();
  }

  clickCookie(event) {
    this.cookies += this.clickPower;
    this.playClickSound();
    this.createParticle(event);
    this.updateDisplay();
    this.saveGame();
  }

  toggleMode(mode) {
    let imageSrc;

    // Determine image source based on mode
    switch (mode) {
        case "fang":
            imageSrc =  this.fangImage 
            break;
        case "rosa":

            imageSrc = "./img/rosa.webp";
            break;
        case "trish":

            imageSrc = "./img/trish.png";
            break;

        case "olivia":

              imageSrc = "./img/liv.webp";
              break;
              
        case "reed":

          imageSrc = "./img/Reed.png";
          break;
        case "normal":

            imageSrc = "./img/nuget.webp";
            break;
        default:
            console.warn("Invalid mode selected.");
            return;
          
    }

    // Update main cookie image
    document.getElementById('cookie').src = imageSrc;

    // Update particles if applicable
    document.querySelectorAll('.particle').forEach(particle => {
        particle.src = imageSrc;
    });

    // Update multiple fang images if in Fang mode
   
        // Update store item image if applicable
        const fangItem = this.storeItems.find(item => item.id === 'fangMultiplier');
        if (fangItem) {
            fangItem.image = imageSrc.replace("./img/", "");
            document.querySelector(".icon_image").src = imageSrc ;
        }

        this.renderStore(); // Refresh store if Fang mode changes
}


  startWorkers() {
    setInterval(() => {
      this.cookies += this.cps;
      this.updateDisplay();
    }, 1000);
  }

  calculateItemCost(item) {
    return Math.floor(item.baseCost * Math.pow(1.15, item.owned));
  }
  playClickSoundBuy() {
    this.clickSoundBuy.currentTime = 0;
    this.clickSoundBuy.volume = 0.3 + Math.random() * 0.6;
    this.clickSoundBuy
      .play()
      .catch((e) => console.log("Audio play failed:", e));
  }

  duplicateFangImage() {
    const fangImage = document.querySelector(".icon_image"); // Select existing image
    if (fangImage) {
      const newFang = fangImage.cloneNode(true); // Clone the image
      document.querySelector(".main-section").appendChild(newFang); // Append to the same section
    }
  }

  buyItem(itemId) {
    const item = this.storeItems.find((i) => i.id === itemId);
    const cost = this.calculateItemCost(item);

    if (this.cookies >= cost) {
      this.cookies -= cost;
      item.owned++;

      if (itemId === "cursor") {
        this.clickPower += item.power;
      } else if (itemId === "fangMultiplier") {
        this.duplicateFangImage(); // Call function to duplicate image
      } else {
        this.cps += item.power;
      }

      this.playClickSoundBuy();
      this.updateDisplay();
      this.renderStore();
    }
  }

  renderStore() {
    this.storeElement.innerHTML = this.storeItems
      .map((item) => {
        const cost = this.calculateItemCost(item);
        const canAfford = this.cookies >= cost;

        return `
                <div class="store-item ${canAfford ? "" : "disabled"}" 
                     onclick="game.buyItem('${item.id}')">

                     <div>
                     <h3>${item.name} (${item.owned})</h3>
                    <p>${item.description}</p>
                    <p>Cost: ${cost} Dino-nuggets</p>
                </div>
<img src="./img/${item.image}"  class="icon_image">
                    

                </div>
            `;
      })
      .join("");
  }

  updateDisplay() {
    this.cookieCountElement.textContent = Math.floor(this.cookies);
    this.cpsElement.textContent = this.cps;
    this.clickPowerElement.textContent = this.clickPower;
    this.renderStore();
  }
}

const game = new Game();
cheet("4 2 0", function () {
  game.toggleMode("reed")

});

cheet("n u g g e t", function () {
  game.toggleMode("normal")

});

cheet("t r i g g a", function () {
  game.toggleMode("trish")

});

cheet("r o s a", function () {
  game.toggleMode("rosa")

});

cheet("l i v", function () {
  game.toggleMode("olivia")

});

cheet("f a n g", function () {
  game.toggleMode("fang")

});



cheet("b a l d", function(){
  console.log("anon should appear")
})
