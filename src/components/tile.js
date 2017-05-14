import React from 'react';

// Tile 
class Tile extends React.Component {

	render() {
		const { tile, x, y } = this.props;

		let dx 		= tile.oldX !== null ? (tile.oldX - x)*100 : 0;
		let dy 		= tile.oldY !== null ? (tile.oldY - y)*100 : 0;
		let style 	= {
			left 		: x*100 + '%',
			top			: y*100 + '%',
			transform 	: 'translate('+dx+'%, '+dy+'%)'
		};

		let ddx 		= tile.merging ? (tile.mergingFrom.x - x)*100 : 0;
		let ddy 		= tile.merging ? (tile.mergingFrom.y - y)*100 : 0;
		let shadowStyle = {
			transform 	: 'translate('+ddx+'%, '+ddy+'%)'
		};
		let shadow 		= <div style={shadowStyle} className="game-tile-shadow">{ (tile.value / 2) }</div>
		let tileClass 	= "game-tile";

		if (tile.merging) {
			tileClass+= ' game-tile-merging';
			console.log('in');
		}

		return <div className={tileClass} style={style}>
			<div className="game-tile-inner">{ tile.value }</div>
			{ shadow }
		</div>
	}
}

export default Tile;