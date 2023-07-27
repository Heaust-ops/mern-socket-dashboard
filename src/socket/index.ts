import { Socket } from 'socket.io';
import { systemMonitor } from './monitor';
import { reviewNotifier } from './review';
import { visitorNotifier } from './visitor';

export const socketTasks = [
    systemMonitor,
    reviewNotifier,
    visitorNotifier,
] as ((arg: Socket) => void)[];
