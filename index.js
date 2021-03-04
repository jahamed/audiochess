window.onload = () => {
  const content = document.getElementById('content')
  const move = document.getElementById('move')

  // Internal board state
  const chess = new Chess()

  // Chess NLP Grammar
  const parserOptions = {
    aliases: {
      knight: ['knight', 'night', 'horse', 'horsie', 'jumper'],
      bishop: ['bishop'],
      rook: [
        'rook', 'tower', 'brooks', 'brooke', 'brookdale', 'brook', 'work', 'route', 'rough', 'trucks', 'truck', 'ruck', 'rupp', 'rupt', 'rocket', 'rockstar', 'rock', 'rugs', 'rug', 'look', 'ruff',
      ],
      king: ['king', 'teen'],
      queen: ['queen'],
      pawn: ['pawn', 'pain'],
      a: ['alpha', 'office', 'off of', 'also', 'how'],
      b: ['bravo', 'beta', 'beat', 'bee', 'be'],
      c: ['charlie', 'sea', 'see', 'si'],
      d: ['delta', 'the', 'dee', 'de'],
      e: ['echo', 'eat'],
      f: ['foxtrot', 'at', 'of'],
      g: ['golf', 'gulf'],
      h: ['hotel', 'stage', 'age', 'Age', 'its', 'each'],
      1: ['one', 'won', 'juan'],
      2: ['too', 'to', 'tu', 'tto'],
      3: ['free'],
      4: ['force', 'for', 'far', 'park', 'store', 'fork', 'ford', 'fort', 'fore', 'foor'],
      5: ['v', 'psi'],
      6: ['sex', 'sics'],
      7: ['seven'],
      8: ['eight', 'eighth', '8th', 'ate', 'ade']
    },
  }
  const parser = new ChessNLP(parserOptions)


  // sample moves
  chess.move('Nf3')
  chess.move('e5')
  chess.move('e4')
  chess.move('e6')
  chess.move('bf4')
  // console.log(chess.ascii())

  console.log(chess.ascii())
  console.log(chess.history())

  // Setup speech recognition
  const recognition = new webkitSpeechRecognition()
  // const myServiceURI = recognition.serviceURI;
  // console.log(`Speech recogntion from ${myServiceURI}`)
  recognition.lang = 'en-US'
  recognition.maxAlternatives = 50
  recognition.continuous = false
  recognition.interimResults = false

  // recognition.onsoundstart = function () {
  //   console.log('Speech has been detected');
  // }

  document.body.onclick = function () {
    if (document.body.style.backgroundColor === 'yellow') {
      console.log('stopping voice recognition')
      document.body.style.backgroundColor = 'white'
      recognition.stop()
    } else {
      console.log('starting voice recognition')
      document.body.style.backgroundColor = 'yellow'
      recognition.start();
    }
  }

  const doWork = function (nlpMove) {
    // console.log('time to do some work')
    let sanMove = parser.textToSan(nlpMove)
    console.log("SANMOVE: ", sanMove);
    chess.move(sanMove)
    console.log(chess.ascii())
  }

  recognition.addEventListener('end', () => {
    recognition.start()
    console.log('had to restart recognition...')
  });


  recognition.onresult = function (event) {
    let results = event.results[0]
    let resultsP = ''
    let pieceRegex = /^(pawn|queen|king|knight|bishop)/gi
    let coordRegex = /[A-H|a-h] ?[1-8]$/g
    let coord = null
    let piece = null

    for (let i = 0; i < results.length; i++) { //SpeechRecognitionAlternatives
      let transcript = results[i].transcript
      // do regex
      // piece = piece || transcript.match(pieceRegex)
      // coord = coord || transcript.match(coordRegex)
      // resultsP += `${transcript} - ${results[i].confidence} \n`
      try {
        doWork(results[i].transcript)
        // return;
      } catch (err) {
        // console.log(err)
        continue
      }
    }

    for (result of results) {
      console.log(result.transcript)
    }
    // content.innerText = resultsP
    // move.innerText = piece + ' ' + coord[0]
    // doWork(results[i].transcript)
    // console.log(results)
  }
}