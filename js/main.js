$(document).ready(function() {
  var questionsList = [
    {
      text: "A user defined header file is included by following statement in general.",
      choices: [
        "#include “file.h”",
        "#include <file.h>",
        "#include <file>",
        "#include file.h"
      ],
      correctChoiceIndex: 0
    },
    {
      text: "How many number of arguments can a destructor of a class receives?",
      choices: [
        "0",
        "1",
        "2",
        "None of above"
      ],
      correctChoiceIndex: 0
    },
    {
      text: "Which operator is used to resolve the scope of the global variable?",
      choices: ["->", ".", "*", "::"],
      correctChoiceIndex: 3,
    },
    {
      text: "Choose the option not applicable for the constructor.",
      choices: ["Cannot be called explicitly.", "Cannot be overloaded.", "Cannot be overridden.", "None of the above."],
      correctChoiceIndex: 2,
    },
    {
      text: "A single line comment in C++ language source code can begin with _____",
      choices: [";", ":", "/*", "//"],
      correctChoiceIndex: 3,
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
        "Wow. You got it right.",
        "Correct.",
        "Impressive",
        "Damn!, that's right",
      ];

      var encouragements = [
        "Sorry, you didn't get that right",
        "Your answer is wrong. Better luck next time.",
      ];

      var choices = isCorrect ? praises : encouragements;
      return choices[Math.floor(Math.random() * choices.length)];
    },

    seeNextText: function() {
      return this.currentQuestionIndex <
      this.questions.length - 1 ? "Next" : "How did I do?";
    },

    questionCountText: function() {
      return (this.currentQuestionIndex + 1) + ": ";
    },

    finalFeedbackText: function() {
      return "You got " + this.score + " out of " +
        this.questions.length + " questions right.";
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
