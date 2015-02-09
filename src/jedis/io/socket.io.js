class JedisSocketIo {}

export default function (io) {
    return function (app) {
        /*
                return Object.create(JedisSocketIo, {
                    io, app
                });
        */
        return io;
    };
}
