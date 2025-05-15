const nhlTeams = [
  "Boston Bruins",
  "Toronto Maple Leafs",
  "Tampa Bay Lightning",
  "Florida Panthers",
  "Carolina Hurricanes",
  "New Jersey Devils",
  "New York Rangers",
  "New York Islanders",
  "Colorado Avalanche",
  "Dallas Stars",
  "Minnesota Wild",
  "Winnipeg Jets",
  "Vegas Golden Knights",
  "Edmonton Oilers",
  "Los Angeles Kings",
  "Seattle Kraken",
];

function dragStart(e) {
  draggedTeam = e.target;
  console.log(draggedTeam);
  e.dataTransfer.setData("text/plain", e.target.textContent);
}

function restoreRound(selector, teams) {
  const slots = document.querySelectorAll(selector);
  teams.forEach((team, index) => {
    if (team && index < slots.length) {
      slots[index].textContent = team;
      const teamElements = document.querySelectorAll(".team-item");
      teamElements.forEach((el) => {
        if (el.textContent === team) {
          el.remove();
        }
      });
    }
  });
}
const availableTeamsEl = document.getElementById("available-teams");
const firstRoundMatchupsEl = document.getElementById("first-round-matchups");
const secondRoundMatchupsEl = document.getElementById("second-round-matchups");
const conferenceFinalsMatchupsEl = document.getElementById(
  "conference-round-matchups"
);
const stanleyCupMatchupEl = document.getElementById("final-round-matchups");
const saveButton = document.getElementById("save-bracket");
const resetButton = document.getElementById("reset-bracket");

function initBracket() {
  availableTeamsEl.innerHTML = "";
  nhlTeams.forEach((team) => {
    const teamEl = document.createElement("div");
    teamEl.className = "team-item";
    teamEl.textContent = team;
    teamEl.draggable = true;
    teamEl.addEventListener("dragstart", dragStart);
    availableTeamsEl.appendChild(teamEl);

    saveButton.addEventListener("click", saveBracket);
    resetButton.addEventListener("click", resetBracket);
  });

  firstRoundMatchupsEl.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const matchupEl = document.createElement("div");
    matchupEl.className = "matchup";
    matchupEl.innerHTML = `
            <div class="matchup-slot" data-round="first" data-match="${i}" data-position="top" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <div class="matchup-slot" data-round="first" data-match="${i}" data-position="bottom" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <button class="advance-btn" data-round="first" data-match="${i}">Advance Winner</button>
        `;
    firstRoundMatchupsEl.appendChild(matchupEl);
  }

  secondRoundMatchupsEl.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const matchupEl = document.createElement("div");
    matchupEl.className = "matchup";
    matchupEl.innerHTML = `
            <div class="matchup-slot" data-round="second" data-match="${i}" data-position="top" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <div class="matchup-slot" data-round="second" data-match="${i}" data-position="bottom" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <button class="advance-btn" data-round="second" data-match="${i}">Advance Winner</button>
        `;
    secondRoundMatchupsEl.appendChild(matchupEl);
  }

  conferenceFinalsMatchupsEl.innerHTML = "";
  for (let i = 0; i < 2; i++) {
    const matchupEl = document.createElement("div");
    console.log("loading")
    matchupEl.className = "matchup";
    matchupEl.innerHTML = `
            <div class="matchup-slot" data-round="conference" data-match="${i}" data-position="top" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <div class="matchup-slot" data-round="conference" data-match="${i}" data-position="bottom" 
                 ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <button class="advance-btn" data-round="conference" data-match="${i}">Advance Winner</button>
        `;
    conferenceFinalsMatchupsEl.appendChild(matchupEl);
  }

  stanleyCupMatchupEl.innerHTML = "";
  const matchupEl = document.createElement("div");
  matchupEl.className = "matchup";
  matchupEl.innerHTML = `
        <div class="matchup-slot" data-round="final" data-match="0" data-position="top" 
             ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        <div class="matchup-slot" data-round="final" data-match="0" data-position="bottom" 
             ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    `;

    stanleyCupMatchupEl.appendChild(matchupEl);


  document.querySelectorAll(".advance-btn").forEach((btn) => {
    btn.addEventListener("click", advanceWinner);
  });
}

