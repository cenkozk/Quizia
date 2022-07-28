import React, { useRef } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import useWindowSize from "react-use/lib/useWindowSize";
import he from "he";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
//import StartingScreen from "./components/Starting";

//Trivia api: https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple

function App() {
  const { width, height } = useWindowSize();
  const [questionsApi, setApiQuestions] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [isEnded, setIsEnded] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);
  const [playAgain, setPlayAgain] = React.useState(false);
  const allAnsweredTrue = useRef(false);

  const correct_answer_array = useRef([]);

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
          setApiQuestions(data.results);
        });
    }

    fetchFunc();
    // eslint-disable-next-line
  }, [playAgain]);

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
                correctAnswer={he.decode(q.correct_answer)}
                isEnded={false}
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
      if (element.heldAnswer === correct_answer_array.current[questions.indexOf(element)]) {
        correct_answer_count++;
      }
      i++;
    });
    if (i !== answer_count) {
      return;
    }

    console.log(correct_answer_array.current);

    if (correct_answer_count === answer_count) {
      allAnsweredTrue.current = true;
    }

    //set questions isEnded true
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => ({
        questionElement: { ...question.questionElement, props: { ...question.questionElement.props, isEnded: true, isEmpty: question.heldAnswer === "" ? true : false } },
        heldAnswer: question.heldAnswer,
      }))
    );
    setIsEnded({ isEnded: true, correctAnswerCount: correct_answer_count, answerCount: answer_count });
  }

  function playAgainFunction() {
    setPlayAgain((playAgain) => !playAgain);
    setIsStarted(false);
    setIsEnded(false);
    allAnsweredTrue.current = false;
    correct_answer_array.current = [];
  }

  return (
    <div className="quiz">
      <div className="question-container">
        <h1 className="quiz-header">Quizia</h1>

        {isStarted && questions.map((question) => question.questionElement)}
        {isStarted && isEnded.isEnded && (
          <h3 className="end-text">
            You scored <span style={{ color: "#94D7A2" }}>{isEnded.correctAnswerCount}</span>/{isEnded.answerCount} correct answers.
          </h3>
        )}

        {isStarted && !isEnded.isEnded && (
          <button className="question-submit" onClick={submitAnswers}>
            Check Answers!
          </button>
        )}

        {isStarted && isEnded.isEnded && (
          <button className="question-submit" onClick={playAgainFunction}>
            Play Again!
          </button>
        )}
        {allAnsweredTrue.current && <Confetti width={width} height={height} />}
      </div>
    </div>
  );
}

export default App;
