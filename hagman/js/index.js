hangman = {
    hangmanTheme: '',
    hangmanWords: [],
    hangmanWordSelected: [],
    correctsLetters: [],
    countErrors: 0,
    word: document.getElementById('word'),

    getWords: async function() {
        const res = await fetch("words.json")
        const data = await res.json()
        this.hangmanWords = data.words
    },

    getRandomWord: function(words) {
        const word = Math.floor(Math.random() * words.length)
        this.hangmanWordSelected = words[word].toUpperCase().split('')
    },

    start: async function() {
        await this.getWords()
        this.build()
        const gameConfig = document.getElementById('game-config')
        const sectionGame = document.getElementById('game')
        gameConfig.style.display = "none"
        sectionGame.style.display = "block"
    },

    build: function() {
        this.getRandomWord(this.hangmanWords[hangman.hangmanTheme]);
        for (let i = 0; i < this.hangmanWordSelected.length; i++) {
            const span = document.createElement("span")
            span.setAttribute("class", "span_letter")
            span.setAttribute("id", `letter-${i}`)
            span.innerHTML = "_"
            this.word.appendChild(span)
        }
    },

    verifyLetter: function(inputLetter) {
        let i = 0
        if (this.hangmanWordSelected.indexOf(inputLetter) > -1) {
            this.hangmanWordSelected.forEach(letter => {
                if (inputLetter == letter) {   
                    document.getElementById(`letter-${i}`).innerText = inputLetter
                } 
                i ++
            })
        } else {
            this.countErrors ++
            document.getElementById("fails-counter").innerText = this.countErrors
            document.getElementById("fails-letters").innerText += inputLetter
        }
    },

    verifyWord: function() {
        this.correctsLetters = []
        document.querySelectorAll('.span_letter').forEach(letter => {
            this.correctsLetters.push(letter.innerText)
        })

        if (JSON.stringify(this.correctsLetters) === JSON.stringify(this.hangmanWordSelected)) {
            document.getElementById("game-msg").innerHTML = "<h3>Acertou!</h3>"
        }
    },

    refleshWord: function() {
        this.hangmanWordSelected = []
        this.correctsLetters = []
        this.countErrors = 0

        document.getElementById("fails-counter").innerText = this.countErrors
        document.getElementById("fails-letters").innerText = ""
        document.getElementById("game-msg").innerHTML = ""
        document.querySelectorAll('.span_letter').forEach(e => {
            e.remove()
        })
    }
}

hangmanGameConfig = {
    gameConfig: function() {
        const gameConfig = document.getElementById('game-config')
        const sectionGame = document.getElementById('game')
        gameConfig.style.display = "block"
        sectionGame.style.display = "none"
    },

    hangmanStart: async function() {
        await hangman.start()
    }
}

hangmanLoadGame = {
    listenners: function() {
        const inputAnimals = document.querySelector('input[name="animal-input"]')
        const btnLetterVerify = document.getElementById('btn-letter-verify')
        const btnWordReflesh = document.getElementById('btn-word-reflesh')
        const btnGameConfig = document.getElementById('btn-game-config')

        btnLetterVerify.addEventListener('click', () => {
            if (inputAnimals.value != "") {
                hangman.verifyLetter(inputAnimals.value.toUpperCase())
                hangman.verifyWord()
                inputAnimals.value = ""
            }
        })

        btnWordReflesh.addEventListener('click', () => {
            hangman.refleshWord()
            hangman.build()
        })

        btnGameConfig.addEventListener('click', () => {
            hangman.hangmanTheme = ''
            hangman.refleshWord()
            hangmanGameConfig.gameConfig()
        })

        document.getElementById('themes').addEventListener('click', event => {
            hangman.hangmanTheme = event.target.value
            hangmanGameConfig.hangmanStart()
        })
    }
}

hangmanLoadGame.listenners()
hangmanGameConfig.gameConfig()