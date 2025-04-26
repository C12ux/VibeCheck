import questions from "./questions.js";

const start = document.querySelector("#start");
const body = document.querySelector("body");
const style = document.querySelectorAll("link");
const head = document.querySelector("head");
const title = document.querySelector("title");
let score = 0;
let questionNumber = 0;
let answers = [];

// Quiz loop
start.addEventListener('click', async () => {
    removeContent();

    title.innerText = "Count Down";

    // Load countdown timer
    body.id = "ps-body";

    insertContent("\
        <main>\
            <h1 id='timer'>Ready?</h1>\
        </main>\
    ");
    
    await timer();

    // Proceed to questions after countdown
    serveQuestions(questionNumber);
});

// Make a Promise for setTimeout so we can execute this in async
function timer() {
    return new Promise(
        resolve => {
            // Timer logic
            const timerDisplay = document.getElementById("timer");
            // Show "Ready" for 1 second
            setTimeout(() => {
                let timeLeft = 5;
                timerDisplay.textContent = timeLeft;

                const countdown = setInterval(() => {
                    timeLeft--;
                    if (timeLeft > 0) {
                        timerDisplay.textContent = timeLeft;
                    } else {
                        clearInterval(countdown);

                        // End Promise success
                        resolve();
                    }
                }, 1000);
            }, 1000); // Delay before starting countdown
        }
    );
}

// Function for removing css
function removeStyle(styleName) {
    style.forEach(item => {
        if (item.href.match(new RegExp(styleName)) !== null) {
            item.parentNode.removeChild(item);
        }
    });
}

// Function for adding styles
function addStyle(styleName) {
    head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./${styleName}">`);
}

// This function removes all contents inside body excluding the app.js script
function removeContent() {
    // Remove all elements in the body other than the script
    [...document.body.children].forEach(el => {
        if (el.tagName.toLowerCase() !== "script") {
            el.remove();
        }
    });
}

// This function only removes the question, used in the serveQuestions logic
function removeQuestion() {
    document.querySelector(".questions-main").remove();
}

// This function inserts content in body, used in timer logic
function insertContent(content) {
    body.insertAdjacentHTML("afterbegin", content);
}

// This function is primarily for question, inserting the question only inside DOM
function insertQuestion(content) {
    document.querySelector(".progress-bar-container").insertAdjacentHTML("afterend", content);
}

