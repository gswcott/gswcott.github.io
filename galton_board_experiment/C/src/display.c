#include<stdio.h>
#include<stdlib.h>
#include "display.h"
#include "simulation.h"

SDL_Window* window = NULL; 
SDL_Renderer* renderer = NULL; 
SDL_Texture* colorBufferTexture = NULL;
uint32_t* colorBuffer = NULL; 
int window_width = GRID_WIDTH;
int window_height = GRID_HEIGHT; 


bool initializeWindow(void) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		fprintf(stderr, "Error initializing SDL \n"); 
		return false; 
	}
	window = SDL_CreateWindow(
		"Galton board experiment",
		SDL_WINDOWPOS_CENTERED,
		SDL_WINDOWPOS_CENTERED,
		window_width,
		window_height,
		SDL_WINDOW_SHOWN
	); 
	if (!window) {
		fprintf(stderr, "Error creating SDL \n"); 
		return false; 
	}
	renderer = SDL_CreateRenderer(window, -1, 0); 
	if (!renderer) {
		fprintf(stderr, "Error render SDL \n"); 
		return false;
	}

	return true; 
}

void clearColorBuffer(uint32_t color) {
	for (int i=1; i < window_width * window_height; i++) {
		colorBuffer[i] = color; 
	}
}

void drawPixel(int x, int y, uint32_t color) {
	if(x>=0 && x < window_width && y>=0 && y<window_height){
		colorBuffer[y * window_width + x] = color;
	}
}

void fillRect(int x, int y, int width, int height, uint32_t color) {
	for (int r = y; r<y+height; r++) {
		for (int c = x; c<x+width; c++) {
			drawPixel(c, r, color);
		}
	}
}

void strokeRect(int x, int y, int width, int height, uint32_t color) {
	for (int c = x; c<x+width; c++) {
		drawPixel(c, y, color);
		drawPixel(c, y+height, color);
	}
	for (int r = y; r<y+height; r++) {
		drawPixel(x, r, color);
		drawPixel(x+width, r, color);
	}
}

void renderColorBuffer(void) {
	SDL_UpdateTexture(
		colorBufferTexture,
		NULL,
		colorBuffer,
		window_width * sizeof(uint32_t)
	);
	SDL_RenderCopy(renderer, colorBufferTexture, NULL, NULL);
}

void destroyWindow(void) {
	free(colorBuffer);
	free(listBalls);
	SDL_DestroyRenderer(renderer); 
	SDL_DestroyWindow(window);
	SDL_Quit(); 
}
