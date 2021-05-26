#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <SDL2\SDL.h>
#include <stdlib.h>
#include <time.h>
#include "display.h"
#include "simulation.h"

bool isGameRunning = false; 
int oldTime=0;

void setup(void) {
	colorBuffer = (uint32_t*) malloc(sizeof(uint32_t) * window_width * window_height); 
	colorBufferTexture = SDL_CreateTexture(
		renderer,
		SDL_PIXELFORMAT_ARGB8888,
		SDL_TEXTUREACCESS_STREAMING,
		window_width,
		window_height
	);
	listBalls = (ball_t *) malloc(sizeof(ball_t)*TOTAL_BALLS);
	srand(time(NULL)); // randomize the seed;
	restart();
}

void processInput(void) {
	SDL_Event event; 
	SDL_PollEvent(&event); 
	switch (event.type) {
		case SDL_QUIT: 
			isGameRunning = false; 
			break; 
		case SDL_KEYDOWN: 
			if (event.key.keysym.sym == SDLK_ESCAPE)
				isGameRunning = false; 
			if (event.key.keysym.sym == SDLK_RETURN){
				restart(); 
			}
			break; 
	}
}


void update(void) {
	float dt=(SDL_GetTicks()-oldTime)/1000.0;
	oldTime=SDL_GetTicks();
	updateSimulation(dt);
}

void render(void) {
	drawGrid(0xFF330033);
	drawBalls(0xFFFFFF00);
	renderColorBuffer();
	clearColorBuffer(0xFF000000);
	SDL_RenderPresent(renderer);
}

int main(int arg, char*args[]) {
	isGameRunning = initializeWindow(); 
	setup(); 
	while (isGameRunning) {
		processInput(); 
		update();
		render();
	}
	destroyWindow(); 
	return 0; 
}