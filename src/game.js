import React from 'react';
import shortid from 'shortid';
import Grid from './components/grid';
import Score from './components/score';
import Overlay from './components/overlay';
import { settings } from './settings';

// Application main class
class Game extends React.Component {
	constructor(props) {
		super(props);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.requestNewGame = this.requestNewGame.bind(this);

		this.state = {
			isAnimating 	: false,
			isOver 			: true,
			grid 			: [],
			score 			: 0,
		}
	}

	// generate a tile
	makeTile() {
		return {
			id 		: shortid.generate(),
			value 	: Math.random() <= settings.fourChance ? 4 : 2,
			merging	: false,
			merged	: false,
			oldX	: null,
			oldY	: null
		}
	}

	// traverse cells and build array with empty ones' position
	collectEmptyCells(grid) {
		let emptyCells = [];

		grid.forEach((column, x) => column.forEach((tile, y) => {
			if (tile === null) {
				emptyCells.push({x, y});
			}
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
			isAnimating : false,
			isOver: false,
			score: 0,
			grid
		});
	}

	compressArray(arr) {
		// remove all empty cells
		var input 	= arr.filter(t => t !== null);
		var missing = 0;
		var output  = [];
		var score 	= 0;

		// walking one cell ahead
		for (var i = 0; i < input.length; i++) {

			// skip cell if it is already merged
			if (input[i].merged) {
				continue;
			}

			// out next is out of bounds, push current cell
			if (input[i+1] === undefined) {
				output.push(input[i]);

				continue;
			}

			// next cell is equal to this one
			if (input[i+1].value === input[i].value) {

				input[i].value *= 2;
				input[i].merging = true;
				input[i].mergingFrom = {
					x: input[i+1].oldX,
					y: input[i+1].oldY
				}
				input[i+1].merged = true;

				score += input[i].value;
			}

			output.push(input[i]);	
		}

		missing = settings.size - output.length;

		// fill the compressed array with nulls till original size
		for (var i = 0; i < missing; i++) {
			output.push(null);
		}

		return {
			output,
			score
		};
	}

	canMakeAction(grid){

		for (var x = 0; x < settings.size; x++) {
			for (var y = 0; y < settings.size; y++) {
				if (grid[x][y] === null) {
					return true;
				}

				if (
					x - 1 >= 0 && grid[x-1][y] !== null && grid[x-1][y].value === grid[x][y].value
					|| x + 1 < settings.size && grid[x+1][y] !== null && grid[x+1][y].value === grid[x][y].value
					|| y - 1 >= 0 && grid[x][y-1] !== null && grid[x][y-1].value === grid[x][y].value
					|| y + 1 < settings.size && grid[x][y+1] !== null && grid[x][y+1].value === grid[x][y].value
				) {
					return true;
				}
			}
		}

		return false;
	}

	// moving tiles 
	moveTiles(direction, deviation) {
		const _this 	= this;
		const oldGrid 	= this.state.grid;
		var nextScore = this.state.score;
		var grid 		= this.makeEmptyGrid(settings.size);
		var nextGrid 	= [];
		var emptyCells 	= [];
		var newCell 	= null;

		// right or left
		if (direction === 'x') {
			for (var rowIx = 0; rowIx < settings.size; rowIx++) {
				var result 	= {};
				var row 	= [];

				for (var colIx = 0; colIx < settings.size; colIx++) {
					let tile = oldGrid[colIx][rowIx];
					if (tile !== null) {
						tile.oldX = colIx;
						tile.oldY = rowIx;
					}
					row.push(tile);
				}

				// if the direction is "right",
				// start from the rightmost cell 
				if (deviation === 1) {
					row.reverse();	
				}

				result 		= this.compressArray(row);
				row 		= result.output;
				nextScore 	+= result.score;

				// if the direction is "right",
				// reverse back the resulted array
				if (deviation === 1) {
					row.reverse();
				}

				for (var colIx = 0; colIx < settings.size; colIx++) {
					grid[colIx][rowIx] = row.shift();
				}
			}

		// top or bottom		
		} else {
			for (var colIx = 0; colIx < settings.size; colIx++) {
				var result 	= {};
				var col 	= [];

				for (var rowIx = 0; rowIx < settings.size; rowIx++) {
					// save tile origin position
					let tile = oldGrid[colIx][rowIx];
					if (tile !== null) {
						tile.oldX = colIx;
						tile.oldY = rowIx;
					}
					col.push(tile);
				}

				// if the direction is "bottom",
				// start from the bottommost cell 
				if (deviation === 1) {
					col.reverse();	
				}

				result 		= this.compressArray(col);
				col 		= result.output;
				nextScore 	+= result.score;

				// if the direction is "bottom",
				// reverse back the resulted array
				if (deviation === 1) {
					col.reverse();
				}

				grid[colIx] = col;
			}
		}

		// apply new state with tiles in position before animation starts
		this.setState({
			score 		: nextScore,
			isAnimating : true,
			grid 		: grid
		});

		// prepare state when animation is finished
		nextGrid = grid.map(col => col.map(tile => {
			if (tile === null || tile.merged) {
				return null;
			}

			return {
				id 		: tile.id,
				value 	: tile.value,
				merging : false,
				merged 	: false,
				oldX 	: null,
				oldY 	: null,
			};
		}));

		// apply states after animation
		// animation starts here
		setTimeout(function(){
			_this.setState({
				isAnimating	: true,
				isOver 		: !_this.canMakeAction(nextGrid),
				grid 		: nextGrid,
			})
		}, 30)

		// add new tile on empty cell
		emptyCells = this.collectEmptyCells(nextGrid);

		// check if there is empy space and add cell
		if (emptyCells.length > 0) {
			newCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
			nextGrid[newCell.x][newCell.y] = this.makeTile();
		}

		setTimeout(function(){
			_this.setState({
				isAnimating : false,
				grid 		: nextGrid
			})
		}, 300)
	}

	handleKeyDown(e) {
		if (this.state.isAnimating || this.state.isOver) {
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

	requestNewGame(){
		this.buildGrid();
	}


	// lifecycle hooks
	componentWillMount() {
		this.buildGrid();
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	render () {
		return <div className="game">
			<div className="game-head">
				<Score value={this.state.score} />
			</div>

			<div className="game-body">
				<Grid data={this.state.grid} />
				
				<Overlay visible={this.state.isOver} onRequestNewGame={this.requestNewGame} />
			</div>
		</div>;
	}
}

export default Game;