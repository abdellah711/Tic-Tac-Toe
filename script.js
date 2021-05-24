
var { player1, player2, isPlayingWithComputer, player1Score, player2Score } = checkSavedValues()

var currentPlayer = 0;
var winner = -1;
var gameResult = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]

var isDark = localStorage.getItem('theme') ?? false

const body = $('body')

const cases = document.querySelectorAll('.case');

const xSvg = '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line class="line1" x1="22.0607" y1="20.9393" x2="80.0434" y2="78.9221" stroke-width="4"/>' +
    '<line class="line2" x1="80.0434" y1="21.0607" x2="22.0607" y2="79.0434" stroke-width="4"/></svg>'

const oSvg = '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="oval" cx="50.5" cy="50.5" r="34" stroke-width="4"/></svg>'

const player1Avatar = $('.player1-section .avatar-container')
const player2Avatar = $('.player2-section .avatar-container')

const player1ScoreElement = $('.player1-section .score')
const player2ScoreElement = $('.player2-section .score')


const userSvg = player1Avatar.html()
const computerSvg = player2Avatar.html()

const turnP = $('.turn')

const player1Name = $('.player1-section .name')
const player2Name = $('.player2-section .name')

const player2Checkbox = document.querySelector('#checkbox-player2')

const line = $('.win-line')

setupTheme()
updateValues()
updateTurn(false)

cases.forEach(el => {
    el.addEventListener('click', e => {
        if (el.innerHTML == '') {
            fillCase(el)
            if (isGameOver()) {
                setTimeout(()=>{
                    showGameOverDialog()
                },1000)
                return
            }
            computerTurn()
        }
    })
})

function computerTurn() {
    if (currentPlayer && isPlayingWithComputer) {
        let casePos = chooseRandomCase()
        fillCase(cases[casePos[0] * 3 + casePos[1]])
        if (isGameOver()) {
            setTimeout(()=>{
                showGameOverDialog()
            },1000)
            return
        }
    }
}

function fillCase(el) {
    const newEle = document.createElement('div')
    newEle.innerHTML = currentPlayer == 1 ? xSvg : oSvg
    el.appendChild(newEle)
    el.firstChild.classList.add('show')
    let ord = el.getAttribute("ord")
    gameResult[Math.floor(ord / 3)][ord % 3] = currentPlayer;
    currentPlayer = (currentPlayer + 1) % 2;
    updateTurn()
}
function isGameOver() {

    if (checkWinner()) {
        if (winner) {
            ++player2Score
        } else {
            ++player1Score
        }
        saveValues()
        updateValues()
        return true
    }

    return gameResult.map(e => e.includes(-1)).every(e => !e)
}

function checkWinner() {
    //check horizontally
    for (let i in gameResult) {
        let e = gameResult[i]
        let r = Array.from(new Set(e))
        if (hasOnePositiveItem(r)) {
            winner = r[0]
            showLine(i, 'h')
            break
        }
    }
    //check vertically
    for (let i in gameResult) {
        let col = new Set()
        for (let j = 0; j < 3; ++j) {
            col.add(gameResult[j][i])
        }
        col = Array.from(col)
        if (hasOnePositiveItem(col)) {
            winner = col[0]
            showLine(i, 'v')
            break
        }
    }
    //check diagonal
    let d1 = new Set()
    let d2 = new Set()
    for (let i = 0; i < 3; ++i) {
        d1.add(gameResult[i][i])
        d2.add(gameResult[i][2 - i])
    }
    d1 = Array.from(d1)
    d2 = Array.from(d2)

    if (hasOnePositiveItem(d1)) {
        winner = d1[0]
        showLine(0, 'd')
    } else if (hasOnePositiveItem(d2)) {
        winner = d2[0]
        showLine(1, 'd')
    }

    return winner !== -1
}

function hasOnePositiveItem(arr) {
    return (arr.length == 1 && arr[0] >= 0)
}

function chooseRandomCase() {
    let availableCases = []
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (gameResult[i][j] == -1) {
                availableCases.push([i, j])
            }
        }
    }
    return availableCases[Math.floor(Math.random() * availableCases.length)]
}

