import { io } from "socket.io-client";
import { DependencyList, useEffect } from "react";
import constants from "./constants";

export const socket = io(constants.serverURI);

export const useSocketEvent = <T>(
  name: string,
  cb: (...args: T[]) => void,
  deps: DependencyList = []
) => {
  useEffect(() => {
    socket.on(name, cb);

    return () => {
      socket.off(name, cb);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
};
