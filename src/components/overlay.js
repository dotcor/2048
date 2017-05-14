import React from 'react';

class Overlay extends React.Component {
	handleRestartClick(e){
		e.preventDefault();

		this.props.onRequestNewGame();
	}

	render() {
		let className = 'game-overlay';

		if (this.props.visible) {
			className += ' game-overlay-visible';			
		}

		return <div className={className}>
			<div className="game-overlay-message">GAME OVER</div>
			<div className="game-overlay-actions">
				<a className="game-overlay-btn" onClick={this.handleRestartClick.bind(this)}>RESTART</a>
			</div>
		</div>
	}
}

export default Overlay;