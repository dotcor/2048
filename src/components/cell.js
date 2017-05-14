import React from 'react';

// contains either Tile or null
class Cell extends React.Component {
	render() {
		const { tile, x, y } = this.props;

		let style = {
			left: x*100 + '%',
			top: y*100 + '%',
		};

		return <div className="game-cell" style={style}>
			<div className="game-cell-inner"></div>
		</div>
	}
}

export default Cell;