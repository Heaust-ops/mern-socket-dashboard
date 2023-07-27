import { Socket } from 'socket.io';
import Review from '../models/review';


export const reviewNotifier = (socket: Socket) => {
    socket.on('client:review-update',async () => {
        const reviews = await Review.find();
        socket.emit('server:review-update', reviews);
    });
};
