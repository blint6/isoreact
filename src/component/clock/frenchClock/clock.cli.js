export default {

    name: 'daFrenchClock',

    render: function (React) {
        return <div>
            <input type="text" />
            <span>{this.state.dateString}</span>
        </div>;
    },
};
