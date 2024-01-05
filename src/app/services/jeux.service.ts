import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JeuxService {
  private playerNames: string[] = ["", ""];
  private board!: number[][];
  private currentPlayer!: number;
  private boardSize = 8;

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));

    // Calculer les positions initiales des pions
    const midPoint = Math.floor(this.boardSize / 2);

    // Placer les pions initiaux
    // Joueur 1
    this.board[midPoint - 1][midPoint - 1] = 1;
    this.board[midPoint][midPoint] = 1;

    // Joueur 2
    this.board[midPoint - 1][midPoint] = 2;
    this.board[midPoint][midPoint - 1] = 2;

    // Tirage au sort du joueur qui commence
    this.currentPlayer = Math.floor(Math.random() * 2) + 1;
  }


  placePion(x: number, y: number): { success: boolean, scores: number[], gameEnded?: boolean, winner?: string, isDraw?: boolean } {
    if (!this.isValidMove(x, y)) {
      return { success: false, scores: this.calculateScores() };
    }

    this.board[x][y] = this.currentPlayer;

    // Vérifier si le joueur a gagné
    const hasWon = this.hasWon(this.currentPlayer);
    if (hasWon) {
      return { success: true, scores: this.calculateScores(), gameEnded: true, winner: this.getCurrentPlayerName() };
    }

    // Vérifier si la partie est terminée (match nul)
    const isDraw = this.isGameOver();
    if (isDraw) {
      return { success: true, scores: this.calculateScores(), gameEnded: true, isDraw: true };
    }

    // Continuer le jeu
    this.togglePlayer();
    return { success: true, scores: this.calculateScores(), gameEnded: false };
  }

  // ... Autres méthodes privées comme isValidMove, touchesOtherPion, etc.

  private hasWon(player: number): boolean {
    // Vérifier les lignes
    for (let row of this.board) {
      if (row.every(cell => cell === player)) return true;
    }

    // Vérifier les colonnes
    for (let col = 0; col < this.board.length; col++) {
      if (this.board.every(row => row[col] === player)) return true;
    }

    // Vérifier les diagonales
    if (this.board.every((row, idx) => row[idx] === player)) return true; // Diagonale principale
    if (this.board.every((row, idx) => row[this.board.length - 1 - idx] === player)) return true; // Diagonale secondaire

    return false;
  }


  isGameOver(): boolean {
    // Vérifie si un joueur a gagné
    if (this.hasWon(1) || this.hasWon(2)) return true;

    // Vérifie s'il reste des mouvements valides
    return !this.board.some(row => row.includes(0));
  }


  private calculateScores(): number[] {
    let scorePlayer1 = this.getMaxConsecutive(1);
    let scorePlayer2 = this.getMaxConsecutive(2);
    return [scorePlayer1, scorePlayer2];
  }

  private getMaxConsecutive(player: number): number {
    let maxConsecutive = 0;

    // Vérification des lignes
    for (const row of this.board) {
      maxConsecutive = Math.max(maxConsecutive, this.countConsecutive(row, player));
    }

    // Vérification des colonnes
    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map(row => row[col]);
      maxConsecutive = Math.max(maxConsecutive, this.countConsecutive(column, player));
    }

    // Vérification des diagonales
    maxConsecutive = Math.max(maxConsecutive, this.countConsecutiveDiagonal(player));

    return maxConsecutive;
  }

  private countConsecutive(array: number[], player: number): number {
    let maxCount = 0;
    let currentCount = 0;

    for (const cell of array) {
      if (cell === player) {
        currentCount++;
        maxCount = Math.max(maxCount, currentCount);
      } else {
        currentCount = 0;
      }
    }

    return maxCount;
  }

  private countConsecutiveDiagonal(player: number): number {
    let maxCountMain = 0, maxCountAnti = 0;
    let currentCountMain = 0, currentCountAnti = 0;

    for (let i = 0; i < this.board.length; i++) {
      // Diagonale principale
      if (this.board[i][i] === player) {
        currentCountMain++;
        maxCountMain = Math.max(maxCountMain, currentCountMain);
      } else {
        currentCountMain = 0;
      }

      // Diagonale anti-principale
      if (this.board[i][this.board.length - 1 - i] === player) {
        currentCountAnti++;
        maxCountAnti = Math.max(maxCountAnti, currentCountAnti);
      } else {
        currentCountAnti = 0;
      }
    }

    return Math.max(maxCountMain, maxCountAnti);
  }


  getBoard(): number[][] {
    return this.board;
  }

  getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  setPlayerName(playerNumber: number, name: string) {
    if (playerNumber === 1 || playerNumber === 2) {
      this.playerNames[playerNumber - 1] = name;
    }
  }

  setBoardSize(size: number) {
    this.boardSize = size;
    this.initializeGame(); // Réinitialiser le jeu avec la nouvelle taille de plateau
  }



  getCurrentPlayerName(): string {
    return this.playerNames[this.currentPlayer - 1];
  }

  resetGame(): void {
    this.initializeGame();
  }
  getPlayerName(playerNumber: number): string {
    // Vérifiez que playerNumber est valide (1 ou 2) pour éviter les erreurs
    if (playerNumber === 1 || playerNumber === 2) {
      return this.playerNames[playerNumber - 1]; // Les indices du tableau commencent à 0
    }
    return ''; // Retourne une chaîne vide si le numéro de joueur est invalide
  }


  private isValidMove(x: number, y: number): boolean {
    // Vérifie si la case est vide
    if (this.board[x][y] !== 0) {
      return false;
    }

    // Vérifie si le pion touche un autre pion
    return this.touchesOtherPion(x, y);
  }


  togglePlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }


  private touchesOtherPion(x: number, y: number): boolean {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    return directions.some(([dx, dy]) => {
      const newX = x + dx, newY = y + dy;
      return this.isInBounds(newX, newY) && this.board[newX][newY] !== 0;
    });
  }

  private isInBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.board.length && y < this.board[0].length;
  }

















}
