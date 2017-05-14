import React from 'react';
import Cell from './cell';
import Tile from './tile';

// contains either Tile or null
class Grid extends React.Component {

	renderGrid(grid) {
		return grid.map((column, x) => column.map((tile, y) => <Cell key={x + '_' + y} x={x} y={y}/> ));
	}

	renderTiles(grid) {
		return grid.map((column, x) => column.map((tile, y) => {
			return tile === null ? false : <Tile key={tile.id} x={x} y={y} tile={tile}/>
		}));
	}

	render() {
		const { data } = this.props;

		return <div className="game-grid">
			{ this.renderGrid(data) }
			{ this.renderTiles(data) }
		</div>
	}
}

export default Grid;