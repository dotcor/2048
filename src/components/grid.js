import React from 'react';
import Cell from './cell';

// contains either Tile or null
class Grid extends React.Component {

	renderGrid(grid) {
		return grid.map((column, x) => column.map((tile, y) => <Cell key={x + '_' + y} x={x} y={y} tile={tile}/> ));
	}

	render() {
		const { data } = this.props;

		return <div className="game-grid">
			{ this.renderGrid(data) }
		</div>
	}
}

export default Grid;