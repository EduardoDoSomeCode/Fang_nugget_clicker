class Game {
  constructor() {
    this.cookies = 0;
    this.clickPower = 1;
    this.cps = 0;
    this.workers = [];
    this.clickSoundBuy = new Audio("sound/buy.mp3");
    this.clickSound = new Audio("sound/crunch_edit.mp3");

    this.storeItems = [
      {
        id: "cursor",
        name: "Make a nugget",
        baseCost: 15,
        owned: 0,
        power: 1,
        description: "Doubles your click power",
        image: "nuget",
      },
      {
        id: "worker",
        name: "Make some nuggets",
        baseCost: 100,
        owned: 0,
        power: 1,
        description: "Produces 1 nugget per second",
        image: "Dino_nugget",
      },
      {
        id: "factory",
        name: "Tracy the nugget maker",
        baseCost: 500,
        owned: 0,
        power: 5,
        description: "Produces 5 nuggets per second",
        image: "Tracy_head",
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
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = -50 - Math.random() * 50; // Always move upward
    const rotation = (Math.random() - 0.5) * 360;

    // Set CSS variables for the animation
    particle.style.setProperty("--moveX", `${moveX}px`);
    particle.style.setProperty("--moveY", `${moveY}px`);
    particle.style.setProperty("--rotation", `${rotation}deg`);

    // Add to container
    container.appendChild(particle);

    // Start animation
    particle.style.animation = "fadeOut 0.5s ease-out forwards";

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
    // this.createParticle(event);
    this.updateDisplay();
    this.saveGame();
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

  buyItem(itemId) {
    const item = this.storeItems.find((i) => i.id === itemId);
    const cost = this.calculateItemCost(item);

    if (this.cookies >= cost) {
      this.cookies -= cost;
      item.owned++;

      if (itemId === "cursor") {
        this.clickPower += item.power;
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
<img src="./img/${item.image}.webp"  class="icon_image">
                    

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
