import { message } from "antd";

export const messages = (type, content, duration) => {
  message.open({
    type: type,
    content: content,
    duration: duration,
  });
};
