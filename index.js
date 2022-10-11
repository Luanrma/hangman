hangman = {
    hangmanWords: [],
    hangmanWordSelected: [],
    correctsLetters: [],
    countErrors: 0,
    word: document.getElementById('word'),

    getWords: async function() {
        const res = await fetch("words.json")
        const dados = await res.json()
        this.hangmanWords = dados.words
    },

    getRandomAnimal: function(animals) {
        const animal = Math.floor(Math.random() * animals.length)
        this.hangmanWordSelected = animals[animal].toUpperCase().split('')
    },

    start: async function() {
        await this.getWords()
        this.listenners()
        this.build()
    },

    build: function() {
        this.getRandomAnimal(this.hangmanWords);
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
        this.build()
    },

    listenners: function() {
        const inputAnimals = document.querySelector('input[name="animal-input"]')
        const btnLetterVerify = document.getElementById('btn-letter-verify')
        const btnWordReflesh = document.getElementById('btn-word-reflesh')
        
        btnLetterVerify.addEventListener('click', () => {
            if (inputAnimals.value != "") {
                this.verifyLetter(inputAnimals.value.toUpperCase())
                this.verifyWord()
                inputAnimals.value = ""
            }
        })

        btnWordReflesh.addEventListener('click', () => {
            this.refleshWord()
        })
    }
}

hangman.start()