import React from "react";

const Dialog = ({ displayText, buttonText, buttonAction }) => {
  return (
    <div className="dialog">
      <p className="dialog-text">{displayText}</p>
      <button
        className="button"
        onClick={() => {
          buttonAction();
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dialog;
