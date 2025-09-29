import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const url = process.env.REACT_APP_SOCKET_URL;
    const s = io(url);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);
  return socket;
}
