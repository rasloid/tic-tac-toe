class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.setStartState();
    }

    nextTurn(data) {
        this.playFieldState[data.index] = data.playerNum;
        let status = this.checkPlayField();
        switch (status) {
            case 'player1':
                this.winner = 'player1';
                break;
            case 'player2':
                this.winner = 'player2';
                break;
            case 'draw':
                this.draw = true;
                break;
            default:
                this.turn = this.turn == 'player1' ? 'player2' : 'player1';
        }
    }

    setStartState() {
        this.playFieldState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.turn = 'player1';
        this.winner = null;
        this.draw = false;
    }


    checkPlayField() {
        const f = this.playFieldState;
        let cellsFilled = 0;

        f.forEach(cell => {
            if (cell) cellsFilled++;
        });

        if (cellsFilled < 5) return;

        if (
            f[0] == f[1] && f[1] == f[2] && f[0] != 0 ||
            f[0] == f[4] && f[4] == f[8] && f[0] != 0 ||
            f[0] == f[3] && f[3] == f[6] && f[0] != 0 ||
            f[1] == f[4] && f[4] == f[7] && f[1] != 0 ||
            f[2] == f[5] && f[5] == f[8] && f[2] != 0 ||
            f[2] == f[4] && f[4] == f[6] && f[2] != 0 ||
            f[3] == f[4] && f[4] == f[5] && f[3] != 0 ||
            f[6] == f[7] && f[7] == f[8] && f[6] != 0) {
            return this.turn;
        }

        if (cellsFilled == 9) {
            return 'draw';
        }
    }
}

module.exports = Game;
