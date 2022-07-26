import React, { useRef } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import he from "he";
import { nanoid } from "nanoid";
//import StartingScreen from "./components/Starting";

//Trivia api: https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple

function App() {
  const [questionsApi, setApiQuestions] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [isEnded, setIsEnded] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);

  var correct_answer_array = useRef([]);

  function handleClickOnAnswer(questionId, buttonId, answer) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionElement.props.id === questionId
          ? { questionElement: { ...question.questionElement, props: { ...question.questionElement.props, currentSelected: buttonId } }, heldAnswer: answer }
          : question
      )
    );
  }

  //Fetch question from trivia api
  React.useEffect(() => {
    function fetchFunc() {
      fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          if (questionsApi.length === 0) {
            setApiQuestions(data.results);
          }
        });
    }

    fetchFunc();
    // eslint-disable-next-line
  }, []);

  //start once api arrived
  React.useEffect(() => {
    if (questionsApi.length !== 0) {
      prepareQuestions();
    }

    function prepareQuestions() {
      //Create answers from api
      function createAnswersArray(correct_answer, other_answers) {
        //create correct array
        correct_answer_array.current = [...correct_answer_array.current, correct_answer];
        //
        var arr = [correct_answer, ...other_answers];
        arr = arr.sort(() => Math.random() - 0.5);
        return arr;
      }

      //set questions from api
      setQuestions(
        questionsApi.map((q) => {
          var id = nanoid();

          return {
            questionElement: (
              <QuestionCard
                key={id}
                id={id}
                question={he.decode(q.question)}
                answers={createAnswersArray(he.decode(q.correct_answer), q.incorrect_answers)}
                handleClick={handleClickOnAnswer}
                currentSelected=""
              />
            ),
            heldAnswer: "",
          };
        }),
        setIsStarted(true)
      );
    }
  }, [questionsApi]);

  function submitAnswers() {
    var answer_count = questions.length;
    var correct_answer_count = 0;
    var i = 0;
    //check if every question checked + check answers
    //if not return
    questions.forEach((element) => {
      var answer = element.heldAnswer;
      if (answer === "") {
        return;
      }
      if (element.heldAnswer === correct_answer_array.current[questions.indexOf(element)]) {
        correct_answer_count++;
      }
      i++;
    });
    if (i !== answer_count) {
      return;
    }

    setIsEnded({ isEnded: true, correctAnswerCount: correct_answer_count, answerCount: answer_count });
  }

  return (
    <div className="quiz">
      <div className="question-container">
        <h1 className="quiz-header">Quizzle</h1>
        {questions.map((question) => question.questionElement)}
        {isEnded.isEnded && (
          <h3 className="end-text">
            You scored <span style={{ color: "#94D7A2" }}>{isEnded.correctAnswerCount}</span>/{isEnded.answerCount} correct answers.
          </h3>
        )}
        {isStarted && (
          <button className="question-submit" onClick={submitAnswers}>
            Check Answers!
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