// This function is the question logic of the quiz
const serveQuestions = (questionNumber) => {
    if (questionNumber === 0) {
        removeContent();
        removeStyle('styles.css');
        body.removeAttribute('id');
        addStyle("styles-q1.css");
        insertContent(`
            <div class="progress-bar-container">
                <div class="progress-bar-fill"></div>
            </div>
        `);
    } else if (questionNumber <= 19) {
        removeQuestion();
    } else {
        // Save score and answers in localStorage
        localStorage.setItem("score", score);
        localStorage.setItem("answers", JSON.stringify(answers));
        localStorage.setItem("correctAnswers", JSON.stringify(questions.map(q => q.answer)));

        // Redirect to result page
        window.location.href = "result.html";
        return;
    }

    title.innerText = `Quiz Time! - ${questionNumber + 1}`;

    if ("picture" in questions[questionNumber]) {
        insertQuestion(`
            <div class="questions-main">
                <h1>Question <span id="q-number">${questionNumber + 1}</span></h1>

                <div class="img-container">
                    <p>Look at this photo.</p>
                    <img src="${questions[questionNumber].picture}" alt="question-image">
                </div>

                <div class="questions-container">
                    <p id="question-text">${questions[questionNumber].question}</p>
                </div>
                <div class="choices-top" id="choices-top">
                    <button class="choice" value="0">${questions[questionNumber].options[0]}</button>
                    <button class="choice" value="1">${questions[questionNumber].options[1]}</button>
                </div>
            
                <div class="choices-bottom" id="choices-bottom">
                    <button class="choice" value="2">${questions[questionNumber].options[2]}</button>
                    <button class="choice" value="3">${questions[questionNumber].options[3]}</button>
                </div>
            </div>
        `);
        body.style.background = "radial-gradient(circle at bottom, #94e6c4 1%, #8338EC 100%);";
        document.querySelector(".progress-bar-fill").style.backgroundColor = "#94e6c4;";

        body.style.height = "100%";

        
    } else if ("extra" in questions[questionNumber]) {
        insertQuestion(`
            <div class="questions-main">
                <h1>Question <span id="q-number">${questionNumber + 1}</span></h1>
                <div class="questions-container">
                    <p id="question-text">${questions[questionNumber].question} <br> <br>${questions[questionNumber].extra}</p>
                </div>
                <div class="choices-top" id="choices-top">
                    <button class="choice" value="0">${questions[questionNumber].options[0]}</button>
                    <button class="choice" value="1">${questions[questionNumber].options[1]}</button>
                </div>
            
                <div class="choices-bottom" id="choices-bottom">
                    <button class="choice" value="2">${questions[questionNumber].options[2]}</button>
                    <button class="choice" value="3">${questions[questionNumber].options[3]}</button>
                </div>
            </div>    
        `);
        body.style.background = "radial-gradient(circle at bottom, #ff8585 1%, #ffd485 100%);";
        document.querySelector(".progress-bar-fill").style.backgroundColor = "#8338EC;";

        body.style.height = "100vh";
    } else {
        insertQuestion(`
            <div class="questions-main">
                <h1>Question <span id="q-number">${questionNumber + 1}</span></h1>
                <div class="questions-container">
                    <p id="question-text">${questions[questionNumber].question}</p>
                </div>
                <div class="choices-top" id="choices-top">
                    <button class="choice" value="0">${questions[questionNumber].options[0]}</button>
                    <button class="choice" value="1">${questions[questionNumber].options[1]}</button>
                </div>
            
                <div class="choices-bottom" id="choices-bottom">
                    <button class="choice" value="2">${questions[questionNumber].options[2]}</button>
                    <button class="choice" value="3">${questions[questionNumber].options[3]}</button>
                </div>
            </div>
        `);
        body.style.background = "radial-gradient(circle at bottom, #94e6c4 1%, #8338EC 100%);";
        document.querySelector(".progress-bar-fill").style.backgroundColor = "#94e6c4;";

        body.style.height = "100vh";
    }

    window.addEventListener('scroll', function () {
        let currentScroll = window.scrollY;
        let lastScrollTop = 0;
        const progressBar = document.querySelector('.progress-bar-container');

        if (currentScroll > lastScrollTop) {
            // Scrolling down: Hide the progress bar (only moves up)
            progressBar.style.transform = "translateY(-50px) translateX(-50%)";
            progressBar.style.opacity = "0";
        } else {
            // Scrolling up: Show the progress bar again
            progressBar.style.transform = "translateY(0) translateX(-50%)";
            progressBar.style.opacity = "1";
        }

        lastScrollTop = currentScroll;
    });

    document.querySelector(".progress-bar-fill").style.width = `${(questionNumber / 20) * 100}%`;
    const choiceButtons = document.querySelectorAll(".choice");
    const correctAnswer = questions[questionNumber].answer;

    choiceButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const selected = e.target.value;

            // Save the answer
            answers.push(selected);

            // Disable all choices
            choiceButtons.forEach(btn => btn.disabled = true);

            // Hide unneeded choices
            choiceButtons.forEach(btn => {
                if (btn.value !== selected && btn.value !== correctAnswer) {
                    btn.style.display = "none";
                }
            });

            // Apply coloring
            if (parseInt(selected) === parseInt(correctAnswer)) {
                e.target.style.backgroundColor = "green";
                e.target.style.color = "white";
                score++;
            } else {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";

                const correctBtn = [...choiceButtons].find(btn => parseInt(btn.value) === parseInt(correctAnswer));
                if (correctBtn) {
                    correctBtn.style.backgroundColor = "green";
                    correctBtn.style.color = "white";
                }
            }

            // Move to next question after delay
            setTimeout(() => {
                serveQuestions(++questionNumber);
            }, 1500);
        });
    });
};