function restartGame() {
    cases.forEach(e => {
        e.innerHTML = '';
    })
    gameResult = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
    winner = -1
    computerTurn()

    $('.modal').fadeOut();
    $('.result-dialog').hide();

}

const result_dialog_msg = $('#result-dialog-msg');
function showGameOverDialog() {
    let msg;
    if (winner == -1) {
        msg = 'Draw'
    } else {
        msg = `${winner == 0 ? player1 : player2} is the winner`;
    }
    result_dialog_msg.html(msg);
    $('.modal').fadeIn();
    document.querySelector('.result-dialog').style.display = 'flex';
}

const start_btn = $('#start-btn')
const p1 = $('#player1')
const p2 = $('#player2')

document.querySelector('#_2players').onchange = function () {
    p2.val(this.checked ? "" : "Computer")
    p2.prop('disabled', !this.checked)
}

start_btn.on('click', e => {
    $('.modal').fadeOut()
    $('.play-dialog').hide()
    if (p1.val().length != 0) {
        player1 = p1.val()
        player1Name.html(player1)
    }

    if (p2.val().length != 0) {
        player2 = p2.val()
        player2Name.html(player2)
    }
    saveValues()
})

$('#restart-btn').click(e => {
    restartGame()
})


player2Checkbox.addEventListener('change', e => {
    setPlayingWithComputer(e.target.checked)
    saveValues()
})

function setPlayingWithComputer(boo, restart = true) {
    isPlayingWithComputer = !boo
    restart && restartGame()
    if (isPlayingWithComputer) {
        player2 = 'Computer'
        player2Name.attr('contenteditable', false)
        player2Name.html(player2)
        player2Avatar.html(computerSvg)
        return
    }
    player2 = 'Player 2'
    player2Name.attr('contenteditable', true)
    player2Name.html(player2)
    player2Avatar.html(userSvg)
}

$('.player1-section .name').on('input', e => {
    player1 = e.target.textContent
    updateTurn(false)
})

function updateTurn(changeAvatar = true) {
    let turnTxt = currentPlayer ? player2 : player1;
    turnP.text(turnTxt + '\'s turn')
    if (!changeAvatar) {
        return
    }
    player2Avatar.toggleClass('turn-bg')
    player1Avatar.toggleClass('turn-bg')
}



function restartScore() {
    player1Score = 0; player2Score = 0;
    saveValues()
    refreshScore()
    restartGame()
}


function refreshScore() {
    player1ScoreElement.html('Score: ' + player1Score)
    player2ScoreElement.html('Score: ' + player2Score)
}

function checkSavedValues() {
    if (data = localStorage.getItem('data')) {
        return JSON.parse(data)
    }
    $('.modal').fadeIn()
    $('.play-dialog').css('display', 'grid')
    return { player1: 'Player 1', player2: 'Player 2', isPlayingWithComputer: true, player1Score: 0, player2Score: 0 }
}

function saveValues() {
    localStorage.setItem(
        'data',
        JSON.stringify({ player1, player2, isPlayingWithComputer, player1Score, player2Score })
    )
}

function updateValues() {
    player1ScoreElement.html('Score: ' + player1Score)
    player2ScoreElement.html('Score: ' + player2Score)
    player1Name.html(player1)
    player2Name.html(player2)
    player2Checkbox.checked = !isPlayingWithComputer
    setPlayingWithComputer(!isPlayingWithComputer, false)
}

function setupTheme() {
    if (body.hasClass('dark') == isDark) {
        return
    }
    body.toggleClass('dark')
}

function updateTheme() {
    isDark = !isDark
    setupTheme()
}

$('#theme-svg').click(() => {
    updateTheme()
})

function showLine(pos, direction) {
    let className = 'line-'
    switch (direction) {
        case 'v': className += 'verti-'; break;
        case 'h': className += 'horiz-'; break;
        case 'd': className += 'diago-'; break;
    }
    if (direction == 'd') {
        className += (pos == 0) ? 'left' : 'right';
    } else {
        ++pos
        className += pos
    }
    line.removeClass()
        .addClass(['win-line', className])
        .show()
    setTimeout(() => {
        line.removeClass()
            .addClass('win-line')
            .hide()
    }, 1000)
}