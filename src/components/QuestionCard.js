import he from "he";
import React, { useRef } from "react";
import { nanoid } from "nanoid";

export default function QuestionCard(props) {
  var buttonIds = useRef([]);

  const [buttons, setButtons] = React.useState();

  React.useEffect(() => {
    buttonIds.current = props.answers.map((index) => nanoid());
    createAnswerButtons();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    createAnswerButtons();
    // eslint-disable-next-line
  }, [props.currentSelected]);

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
