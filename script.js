/* =========================================
   RAFFLE DRAW APPLICATION
========================================= */


let participants = [];

let winners = [];

let drawNumber = 0;

let isDrawing = false;


/* =========================================
   ELEMENTS
========================================= */

const participantInput =
    document.getElementById("participantInput");

const addParticipantsButton =
    document.getElementById("addParticipants");

const demoButton =
    document.getElementById("demoButton");

const clearParticipantsButton =
    document.getElementById("clearParticipants");

const participantsList =
    document.getElementById("participantsList");

const participantCount =
    document.getElementById("participantCount");

const totalParticipants =
    document.getElementById("totalParticipants");

const drawButton =
    document.getElementById("drawButton");

const raffleBall =
    document.getElementById("raffleBall");

const winnerBox =
    document.getElementById("winnerBox");

const winnerName =
    document.getElementById("winnerName");

const winnerSubtitle =
    document.getElementById("winnerSubtitle");

const removeWinnerCheckbox =
    document.getElementById("removeWinner");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistory");

const totalDraws =
    document.getElementById("totalDraws");

const resetRaffleButton =
    document.getElementById("resetRaffle");

const toast =
    document.getElementById("toast");

const confettiContainer =
    document.getElementById("confettiContainer");


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    return text.replace(/[&<>"']/g, character => {

        const characters = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        };

        return characters[character];

    });
}


/* =========================================
   CLEAN PARTICIPANTS
========================================= */

function cleanNames(names) {

    const result = [];

    const seen = new Set();

    names.forEach(name => {

        name = name.trim();

        if (!name) {
            return;
        }

        const key = name.toLowerCase();

        if (!seen.has(key)) {

            seen.add(key);

            result.push(name);

        }

    });

    return result;
}


/* =========================================
   RENDER PARTICIPANTS
========================================= */

