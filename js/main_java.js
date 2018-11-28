$(document).ready(function() {
    var questionsList = [
      {
        text: " What is the correct data type for this value: true?",
        choices: [
          "Double",
          "Int",
          "Char",
          "Boolean"
        ],
        correctChoiceIndex: 3
      },
      {
        text: "What loop will display the numbers in the array float[]nums={1.1, 2.2, 3.3} on seperate lines?",
        choices: [
          "for(i=1; i<=3; i++) System.out.println(nums[i])",
          "for(i=1; i<3; i++) System.out.println(nums[i])",
          "for(i=0; i<=3; i++) System.out.println(nums[i])",
          "for(i=0; i<3; i++) System.out.println(nums[i])"
        ],
        correctChoiceIndex: 3
      },
      {
        text: "What will the following code produce? class A {public static void main(String [] args) {B b = new A();}} class B extends A{}",
        choices: [
            "Runtime exception", "No output", "No error", "Compile error"],
        correctChoiceIndex: 3,
      },
      {
        text: "What is encapsulation?",
        choices: ["A way of defining methods of the same type", "Making fields of a class private and providing access to them via public methods", "An object's ability to take many different forms", "All of the above."],
        correctChoiceIndex: 1,
      },
      {
        text: "What expression will display the first element in the following array? int[]nums = {3, 4, 12, 5, 9}",
        choices: ["System.out.print(nums[3])", "System.out.print(nums[0])", "System.out.print(nums[1])", "System.out.print(nums)"],
        correctChoiceIndex: 1,
      },
      {
        text: "When a sub-class declares a method that has the same argument types as a method declared by one of its superclasses, it is a:",
        choices: ["method overriding", "method encapsulation", "method containment", "method inheritance"],
        correctChoiceIndex: 0,
      },
      {
        text: "Which implicit object is not available to a JSP?",
        choices: ["Exception", "Session", "config", "application"],
        correctChoiceIndex: 0,
      },
      {
        text: "Which option is a benefit of using the Value Object design pattern?",
        choices: ["It reduces network traffic", "It reduces coupling between the database and data access module", "It improves object operations efficiency", "none of the above"],
        correctChoiceIndex: 0,
      },
      {
        text: "Which method in the HttpServlet class services the HTTP POST request?",
        choices: ["DoPost(HttpServletRequest, HttpServletResponse)", "DoPost(ServletRequest, ServletResponse)", "HttpPost(ServletRequest, ServletResponse)", "ServicePost(HttpServletRequest,HttpServletResponse)"],
        correctChoiceIndex: 0,
      },
      {
        text: "The keyword which is used to access the method or member variables from the superclass is:",
        choices: ["super", "using", "is_a", "has_a"],
        correctChoiceIndex: 0,
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
  