function advanceWinner(e) {
  const btn = e.target;
  const round = btn.dataset.round;
  const matchIndex = parseInt(btn.dataset.match);

  const matchup = btn.parentElement;
  const topTeam = matchup.querySelector('[data-position="top"]').textContent;
  const bottomTeam = matchup.querySelector(
    '[data-position="bottom"]'
  ).textContent;

  if (!topTeam || !bottomTeam) {
    alert("Please fill both teams before advancing!");
    return;
  }

  let nextRound, targetMatch;
  if (round === "first") {
    nextRound = "second";
    targetMatch = Math.floor(matchIndex / 2);
  } else if (round === "second") {
    nextRound = "conference";
    targetMatch = Math.floor(matchIndex / 2);
  } else if (round === "conference") {
    nextRound = "final";
    targetMatch = 0;
  } else {
    return;
  }

  const winner = prompt(
    `Who won this matchup?\n1. ${topTeam}\n2. ${bottomTeam}`,
    topTeam
  );
  if (!winner || (winner !== topTeam && winner !== bottomTeam)) return;

  console.log(nextRound);
  const nextRoundEl = document.getElementById(`${nextRound}-round-matchups`);

  if (!nextRoundEl) {
    console.error(`Could not find element with ID ${nextRound}-round-matchups`);
    return;
  }
  const nextMatchups = nextRoundEl.querySelectorAll(".matchup");
  const targetMatchup = nextMatchups[targetMatch];
  console.log(nextMatchups);
  if (!targetMatchup) {
    console.error(
      `Could not find matchup ${targetMatch} in ${nextRound} round`
    );
    return;
  }

  const slots = targetMatchup.querySelectorAll(".matchup-slot");
  const emptySlot = Array.from(slots).find((slot) => !slot.textContent.trim());

  if (emptySlot) {
    emptySlot.textContent = winner;
  } else {
    alert("No empty slots available in the next round matchup!");
  }
}
let draggedTeam = null;

function dragStart(e) {
  draggedTeam = e.target;
  console.log(draggedTeam);
  e.dataTransfer.setData("text/plain", e.target.textContent);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (draggedTeam) {
    const slot = e.target;
    if (slot.classList.contains("matchup-slot")) {
      if (slot.textContent.trim() === "") {
        slot.textContent = draggedTeam.textContent;
        draggedTeam.remove();
      }
    }
  }
}

function saveBracket() {
  const bracketData = {
    firstRound: Array.from(
      document.querySelectorAll("#first-round .matchup-slot")
    ).map((slot) => slot.textContent),
  };
  localStorage.setItem("nhlBracket", JSON.stringify(bracketData));
  alert("Bracket saved!");
}

function resetBracket() {
  if (confirm("Are you sure you want to reset the bracket?")) {
    localStorage.removeItem("nhlBracket");
    initBracket();
  }
}
function saveBracket() {
  const bracketData = {
    firstRound: Array.from(
      document.querySelectorAll("#first-round .matchup-slot")
    ).map((slot) => slot.textContent),
    secondRound: Array.from(
      document.querySelectorAll("#second-round .matchup-slot")
    ).map((slot) => slot.textContent),
    conferenceFinals: Array.from(
      document.querySelectorAll("#conference-finals .matchup-slot")
    ).map((slot) => slot.textContent),
    stanleyCup: Array.from(
      document.querySelectorAll("#stanley-cup-final .matchup-slot")
    ).map((slot) => slot.textContent),
  };
  localStorage.setItem("nhlBracket", JSON.stringify(bracketData));
  alert("Bracket saved!");
}

window.addEventListener("DOMContentLoaded", () => {
  initBracket();

  const savedBracket = localStorage.getItem("nhlBracket");
  if (savedBracket) {
    const bracketData = JSON.parse(savedBracket);

    restoreRound("#first-round .matchup-slot", bracketData.firstRound);
    restoreRound("#second-round .matchup-slot", bracketData.secondRound);
    restoreRound(
      "#conference-finals .matchup-slot",
      bracketData.conferenceFinals
    );
    restoreRound("#stanley-cup-final .matchup-slot", bracketData.stanleyCup);
  }
});
