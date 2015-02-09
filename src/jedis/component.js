class JedisComponent {
    constructor(attrs) {
        for (let a in attrs) {
            this[a] = attrs[a];
        }
    }
}

export default JedisComponent;
