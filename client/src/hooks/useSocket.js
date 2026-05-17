import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useBusStore } from "../store/busStore";

let socket = null;

export const useSocket = () => {
  const setBuses = useBusStore((s) => s.setBuses);
  const setConnected = useBusStore((s) => s.setConnected);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5001", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      setConnected(true);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("bus:update", (buses) => setBuses(buses));

    return () => {
      socket?.disconnect();
      initialized.current = false;
    };
  }, []);

  return socket;
};

export const getSocket = () => socket;
