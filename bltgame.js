const ingredients = document.querySelectorAll('.ingredient');
const yourturn = document.getElementById('yourturn');
const text = document.getElementById('text');
const points = document.getElementById('points');
const time = document.getElementById('time');
const score_elem = document.getElementById('best_score');
const metric_elem = document.getElementById('best_metric');
const begin = document.getElementById('begin');
const BLT = ['bread', 'bacon', 'lettuce', 'tomato'];

let game = [];
let user = [];
let level = 0;
let maxlev = 5;
let score = 0;
let starttime;
let endtime;
let currtime;
let nexttime;
let playing = false;

function set_storage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get_storage(key) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
}

begin.addEventListener('click', startgame);
let best_score = get_storage('best_score')
let best_metric = get_storage('best_metric');
if (best_score == null && best_metric == null) {
    score_elem.textContent = "Best Score: 0";
    metric_elem.textContent = "Best Time: 0 seconds";
} else {
    display_best(best_score, best_metric);
}

function startgame() {
    level = 0;
    score = 0;
    game = [];
    user = [];
    points.textContent = "";
    time.textContent = "";
    starttime = Date.now();
    currtime = Date.now();
    nextlev();
    begin.disabled = true;
}

function nextlev() {
    user = [];
    nexttime = Date.now();
    if (level == 0) {
        score = 0;
    } else {
        score = Math.round(level * (1000 + 1000000 / (nexttime - currtime)));
    }
    currtime = nexttime;
    points.textContent = `Score: ${score}`;
    if (level == maxlev) {
        endtime = Date.now();
        const totaltime = (endtime - starttime) / 1000;
        text.textContent = "Congrats! You completed all the levels!";
        time.textContent = `Total time: ${totaltime} seconds`;
        endgame(totaltime);
    }
    else {
        level++;
        text.textContent = `Level ${level} out of 5`;
        const ranBLT = BLT[Math.floor(Math.random() * 4)];
        game.push(ranBLT);
        play(game);
    }
}

function play(pattern) {
    let i = 0;
    playing = true;
    const interval = setInterval(() => {
        if (i < pattern.length) {
            yourturn.textContent = "";
            chosen(pattern[i]);
            i++;
        } else {
            clearInterval(interval);
            yourturn.textContent = "Your Turn!";
            playing = false;
        }
    }, 1000);
}

function chosen(BLT) {
    const curringredient = document.getElementById(BLT);
    curringredient.style.transform = 'scale(1.3)';
    setTimeout(() => {
        curringredient.style.transform = 'scale(1)';
    }, 500);
}

ingredients.forEach(ingredient => {
    ingredient.addEventListener('click', () => {
        if (!playing) {
            const userBLT = ingredient.id;
            const curringredient = document.getElementById(userBLT);
            curringredient.style.transform = 'scale(1.3)';
            setTimeout(() => {
                curringredient.style.transform = 'scale(1)';
            }, 500);
            user.push(userBLT);
            check(user.length - 1);
        }
    });
});

function check(index) {
    if (user[index] === game[index]) {
        if (user.length === game.length) {
            yourturn.textContent = "Nice!";
            setTimeout(() => {
                nextlev();
            }, 1000);
        }
    } else {
        text.textContent = "Oops! Better luck next time!";
        begin.disabled = false;
    }
}

function endgame(totaltime) {
    begin.disabled = false;
    if (score > best_score || best_score == null) {
        best_score = score;
        set_storage('best_score', best_score);
    }
    if (totaltime < best_metric || best_metric == null) {
        best_metric = totaltime;
        set_storage('best_metric', best_metric);
    }
    display_best(best_score, best_metric);
}

function display_best(best_score, best_metric) {
    score_elem.textContent = `Best Score: ${best_score}`;
    metric_elem.textContent = `Best Time: ${best_metric} seconds`;
}