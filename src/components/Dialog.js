import React from "react";

const Dialog = ({ displayIcon, displayText, buttonText, buttonAction }) => {
  return (
    <div className="dialog">
      {displayIcon && <img src={displayIcon} alt="display-icon" className="dialog-display-icon" />}
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
