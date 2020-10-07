function makeQuizArray() {
    return [
        {
            id: 1,
            "quizname":"Conversational Quiz",
            "quizdescription":"A quiz to test your conversational comprehension",
            "level":"Intermediate",
            "locked":true
          },
          {
            id: 2,
            "quizname":"Video Quiz",
            "quizdescription":"A Video quiz to test your conversational comprehension",
            "level":"Beginner",
            "locked":false
          },
    ]
}

module.exports =  makeQuizArray