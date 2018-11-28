$(document).ready(function() {
    var questionsList = [
      {
        text: "What word must always come at the beginning of a function definition?",
        choices: [
          "myFunct",
          "cout",
          "def",
          "function"
        ],
        correctChoiceIndex: 2
      },
      {
        text: "What is the correct output for print(c[::2]) when c = [1, 2, 10, 15, 3, 4]",
        choices: [
          "[1, 2]",
          "[1, 10, 3]",
          "[1, 10]",
          "[10]"
        ],
        correctChoiceIndex: 1
      },
      {
        text: "Which statement about functions is true?",
        choices: [
            "They can create objects", "They allow the program to run faster", " They perform specific tasks", "All of the above"],
        correctChoiceIndex: 3,
      },
      {
        text: "What is a recursive function?",
        choices: ["A function that calls every function in the program", "A function that calls itself", "Recursive functions do not exist in Python", "A function that automatically converts its arguments into strings."],
        correctChoiceIndex: 1,
      },
      {
        text: "What is the proper syntax for importing a Python module?",
        choices: ["include moduleName", "module import moduleName", "module moduleName", "import moduleName"],
        correctChoiceIndex: 3,
      },
      {
        text: "When a sub-class declares a method that has the same argument types as a method declared by one of its superclasses, it is a:",
        choices: ["method overriding", "method encapsulation", "method containment", "method inheritance"],
        correctChoiceIndex: 0,
      },
      {
        text: "The property object that is returned from the property() built-int function contains which methods?",
        choices: ["getter(), delete()", "getter(), setter(), delete()", "setter(), delete()", "getter(), setter()"],
        correctChoiceIndex: 1,
      },
      {
        text: "What kind of language Runtime does Python use?",
        choices: ["Compiled C++", "JVM Runtime", "Interpreted", "None of the above"],
        correctChoiceIndex: 2,
      },
      {
        text: "What are the method(s) that iterator object must implement?", 
        choices: ["__iter__()", "__iter__() and __next__()", "__iter__() and __super__()", "__iter__(), __super__() and __next__()"],
        correctChoiceIndex: 1,
      },
      {
        text: "If a function contains at least one yield statement, it becomes ______ ",
        choices: ["an iterable ", "a generator function", "an anonymous function", "None of the above"],
        correctChoiceIndex: 1,
      },
    ];
  
  
    var quiz = {
      score: 0,
      questions: [],
      currentQuestionIndex: 0,
  
      currentQuestion: function() {
        return this.questions[this.currentQuestionIndex]
      },
  
      answerFeedbackHeader: function(isCorrect) {
        return isCorrect ? "<h6 class='user-was-correct'>Correct!</h6>" :
          "<h1 class='user-was-incorrect'>Wrong!</>";
      },
  
      answerFeedbackText: function(isCorrect) {
        var praises = [
          "Wow. You got it right. I bet you feel really good about yourself now",
          "Correct. Which would be impressive, if it wasn't just luck"
        ];
  
        var encouragements = [
          "Sorry, you didn't get that right. Try to read more.",
          "Better luck next time. Sure, you can get it if you try to be mindful.",
        ];
  
        var choices = isCorrect ? praises : encouragements;
        return choices[Math.floor(Math.random() * choices.length)];
      },
  
      seeNextText: function() {
        return this.currentQuestionIndex <
        this.questions.length - 1 ? "Next" : "How did I do?";
      },
  
      questionCountText: function() {
        return (this.currentQuestionIndex + 1) + "/" +
          this.questions.length + ": ";
      },
  
      finalFeedbackText: function() {
        var level = ""
        if (this.score < 5) {
          level = "BEGINNER";
        } else if (this.score < 8) {
          level = "INTERMEDIATE";
        } else {
          level = "ADVANCED";
        }
        return "You got " + this.score + " out of " +
          this.questions.length + " questions right." + "\n" + "Level " + level;
      },
  
      scoreUserAnswer: function(answer) {
        var correctChoice = this.currentQuestion().choices[this.currentQuestion().correctChoiceIndex];
        if (answer === correctChoice) {
          // this increments a number
          // Check README for a quick exercise
          this.score ++;
        }
        return answer === correctChoice;
      }
    }
  
    // create a new instance of quiz via Object.create
    function newQuiz() {
      var quizO = Object.create(quiz);
      quizO.questions = questionsList;
      return quizO;
    }
  
    function makeCurrentQuestionElem(quiz) {
      var questionElem = $("#js-question-template" ).children().clone();
      var question = quiz.currentQuestion();
  
      questionElem.find(".js-question-count").text(quiz.questionCountText());
      questionElem.find('.js-question-text').text(question.text);
  
      for (var i = 0; i < question.choices.length; i++) {
        var choice = question.choices[i];
        var choiceElem = $( "#js-choice-template" ).children().clone();
        choiceElem.find("input").attr("value", choice);
        var choiceId = "js-question-" + quiz.currentQuestionIndex + "-choice-" + i;
        choiceElem.find("input").attr("id", choiceId)
        choiceElem.find("label").text(choice);
        choiceElem.find("label").attr("for", choiceId);
        questionElem.find(".js-choices").append(choiceElem);
      };
  
      return questionElem;
    }
  
    function makeAnswerFeedbackElem(isCorrect, correctAnswer, quiz) {
      var feedbackElem = $("#js-answer-feedback-template").children().clone();
      feedbackElem.find(".js-feedback-header").html(quiz.answerFeedbackHeader(isCorrect));
      feedbackElem.find(".js-feedback-text").text(quiz.answerFeedbackText(isCorrect));
      feedbackElem.find(".js-see-next").text(quiz.seeNextText());
      return feedbackElem;
    }
  
    function makeFinalFeedbackElem(quiz) {
      var finalFeedbackElem = $("#js-final-feedback-template").clone();
      finalFeedbackElem.find(".js-results-text").text(quiz.finalFeedbackText());
      return finalFeedbackElem;
    }
  
    function handleSeeNext(quiz, currentQuestionElem) {
      $("article.quiz-details").on("click", ".js-see-next", function(event) {
  
        if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
          $("article.quiz-details").off("click", ".js-see-next");
          quiz.currentQuestionIndex ++;
          $("article.quiz-details").html(makeCurrentQuestionElem(quiz));
        }
        else {
          $("article.quiz-details").html(makeFinalFeedbackElem(quiz))
        }
      });
    }
  
    function handleAnswers(quiz) {
      $("article.quiz-details").on("submit", "form[name='current-question']", function(event) {
        event.preventDefault();
        var answer = $("input[name='user-answer']:checked").val();
        quiz.scoreUserAnswer(answer);
        var question = quiz.currentQuestion();
        var correctAnswer = question.choices[question.correctChoiceIndex]
        var isCorrect = answer === correctAnswer;
        handleSeeNext(quiz);
        $("article.quiz-details").html(makeAnswerFeedbackElem(isCorrect, correctAnswer, quiz));
      });
    }
  
    // We can only use handleAnswers and handleRestarts when the quiz object has been created.
    // The submit event listener will create the quiz object then call other listeners.
    // On browser refresh, that object isn't saved and that's fine. If you want to remember states and objects, use localStorage
    // But we don't need that now.
    function handleStartQuiz() {
      $("article.quiz-details").html($("#js-start-template").clone());
      $("form[name='quiz-start']").submit(function(event) {
        var quiz = newQuiz();
        event.preventDefault();
        $("article.quiz-details").html(makeCurrentQuestionElem(quiz));
        handleAnswers(quiz);
        handleRestarts();
      });
    }
  
    // The .off() method removes event handlers that were attached with .on()
    // In this case, the listeners are handleAnswers(), handleSeeNext() and even handleRestarts()
    // handleStartQuiz will be called again to create the new quiz object and call functions with listeners
    // See how we called this once on load.
    function handleRestarts() {
      $("article.quiz-details").on("click", ".js-restart-quiz", function(event){
        event.preventDefault();
        $("article.quiz-details").off();
        handleStartQuiz();
      });
    }
  
    handleStartQuiz();
  });
  
