
var player1 = "Player 1";
var player2 = "Player 2";
var currentPlayer = 0;
var winner = -1;
var isPlayingWithComputer = false
var player1Score= 0,player2Score= 0;
var gameResult = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]




const cases = document.querySelectorAll('.case');

const xSvg = '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line class="line1" x1="22.0607" y1="20.9393" x2="80.0434" y2="78.9221" stroke="#4769E2" stroke-width="3"/>' +
    '<line class="line2" x1="80.0434" y1="21.0607" x2="22.0607" y2="79.0434" stroke="#4769E2" stroke-width="3"/></svg>'

const oSvg = '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="oval" cx="50.5" cy="50.5" r="34" stroke="#4769E2" stroke-width="3"/></svg>'

const player1Avatar = $('.player1-section .avatar-container')
const player2Avatar = $('.player2-section .avatar-container')

const userSvg = player1Avatar.html()
const computerSvg = player2Avatar.html()

const turnP = document.querySelector('.turn')

updateTurn()

cases.forEach(el => {
    el.addEventListener('click', e => {
        if (el.innerHTML == '') {
            fillCase(el)
            if (isGameOver()) {
                showGameOverDialog()
                return
            }
            computerTurn()
        }
    })
})

function computerTurn(){
    if (currentPlayer && isPlayingWithComputer) {
        let casePos = chooseRandomCase()
        fillCase(cases[casePos[0] * 3 + casePos[1]])
        if (isGameOver()) {
            showGameOverDialog()
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
        return true
    }

    return gameResult.map(e => e.includes(-1)).every(e => !e)
}

function checkWinner() {
    //check horizontally
    for (let e of gameResult) {
        let r = Array.from(new Set(e))
        if (hasOnePositiveItem(r)) {
            winner = r[0]
            break
        }
    }
    //check vertically
    for (let i = 0; i < 3; ++i) {
        let col = new Set()
        for (let j = 0; j < 3; ++j) {
            col.add(gameResult[j][i])
        }
        col = Array.from(col)
        if (hasOnePositiveItem(col)) {
            winner = col[0]
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
    } else if (hasOnePositiveItem(d2)) {
        winner = d2[0]
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
    console.log(availableCases)
    return availableCases[Math.floor(Math.random() * availableCases.length)]
}

function restarGame() {
    cases.forEach(e => {
        e.innerHTML = '';
    })
    gameResult = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
    winner = -1

    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.result-dialog').style.display = 'none';
    computerTurn()
}

const result_dialog_msg = document.querySelector('#result-dialog-msg');
function showGameOverDialog() {
    let msg;
    if (winner == -1) {
        msg = 'Draw'
    } else {
        msg = `${winner == 0 ? player1 : player2} is the winner`;
    }
    result_dialog_msg.innerHTML = msg;
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.result-dialog').style.display = 'flex';
}

const start_btn = document.querySelector('#start-btn')
const p1 = document.querySelector('#player1')
const p2 = document.querySelector('#player2')

document.querySelector('#_2players').onchange = function () {
    p2.value = this.checked ? "" : "Computer"
    p2.disabled = !this.checked
}

start_btn.addEventListener('click', e => {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.play-dialog').style.display = 'none';
    if (p1.value.length != 0) {
        player1 = p1.value
    }

    if (p2.value.length != 0) {
        player2 = p2.value
    }

})

const restart_btn = document.querySelector('#restart-btn')
restart_btn.onclick = e => {
    restarGame()
}

const player2Checkbox = document.querySelector('#checkbox-player2')
player2Checkbox.addEventListener('change', e => {
    
    setPlayingWithComputer(e.target.checked)
})
const player2Name = $('.player2-section .name')
function setPlayingWithComputer(boo){
    isPlayingWithComputer = !boo

    if(isPlayingWithComputer){
        player2 = 'Computer'
        player2Name.attr('contenteditable',false)
        player2Name.html(player2)
        player2Avatar.html(computerSvg)
        return
    }
    player2 = 'Player 2'
    player2Name.attr('contenteditable',true)
    player2Name.html(player2)
    player2Avatar.html(userSvg)
}

$('.player1-section .name').on('input', e => {
    player1 = e.target.textContent
    updateTurn()
})

function updateTurn() {
    let turnTxt = currentPlayer ? player2 : player1;
    turnP.textContent = turnTxt + '\'s turn';
}

function restartScore(){

}