import { Component, Input } from '@angular/core';
import { JeuxService } from 'src/app/services/jeux.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  message = '';
  board!: number[][];
  scores: number[] = [0, 0];

  constructor(private gameLogic: JeuxService) {}

  ngOnInit() {
    // Demander les noms des joueurs au chargement de la page
    this.askForPlayerNames();
    this.initializeGame();
  }

  initializeGame() {
    this.updateBoard();
    console.log(this.board);
    this.updateMessage(); // Mettre à jour le message avec les noms des joueurs et les scores
  }

  placePion(x: number, y: number) {
    const result = this.gameLogic.placePion(x, y);

    this.board = this.gameLogic.getBoard();
    this.scores = result.scores;

    if (result.gameEnded) {
      if (result.winner) {
        this.message = `Partie terminée. ${result.winner} a gagné avec un score de ${this.scores[0]}-${this.scores[1]}!`;

        // Déplacez la logique de demande de rejouer ici, après avoir affiché le message du gagnant
        if (confirm(`${result.winner} a gagné avec un score de  ${this.scores[0]}-${this.scores[1]} `+"Voulez-vous rejouer?")) {
          this.gameLogic.resetGame();
          this.initializeGame();
        }
      } else if (result.isDraw) {
        this.message = `Match nul avec un score de ${this.scores[0]}-${this.scores[1]}!`;

        // Déplacez la logique de demande de rejouer ici, après avoir affiché le message du match nul
        if (confirm(" math nul Voulez-vous rejouer?")) {
          this.gameLogic.resetGame();
          this.initializeGame();
        }
      }
    } else {
      // Continuer le jeu
      this.updateMessage(); // Mettre à jour le message avec les noms des joueurs et les scores
    }
  }

  updateBoard() {
    this.board = this.gameLogic.getBoard();
    console.log(this.board);
  }

  checkGameOver() {
    if (this.gameLogic.isGameOver()) {
      // Afficher un message de fin de jeu et éventuellement le vainqueur
    }
  }

  resetGame() {
    this.gameLogic.resetGame();
    this.initializeGame();
  }

  displayPion(cell: number): string {
    switch(cell) {
      case 1: return 'Pion Noir';
      case 2: return 'Pion Blanc';
      default: return '';
    }
  }

  askForPlayerNames() {
    const playerName1 = prompt('Nom du Joueur 1:');
    const playerName2 = prompt('Nom du Joueur 2:');

    if (playerName1 && playerName2) {
      // Enregistrer les noms des joueurs dans le service
      this.gameLogic.setPlayerName(1, playerName1);
      this.gameLogic.setPlayerName(2, playerName2);
    }
  }

  // Mettre à jour le message avec les noms des joueurs et les scores
  updateMessage() {
    this.message = `Au tour de ${this.gameLogic.getCurrentPlayerName()} de jouer. Score actuel : ${this.gameLogic.getPlayerName(1)} ${this.scores[0]} - ${this.scores[1]} ${this.gameLogic.getPlayerName(2)}`;
  }
}
