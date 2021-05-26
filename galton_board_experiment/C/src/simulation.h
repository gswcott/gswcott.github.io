#ifndef SIMULATION_H
#define SIMULATION_H

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include "display.h"

#define SIZE 12
#define NB_STEPS 14
#define START_NB_ROWS 4
#define END_NB_ROWS 50
#define NB_ROWS (START_NB_ROWS+2*NB_STEPS+END_NB_ROWS)
#define NB_COLS (NB_STEPS*4+1)
#define GRID_WIDTH (NB_COLS * SIZE)
#define GRID_HEIGHT (NB_ROWS * SIZE)
#define DURATION_INTERVAL_ADD 0.3
#define DURATION_INTERVAL_MOVE 0.15
#define TOTAL_BALLS 600

typedef struct{
    int x; 
    int y; 
    int r; 
    int vx; 
    int vy; 
} ball_t; 

extern int centerC; 
extern int grid[NB_ROWS][NB_COLS]; 
extern int countBall; 
extern ball_t* listBalls; 
extern float timerIntervalAdd; 
extern float timerIntervalMove; 

extern void initGrid(void); 
extern void addBall(void); 
extern void restart(void); 
extern void updateSimulation(float dt); 
extern void drawGrid(uint32_t color); 
void drawBalls(uint32_t color);
#endif