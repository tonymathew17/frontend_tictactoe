import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription;
  readonly human: string = 'human';
  readonly computer: string = 'computer';

  boardConfig: Array<Array<number>>;
  cells: NodeList;
  boardsize: number = 3;
  cellList: Array<number>;
  cellClickedReference: any;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.generateBoardConfig(this.boardsize);
    console.log(this.boardConfig);
    (<HTMLElement>document.querySelector(".endgame")).style.display = "none";
    this.cellClickedReference = this.cellClicked.bind(this);

    // Setting up game
    this.subscription = this.webSocketService.setupGame(this.boardsize).subscribe((response: any) => {
      console.log('setupGame response: ', response);
      // Generating possible cells
      this.cellList = response;
      this.subscription.unsubscribe();
    });
  }

  // This function is called when the document is ready
  ngAfterViewInit() {
    // making cells clickable
    this.cells = document.querySelectorAll('.cell');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].addEventListener('click', this.cellClickedReference, false);
    }
  }

  generateBoardConfig(boardsize: number) {
    this.boardConfig = [];
    let arr = [];
    for (let i = 0; i < (boardsize * boardsize); i++) {
      arr.push(i)
      if (arr.length === boardsize) {
        this.boardConfig.push(arr);
        arr = [];
      }
    }
  }

  cellClicked(clickedCellEvent) {
    let clickedCell = clickedCellEvent.target.id;
    // disabling clicked cell
    this.disableCells([+clickedCell]);
    // Marking player move in the board
    this.markCell(this.human, clickedCell);
    // Connecting with backend server to get computerMove/Result
    this.subscription = this.webSocketService.getComputerMove(+clickedCell).subscribe((response: any) => {
      console.log('response: ', response);
      if (Object.keys(response).includes("computerMove")) {
        this.disableCells([response.computerMove]);
        this.markCell(this.computer, response.computerMove);
      }
      if (response.winner && response.winningCombination) {
        this.disableCells(this.cellList);
        this.highlightCells(response.winner, response.winningCombination);
        this.showResult(response.winner);
      }
      this.subscription.unsubscribe();
    });
  }

  showResult(winner) {
    let text = ""
    if (winner === 'tie') {
      text = 'Tied!'
    }
    else {
      text = winner === this.human ? "You Won!" : "You Lose!";
    }
    (<HTMLElement>document.querySelector(".endgame")).style.display = "block";
    (<HTMLElement>document.querySelector(".endgame .text")).innerText = text;
  }

  highlightCells(winner, cellsNeedingHighlight) {
    let className = 'winner';
    if (winner === 'tie') {
      className = 'tie';
      cellsNeedingHighlight = this.cellList;
    }
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cellsNeedingHighlight.length; i++) {
      let cell = cellsNeedingHighlight[i];
      cells[cell].className = className;
    }
  }

  markCell(player, cell) {
    if (player === this.computer) {
      document.getElementById(cell).innerHTML = 'O';
    } else if (player === this.human) {
      document.getElementById(cell).innerHTML = 'X';
    }
  }

  disableCells(cellList: Array<number>): void {
    for (let i = 0; i < cellList.length; i++) {
      let cell = this.cells[cellList[i]];
      cell.removeEventListener('click', this.cellClickedReference, false);
      document.getElementById('' + cellList[i]).style.cursor = 'not-allowed';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
