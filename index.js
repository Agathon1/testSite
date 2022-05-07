const posibleFeeds = {
    New: "https://hacker-news.firebaseio.com/v0/newstories.json",
    Top: "https://hacker-news.firebaseio.com/v0/topstories.json",
    Best: "https://hacker-news.firebaseio.com/v0/beststories.json",
    Ask: "https://hacker-news.firebaseio.com/v0/askstories.json",
    Show: "https://hacker-news.firebaseio.com/v0/showstories.json",
    Job: "https://hacker-news.firebaseio.com/v0/jobstories.json"
};

const opacityRange = [.0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1];
let HOW_MANY_STORIES_TO_LOAD = 0;


// Loads already-set possibleFeed
let firstFeed = localStorage.getItem("firstFeed") ? localStorage.getItem("firstFeed") : "";
let secondFeed = localStorage.getItem("secondFeed") ? localStorage.getItem("secondFeed") : "";
let thirdFeed = localStorage.getItem("thirdFeed") ? localStorage.getItem("thirdFeed") : "";
const feedsByID = {1: "firstFeed", 2: "secondFeed", 3: "thirdFeed"};


// Removes the "Subscribe to a feed" button and starts a subscription dialog.
function initSubDialog(ID) {
    const PANEL = document.getElementById(`panel${ID}`);
    PANEL.innerHTML = `<div id="dialog${ID}" class="subscribe-dialog">Choose a subscription :</div>`;

    const DIALOG = document.getElementById(`dialog${ID}`);

    for (const key in posibleFeeds) { DIALOG.innerHTML += `<div onclick="setSub(${ID}, '${key}')" class="subscribe-choice">${key}</div>`; };

    let opacityPtr = 0;
    let fadeIn = window.setInterval(() => {DIALOG.style.opacity = opacityRange[opacityPtr]; opacityPtr++; }, 25); 
}

async function setSub(ID, key) {
    localStorage.setItem(feedsByID[ID], posibleFeeds[key]);

    const DIALOG = document.getElementById(`dialog${ID}`);
    DIALOG.innerHTML = `<p class="text-slate-100">Chosen "${key}"!`;
    
    let opacityPtr = 0;
    let fadeOut = window.setInterval(() => {DIALOG.style.opacity = opacityRange[opacityRange.length - opacityPtr]; opacityPtr++; }, 25);
    await new Promise(r => setTimeout(r, 400)); // Sleep 400ms
    loadStories(ID, DIALOG);
};

async function loadStories(ID, toRemove) {
    const PANEL = document.getElementById(`panel${ID}`);
    let storiesHTML = "";
    const URL = localStorage.getItem(feedsByID[ID]);
    if (toRemove != null ) { toRemove.remove() };
    fetch(URL)
    .then(response => response.json())
    .then((response) => {
        for (let i = 0; i < HOW_MANY_STORIES_TO_LOAD; i++) {
            const URL = `https://hacker-news.firebaseio.com/v0/item/${response[i]}.json`
            fetch(URL)
            .then(response => response.json())
            .then((response) => {
                let story = {
                    title: response.title,
                    url: response.url,
                    time: response.time,
                    score: response.score,
                    id: response.id,
                    kidsCount: response.descendants
                };

                if (story.url == null) { story.url = `https://news.ycombinator.com/item?id=${story.id}`; }

                let HTML = `
                    <div class="news-item">
                        <p class="item-title">${story.title}</p>
                        <div class="buttons">
                            <div onclick="window.open('${story.url}', '_blank');" class="open-link-button"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></div>
                            <div onclick="window.open('https://news.ycombinator.com/item?id=${story.id}', '_blank');" class="open-comments-button"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg></div>
                        </div>
                    </div>`;

                    PANEL.innerHTML += HTML;
                    let oldHTML = localStorage.getItem(`${feedsByID[ID]}HTML`) ? localStorage.getItem(`${feedsByID[ID]}HTML`) : "";
                    oldHTML += HTML;
                    localStorage.setItem(`${feedsByID[ID]}HTML`, oldHTML);
            })
        }
    })   
}

let firstFeedHTML = localStorage.getItem("firstFeedHTML");
let secondFeedHTML = localStorage.getItem("secondFeedHTML");
let thirdFeedHTML = localStorage.getItem("thirdFeedHTML");

