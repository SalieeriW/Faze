//#region Constants
const numRegex = /[^\d.-]+/g;
const pop_form = $("pop_window");
const form = $("myform");
const input_error = $("errorSection");
const screen_container = document.querySelector(".screen");
const pop_result = document.querySelector(".pop_result");
const answer_log_list = document.querySelector(".log_container");
//#endregion

//#region Variables
var inputQty;
var inputs;
var round;
var inputStatusArray = [];
var roundNum;
var answer = [];
var won = false;
//#endregion

//#region Listeners

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (getUserPreference()) {
        pop_form.classList.add("hide");
        document.querySelector(".game_container").classList.remove("hide");
        init();
        startGame();
    }
});

$("reset").addEventListener("click", (e) => {
    init();
    startGame();
});

//#endregion

//#region Functions

let read_user_answer = (inputs) => {
    var answer = [];
    inputs.forEach((elem, index) => {
        answer[index] = elem.value;
    });
    return answer;
};

let getUserPreference = () => {
    inputQty = parseInt($("nums").value);
    round = parseInt($("rounds").value);

    //VALIDATE InputQty & Round
    if (inputQty > 9 || inputQty <= 0 || inputQty === null || inputQty == "") {
        showError("Please enter a number between 1 and 9");
        return false;
    } else if (round <= 0) {
        showError("BRO, WTF");
        return false;
    } else {
        return true;
    }
};

let init = () => {
    inputStatusArray = Array(inputQty).fill(false);

    roundNum = 1;
    $("round_num").innerHTML = roundNum;
    answer = getRandomNumbers(inputQty);
    console.log(answer);
    won = false;

    let inputsHTML = "";

    for (let i = 0; i < inputQty; i++) {
        inputsHTML += `
            <input class="screen_box" oninput="checkNum(this);" maxlength="1">
        `;
        screen_container.innerHTML = inputsHTML;
    }

    pop_result.classList.add("hide");
    answer_log_list.classList.remove("hide");
    answer_log_list.innerHTML = "";
};

let startGame = () => {
    inputs = document.querySelector("#game_container").querySelectorAll(".screen_box");
    inputs[0].focus();

    inputs.forEach((elem, index) => {
        elem.addEventListener("keyup", (e) => {
            if (e.key >= 0 && e.key <= 9 && index < inputs.length - 1) {
                let position = index + 1;
                for (position; position < inputQty; position++) {
                    if (!inputs[position].readOnly) break;
                }
                setTimeout(inputs[position]?.focus(), 20);
            }

            let notFilled = [...inputs].some((input) => input.value.length === 0);

            if (e.key == "Enter" && !notFilled) {
                if (roundNum <= round && !won) {
                    var user_answer_temporal = read_user_answer(inputs);

                    let answerLogBoxHTML = "";

                    for (let i = 0; i < inputQty; i++) {
                        let status = "";

                        if (user_answer_temporal[i] == answer[i]) {
                            status = "correct";
                            inputs[i].classList.add("correct");
                            inputs[i].readOnly = true;
                            inputStatusArray[i] = true;
                        } else {
                            if (answer.some((ans) => ans == user_answer_temporal[i])) {
                                status = "wrong_pos";
                            } else {
                                status = "wrong";
                            }
                        }

                        answerLogBoxHTML += `
                            <div class="screen_box ${status}">${user_answer_temporal[i]}</div>
                        `;
                    }

                    let j = 0;
                    for (j; j < inputQty; j++) {
                        if (inputStatusArray[j] == false) break;
                    }

                    if (j == inputQty) {
                        won = true;
                        gameOver(won);
                    } else if (roundNum == round) {
                        gameOver(won);
                    } else {
                        answer_log_list.innerHTML = `
                        <div class="answerpopback_container">
                            ${answerLogBoxHTML}
                        </div>
                        ${answer_log_list.innerHTML}
                        `;
                        setTimeout(inputs[j].focus(), 20);

                        var first = true;
                        for (var i = 0; i < inputQty; i++) {
                            if (inputStatusArray[i] == false) {
                                if (first) {
                                    inputs[i].focus();
                                    first = false;
                                }
                                inputs[i].value = "";
                            }
                        }
                    }
                }

                roundNum += 1;
                round_num.innerHTML = roundNum;
            }
        });
        elem.addEventListener("keydown", (e) => {
            if (e.key == "Backspace" && index > 0 && inputs[index].value.length === 0) {
                e.preventDefault();
                for (var i = index - 1; i >= 0; --i) {
                    if (!inputs[i].readOnly) break;
                }
                setTimeout(inputs[i].focus(), 100);
            }
        });
    });
};

let gameOver = (win) => {
    for (let i = 0; i < inputQty; i++) {
        inputs[i].readOnly = true;
        if (!win) {
            inputs[i].classList.add("wrong");
        }
    }

    let resultHTML = "";

    if (win) {
        resultHTML = `
            Komgratulation
            <img src="./src/congratulation.gif" class="img">
        `;
    } else {
        resultHTML = `
            You suck
            <img src="./src/rock.gif" class="img">
        `;
    }
    answer_log_list.classList.add("hide");

    pop_result.classList.remove("hide");
    pop_result.innerHTML = resultHTML;
    setTimeout(reset.focus(), 20);
};

let checkNum = (e) => {
    e.value = e.value.replace(numRegex, "");
};

let showError = (message) => {
    input_error.innerHTML = message;
    inputQty = null;
    round = null;
};

let getRandomNumbers = (size) => {
    let result = [];

    for (let i = 0; i < size; i++) {
        result[i] = Math.floor(Math.random() * 10);
    }

    return result;
};

//Global

function $(id) {
    return document.getElementById(id);
}
//#endregion
