#include <stdio.h>
#include <math.h>
#include "simulation.h"

int centerC  = floor(NB_COLS/2); 
int grid[NB_ROWS][NB_COLS]; 
int countBall =0; 
ball_t* listBalls = NULL; 
float timerIntervalAdd = DURATION_INTERVAL_ADD; 
float timerIntervalMove = DURATION_INTERVAL_MOVE; 

int int_random(int n){
    return rand() % n; 
}

void initGrid(void){
	for(int i = 0; i < NB_ROWS; i++){
		for(int j = 0; j < NB_COLS; j++){
			if (i < START_NB_ROWS - 1){
				if (j == centerC-1){
					grid[i][j] = 3;
				}else if(j == centerC + 1){
					grid[i][j] = 4;
				}else{
					grid[i][j] = 0;
				}
			}else if (i < START_NB_ROWS){
				grid[i][j] = 0;
			}else if (i < START_NB_ROWS + 2 * NB_STEPS){
				if ((i - START_NB_ROWS) % 4 == 0){
					if(j % 4 == 0){
						grid[i][j] = 1;
					}else{
						grid[i][j] = 0;
					}
				}else if ((i - START_NB_ROWS) %4 == 1 || (i - START_NB_ROWS) % 4 == 3){
					grid[i][j] = 0;
				}else if ((i - START_NB_ROWS) % 4 == 2){
					if (j % 4 == 2){
						grid[i][j] = 1;
					}else{
						grid[i][j] = 0;
					}
				}
			}else{
				if(j % 4 == 2){
					grid[i][j] = 2;
				}else{
					grid[i][j] = 0;
				}
			}
		}    
	}
}

void addBall(void){
	ball_t ball; 
	ball.x = centerC * SIZE; 
	ball.y = 0; 
	ball.r = SIZE/2 -1; 
	ball.vx = 0; 
	ball.vy = SIZE; 
	listBalls[countBall++] = ball; 
}

void restart(void){
	timerIntervalAdd = DURATION_INTERVAL_ADD; 
	timerIntervalMove = DURATION_INTERVAL_MOVE;
	countBall = 0; 
	initGrid();  
	addBall(); 
}

int below(int r, int c){
	if (r >= NB_ROWS - 1){
		return -1;
	}
	return grid[r+1][c];
}

void updateBalls(void){
    for(int i=0; i<countBall; i++){
        ball_t* ball = &listBalls[i];
        ball->x = ball->x + ball->vx;
        ball->y = ball->y + ball->vy;
    	int r = floor(ball->y / SIZE);
        int c = floor(ball->x / SIZE);
		//printf("r and c %d %d %d %d %d\n", r, c, ball->x, ball->y, i);
        int belowBall = below(r, c);
		//printf("belowBall %d \n", belowBall); 
        if(r < START_NB_ROWS + 2 * NB_STEPS - 1){
            if(belowBall == 1){
                int num = int_random(2); 
                if (num == 0){
                    ball->vx = -SIZE;
                }else{
                    ball->vx = SIZE;
                }
            }
        }else{
            ball->vx = 0;
            if(belowBall == -1){
                if(r < NB_ROWS-1 && c < NB_COLS-1 && grid[r+1][c+1] == 0){
                    ball->x = ball->x + SIZE;
                    ball->y = ball->y + SIZE;
                }else if(r < NB_ROWS - 1 && c > 0 && grid[r+1][c-1] == 0){
                    ball->x = ball->x - SIZE;
                    ball->y = ball->y + SIZE;
                }else{
                    grid[r][c] = -1;
                }
                ball->vy = 0; 
            }
        }
    }
}

void updateSimulation(float dt){
	timerIntervalAdd -= dt;
    timerIntervalMove -= dt;
	if (timerIntervalMove <= 0){
        updateBalls();
        timerIntervalMove = DURATION_INTERVAL_MOVE;
    } 
    if (countBall < TOTAL_BALLS){
        if (timerIntervalAdd <= 0){
            addBall();
            timerIntervalAdd = DURATION_INTERVAL_ADD;
        }
    } 
}

void drawGrid(uint32_t color) {
	for(int i = 0; i < NB_ROWS; i++){
		for(int j = 0; j < NB_COLS; j++){
			int value = grid[i][j];
            int x = j * SIZE;
            int y = i * SIZE;
			if(value==1){
				fillRect(x, y , SIZE, SIZE, color); 
			}else if (value==2){
				fillRect(x, y, SIZE, SIZE, color); 
			}else if (value==3){
				fillRect(x, y, SIZE/2, SIZE, color); 
			}else if (value==4){
				fillRect(x + SIZE/2, y, SIZE/2, SIZE, color); 
			}
		}
	}
}

void drawBalls(uint32_t color) {
	for(int i = 0; i < countBall; i++){
		ball_t ball = listBalls[i];
		fillRect(ball.x, ball.y, 2*ball.r, 2*ball.r, color); 
	}
}