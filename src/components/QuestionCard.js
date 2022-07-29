import he from "he";
import React, { useRef } from "react";
import { nanoid } from "nanoid";

export default function QuestionCard(props) {
  var buttonIds = useRef([]);

  const [buttons, setButtons] = React.useState();

  //create buttons and id's once game started
  React.useEffect(() => {
    buttonIds.current = props.answers.map((index) => nanoid());
    createAnswerButtons();
    // eslint-disable-next-line
  }, []);

  //select button
  React.useEffect(() => {
    createAnswerButtons();
    // eslint-disable-next-line
  }, [props.currentSelected]);

  //start if game ended
  React.useEffect(() => {
    if (props.isEnded) {
      createAnswerButtonsGameEnded();
    }
    // eslint-disable-next-line
  }, [props.isEnded]);

  function createAnswerButtonsGameEnded() {
    var answersArray = props.answers;

    answersArray = answersArray.map((answer) => {
      var id = buttonIds.current[props.answers.indexOf(answer)];
      className = !props.isEmpty ? (he.decode(answer) === props.correctAnswer ? "empty-card-answers" : "u-card-answers") : "u-card-answers";
      var className = props.currentSelected === id ? (he.decode(answer) === props.correctAnswer ? "correct-card-answers" : "incorrect-card-answers") : className;
      //if answer empty by user select correct one
      className = props.isEmpty ? (he.decode(answer) === props.correctAnswer ? "empty-card-answers" : "u-card-answers") : className;
      return (
        <button
          key={id}
          disabled={true}
          className={className}
          onClick={() => {
            props.handleClick(props.id, id, he.decode(answer));
          }}
        >
          {he.decode(answer)}
        </button>
      );
    });
    setButtons(answersArray);
  }

  function createAnswerButtons() {
    var answersArray = props.answers;

    answersArray = answersArray.map((answer) => {
      var id = buttonIds.current[props.answers.indexOf(answer)];
      var className = props.currentSelected === id ? "selected-card-answers" : "card-answers";

      return (
        <button
          key={id}
          className={className}
          onClick={() => {
            props.handleClick(props.id, id, he.decode(answer));
          }}
        >
          {he.decode(answer)}
        </button>
      );
    });
    setButtons(answersArray);
  }

  return (
    <div className="card">
      <h1 className="card-question">{props.question}</h1>
      <div className="card-button-container">{buttons}</div>
      <hr />
    </div>
  );
}