function renderParticipants() {

    participantCount.textContent =
        participants.length;

    totalParticipants.textContent =
        participants.length;


    if (participants.length === 0) {

        participantsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <p>No participants yet</p>

                <span>
                    Add names above to begin.
                </span>

            </div>

        `;

        drawButton.disabled = true;

        return;

    }


    drawButton.disabled = false;


    participantsList.innerHTML =
        participants.map((person, index) => `

            <div class="person">

                <div class="person-info">

                    <div class="person-number">
                        ${index + 1}
                    </div>

                    <div class="person-name">
                        ${escapeHTML(person)}
                    </div>

                </div>

                <button
                    class="remove-person"
                    data-index="${index}"
                    title="Remove participant"
                >
                    ×
                </button>

            </div>

        `).join("");

}


/* =========================================
   ADD PARTICIPANTS
========================================= */

addParticipantsButton.addEventListener(
    "click",
    () => {

        const names =
            participantInput.value
                .split(/\r?\n/);

        const oldCount =
            participants.length;


        participants =
            cleanNames([
                ...participants,
                ...names
            ]);


        const added =
            participants.length - oldCount;


        participantInput.value = "";

        renderParticipants();


        if (added > 0) {

            showToast(
                `${added} participant${added === 1 ? "" : "s"} added.`
            );

        } else {

            showToast(
                "No new participants were added."
            );

        }

    }
);


/* =========================================
   DEMO DATA
========================================= */

demoButton.addEventListener(
    "click",
    () => {

        participantInput.value = [

            "John Doe",
            "Mary Smith",
            "David Brown",
            "Sarah Williams",
            "Michael Johnson",
            "Grace Anderson",
            "Daniel Thomas",
            "Esther Wilson",
            "James Taylor",
            "Elizabeth Moore"

        ].join("\n");


        showToast(
            "Demo participants loaded."
        );

    }
);


/* =========================================
   REMOVE PARTICIPANT
========================================= */

participantsList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".remove-person"
            );


        if (!button) {
            return;
        }


        const index =
            Number(button.dataset.index);


        const removed =
            participants[index];


        participants.splice(index, 1);


        renderParticipants();


        showToast(
            `${removed} removed.`
        );

    }
);


/* =========================================
   CLEAR PARTICIPANTS
========================================= */

clearParticipantsButton.addEventListener(
    "click",
    () => {

        if (!participants.length) {

            showToast(
                "There are no participants to clear."
            );

            return;
        }


        if (
            !confirm(
                "Clear all participants?"
            )
        ) {

            return;

        }


        participants = [];

        renderParticipants();

        showToast(
            "Participants cleared."
        );

    }
);


/* =========================================
   DRAW WINNER
========================================= */

drawButton.addEventListener(
    "click",
    startDraw
);


function startDraw() {

    if (isDrawing) {
        return;
    }


    if (!participants.length) {

        showToast(
            "Add participants before drawing."
        );

        return;

    }


    isDrawing = true;

    drawButton.disabled = true;


    raffleBall.classList.add(
        "drawing"
    );


    winnerBox.classList.remove(
        "reveal"
    );


    winnerName.textContent =
        "Selecting...";


    winnerSubtitle.textContent =
        "Please wait";


    /*
        Fast name cycling creates the
        feeling of a real raffle machine.
    */

    let cycles = 0;


    const animation =
        setInterval(() => {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    participants.length
                );


            winnerName.textContent =
                participants[randomIndex];


            cycles++;


            if (cycles >= 22) {

                clearInterval(animation);

                finishDraw();

            }

        }, 90);

}


/* =========================================
   FINISH DRAW
========================================= */

function finishDraw() {

    /*
        The actual winner selection.
        For a pure frontend application,
        crypto randomness is preferable
        to Math.random().
    */

    const randomArray =
        new Uint32Array(1);

    crypto.getRandomValues(
        randomArray
    );


    const randomIndex =
        randomArray[0] %
        participants.length;


    const winner =
        participants[randomIndex];


    raffleBall.classList.remove(
        "drawing"
    );


    drawNumber++;


    winnerName.textContent =
        winner;


    winnerSubtitle.textContent =
        `Winner of Draw #${drawNumber}`;


    winnerBox.classList.remove(
        "reveal"
    );


    /*
        Restart animation.
    */

    void winnerBox.offsetWidth;


    winnerBox.classList.add(
        "reveal"
    );


    /*
        Save history.
    */

    winners.unshift({

        number: drawNumber,

        name: winner,

        time:
            new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

    });


    renderHistory();


    /*
        Remove winner if option enabled.
    */

    if (
        removeWinnerCheckbox.checked
    ) {

        participants =
            participants.filter(
                person => person !== winner
            );


        renderParticipants();

    }


    /*
        Celebration.
    */

    createConfetti();


    isDrawing = false;


    if (participants.length > 0) {

        drawButton.disabled = false;

    }


    showToast(
        `🎉 ${winner} is the winner!`
    );

}


/* =========================================
   RENDER HISTORY
========================================= */

function renderHistory() {

    totalDraws.textContent =
        winners.length;


    if (!winners.length) {

        historyList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏆
                </div>

                <p>No winners yet</p>

                <span>
                    Your draw results will appear here.
                </span>

            </div>

        `;

        return;

    }


    historyList.innerHTML =
        winners.map(winner => `

            <div class="history-item">

                <div class="history-info">

                    <div class="history-number">
                        ${winner.number}
                    </div>

                    <div>

                        <div class="history-name">
                            ${escapeHTML(
                                winner.name
                            )}
                        </div>

                        <div class="history-time">
                            ${winner.time}
                        </div>

                    </div>

                </div>

                <span>
                    🏆
                </span>

            </div>

        `).join("");

}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryButton.addEventListener(
    "click",
    () => {

        if (!winners.length) {

            showToast(
                "Winner history is already empty."
            );

            return;

        }


        if (
            !confirm(
                "Clear all winner history?"
            )
        ) {

            return;

        }


        winners = [];

        renderHistory();

        showToast(
            "Winner history cleared."
        );

    }
);


/* =========================================
   RESET RAFFLE
========================================= */

resetRaffleButton.addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "Reset the entire raffle? This will remove all participants and winners."
            )
        ) {

            return;

        }


        participants = [];

        winners = [];

        drawNumber = 0;


        winnerName.textContent =
            "—";


        winnerSubtitle.textContent =
            "Your winner will appear here";


        raffleBall.classList.remove(
            "drawing"
        );


        renderParticipants();

        renderHistory();


        showToast(
            "Raffle completely reset."
        );

    }
);


/* =========================================
   CONFETTI
========================================= */

function createConfetti() {

    confettiContainer.innerHTML = "";


    const pieces = 100;


    for (
        let i = 0;
        i < pieces;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


        piece.className =
            "confetti";


        piece.style.left =
            `${Math.random() * 100}%`;


        piece.style.background =
            `hsl(
                ${Math.random() * 360},
                85%,
                60%
            )`;


        piece.style.animationDelay =
            `${Math.random() * .5}s`;


        piece.style.width =
            `${6 + Math.random() * 7}px`;


        piece.style.height =
            `${9 + Math.random() * 8}px`;


        confettiContainer.appendChild(
            piece
        );

    }


    setTimeout(() => {

        confettiContainer.innerHTML = "";

    }, 2500);

}


/* =========================================
   INITIAL STATE
========================================= */

renderParticipants();

renderHistory();