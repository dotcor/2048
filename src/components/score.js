import React from 'react';

class Score extends React.Component {
	render() {
		const { value } = this.props;

		return <div className="game-score">
			Your score is : <span>{value}</span>
		</div>
	}
}

export default Score;