window.onload = function() {
    const CHANCE = 30
    HOW_MANY_STORIES_TO_LOAD = localStorage.getItem("HOW_MANY_STORIES_TO_LOAD") ? localStorage.getItem("HOW_MANY_STORIES_TO_LOAD") : 24

    if (firstFeedHTML != null) {
        document.getElementById("panel1").innerHTML = firstFeedHTML;
        if (Math.floor(Math.random() * CHANCE) === 1) { localStorage.removeItem("firstFeedHTML"); }
    };
    if (secondFeedHTML != null) {
        document.getElementById("panel2").innerHTML = secondFeedHTML;
        if (Math.floor(Math.random() * CHANCE) === 1) { localStorage.removeItem("secondFeedHTML"); }
    };
    if (thirdFeedHTML != null) {
        document.getElementById("panel3").innerHTML = thirdFeedHTML;
        if (Math.floor(Math.random() * CHANCE) === 1) { localStorage.removeItem("thirdFeedHTML"); }
    };

    if (localStorage.getItem("firstFeed") == null) {
        const PANEL = document.getElementById("panel1");
        PANEL.innerHTML += `<div class="subscribe-button" onclick="initSubDialog(1)">Subscribe to a feed</div>`
    }
    if (localStorage.getItem("secondFeed") == null) {
        const PANEL = document.getElementById("panel2");
        PANEL.innerHTML += `<div class="subscribe-button" onclick="initSubDialog(2)">Subscribe to a feed</div>`
    }
    if (localStorage.getItem("thirdFeed") == null) {
        const PANEL = document.getElementById("panel3");
        PANEL.innerHTML += `<div class="subscribe-button" onclick="initSubDialog(3)">Subscribe to a feed</div>`
    }

    if (localStorage.getItem("firstFeed") != null && firstFeedHTML == null) { loadStories(1) };
    if (localStorage.getItem("secondFeed") != null && secondFeedHTML == null) { loadStories(2) };
    if (localStorage.getItem("thirdFeed") != null && thirdFeedHTML == null) { loadStories(3) };

    document.addEventListener("keydown", (key) => {
        const BODY = document.querySelector("body");
        if (key.code == "Enter") {
            let x = prompt("Change default number of stories to load", HOW_MANY_STORIES_TO_LOAD.toString())
            if (Number(x) && Number(x) != HOW_MANY_STORIES_TO_LOAD) {
                x = Number(x);
                HOW_MANY_STORIES_TO_LOAD = x;
                localStorage.setItem("HOW_MANY_STORIES_TO_LOAD", HOW_MANY_STORIES_TO_LOAD);
                localStorage.removeItem("firstFeedHTML");
                localStorage.removeItem("secondFeedHTML");
                localStorage.removeItem("thirdFeedHTML");
                location.reload();
            } else if (Number(x) == HOW_MANY_STORIES_TO_LOAD) {
                alert("MUST BE NEW VALUE!");
            } else {
                alert("MUST INPUT NUMBER!!!");
            };
        }
        if (key.code == "Space") {
            key.preventDefault();
            if (confirm("Are you sure you want to clear the all feeds?")) {
                localStorage.clear();
                let opacityPtr = 0;
                let fadeOut = window.setInterval(() => {BODY.style.opacity = opacityRange[opacityRange.length - opacityPtr]; opacityPtr++; }, 25);
                let timeOUT = setTimeout(() => { location.reload();}, 400);
                
            } else if (confirm("Do you wish to remove one of the feeds?")) {
                let x = prompt("Which one? Type a number :\n[1] = feedOne\n[2] = feedTwo\n[3] = feedThree");
                let opacityPtr = 0;
                if (x == "1") {
                    localStorage.removeItem("firstFeed");
                    localStorage.removeItem("firstFeedHTML");
                    let opacityPtr = 0;
                    let fadeOut = window.setInterval(() => {BODY.style.opacity = opacityRange[opacityRange.length - opacityPtr]; opacityPtr++; }, 25);
                    let timeOUT = setTimeout(() => { location.reload();}, 400);
                } else if (x == "2") {
                    localStorage.removeItem("secondFeed");
                    localStorage.removeItem("secondFeedHTML");
                    let opacityPtr = 0;
                    let fadeOut = window.setInterval(() => {BODY.style.opacity = opacityRange[opacityRange.length - opacityPtr]; opacityPtr++; }, 25);
                    let timeOUT = setTimeout(() => { location.reload();}, 400);
                } else if (x == "3") {
                    localStorage.removeItem("thirdFeed");
                    localStorage.removeItem("thirdFeedHTML");
                    let opacityPtr = 0;
                    let fadeOut = window.setInterval(() => {BODY.style.opacity = opacityRange[opacityRange.length - opacityPtr]; opacityPtr++; }, 25);
                    let timeOUT = setTimeout(() => { location.reload();}, 400);
                } else {
                    alert("ERROR - You must choose a number!")
                }
            }
        }
    });
};