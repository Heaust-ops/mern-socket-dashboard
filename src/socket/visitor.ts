import { Socket } from 'socket.io';
import Visitor from '../models/visitors';
import Logging from '../library/Logging';

export const visitorNotifier = async (socket: Socket) => {
    const ipAddress = socket.handshake.address;
    const browser = socket.handshake.headers['user-agent'];
    const referrer = socket.handshake.headers['referrer'];

    const newVisitor = new Visitor({
        ipAddress,
        browser,
        referrer,
    });

    newVisitor.save((err) => {
        if (err) {
            Logging.error(`Error saving Visitor data: ${err}`);
        } else {
            Logging.log(`Visitor data saved: ${newVisitor}`);
        }
    });

    const visitors = await Visitor.find();
    socket.emit('server:visitor-update', visitors);
};
