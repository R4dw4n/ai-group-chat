import React from "react";

const messageTail = {
  0: "-right-1 border-b-dark-gray",
  1: "-left-1 border-b-gray",
};
const messageStyle = {
  0: "bg-dark-gray self-end",
  1: "bg-gray",
}
const timeStyle = {
  0: "text-gray",
  1: "text-dark-gray/75"
}
function Message({ message }) {
  return (
    <div className={`w-32 relative ${messageStyle[message.from]} text-white py-2 px-3 rounded-3xl`}>
      <div
        className={`absolute ${
          messageTail[message.from]
        } bottom-0.5 w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-b-[13px]`}
      ></div>
      <h5 className="text-white max-w-full break-words">{message?.content}</h5>
      <h5 className={`${timeStyle[message.from]}`}>{message?.time}</h5>
    </div>
  );
}

export default Message;
