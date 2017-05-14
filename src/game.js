import React from 'react';
import Grid from './components/grid';
import { settings } from './settings';

// Application main class
class Game extends React.Component {
	constructor(props) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);

		this.state = {
			isAnimating: false,
			grid: [],
			score: 0
		}
	}

	// generate a tile
	makeTile() {
		return {
			value: Math.random() <= settings.fourChance ? 4 : 2,
		}
	}

	// traverse cells and build array with empty ones' position
	collectEmptyCells(grid) {
		let emptyCells = [];

		grid.forEach((column, x) => column.forEach((tile, y) => {
			emptyCells.push({x, y});
		}))

		return emptyCells;
	}

	makeEmptyGrid(size) {
		let grid = [];

		for (var x = 0; x < size; x++) {
			grid[x] = [];
			
			for (var y = 0; y < size; y++) {
				grid[x][y] = null;
			}
		}

		return grid;
	}

	// build empty grid
	// add initial tiles
	// store empty cells 
	buildGrid() {
		let grid 		= this.makeEmptyGrid(settings.size);
		let emptyCells 	= this.collectEmptyCells(grid);
		let ix			= null;
		let cell 		= null; 

		for (var i = 0; i < settings.startingTilesCount; i++) {

			ix 	 = Math.floor(Math.random() * emptyCells.length);
			cell = emptyCells.splice(ix, 1)[0];

			grid[cell.x][cell.y] = this.makeTile();
		}

		this.setState({
			grid
		});
	}

	compressArray(arr) {
		// remove all empty cells
		arr = arr.filter(t => t !== null);

		for (var i = 1; i < arr.length; i++) {
			if (arr[i].value === arr[i-1].value && !arr[i-1].merged) {
				arr[i-1].merging = true;
				arr[i-1].value *= 2;
				arr[i].merged = true;
			}
		}

		// fill the compressed array with nulls till original size
		for (var i = 0; i < (settings.size - arr.length); i++) {
			arr.push(null);
		}
	}

	// moving tiles 
	moveTiles(direction, deviation) {
		const _this 	= this;
		const oldGrid 	= this.state.grid;
		var grid 		= this.makeEmptyGrid(settings.size);
		var futureGrid 	= [];

		// right or left
		if (direction === 'x') {
			for (var rowIx = 0; rowIx < settings.size; rowIx++) {
				var row = [];

				for (var colIx = 0; colIx < settings.size; colIx++) {
					row.push(oldGrid[colIx][rowIx]);
				}

				// if the direction is "right",
				// start from the rightmost cell 
				if (deviation === 1) {
					row.reverse();	
				}

				this.compressArray(row);

				// if the direction is "right",
				// reverse back the resulted array
				if (deviation === 1) {
					row.reverse();
				}

				for (var colIx = settings.size - 1; colIx > -1; colIx--) {
					grid[colIx][rowIx] = row.shift();
				}
			}

		// top or bottom		
		} else {
			for (var colIx = 0; colIx < settings.size; colIx++) {

				// make a copy of the column
				var col = oldGrid[colIx].slice();

				// if the direction is "bottom",
				// start from the bottommost cell 
				if (deviation === 1) {
					col.reverse();	
				}

				console.log('-------------------');
				console.log(col, 'before');

				this.compressArray(col);

				console.log(col, 'after');

				// if the direction is "bottom",
				// reverse back the resulted array
				if (deviation === 1) {
					col.reverse();
				}

				grid[colIx] = col;
			}
		}

		// apply new state
		this.setState({
			isAnimating: true,
			grid: grid
		});

		futureGrid = grid.map(col => col.map(cell => {
			if (cell === null || cell.merged) {
				return null;
			}

			return cell.merging = false;
		}));



		setTimeout(function(){
			// add new cells

			_this.setState({
				isAnimating: false,
				grid: futureGrid
			})
		}, 300)
	}



	handleKeyDown(e) {
		if (this.state.isAnimating) {
			return;
		}

		switch(e.keyCode) {
			// left
			case 37:
				this.moveTiles('x', -1);
				break;

			// top
			case 38:
				this.moveTiles('y', -1);
				break;

			// right
			case 39:
				this.moveTiles('x', 1);
				break;

			// down
			case 40:
				this.moveTiles('y', 1);
				break;

			default:
				break;

		}
	}


	// lifecycle hooks
	componentWillMount() {
		this.buildGrid();
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown)
	}

	render () {
		return <div className="game">
			<div className="game-head">

			</div>

			<div className="game-body">
				<Grid data={this.state.grid} />
				
				<div className="game-overlay">

				</div>
			</div>
		</div>;
	}
}

export default Game;