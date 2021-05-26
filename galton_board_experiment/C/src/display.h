#ifndef DISPLAY_H
#define DISPLAY_H

#include<stdbool.h>
#include<stdint.h>
#include<SDL2\SDL.h>

extern SDL_Window* window; 
extern SDL_Renderer* renderer; 
extern SDL_Texture* colorBufferTexture;
extern uint32_t* colorBuffer; 
extern int window_width;
extern int window_height; 


bool initializeWindow(void);
void clearColorBuffer(uint32_t color);
void bgColorBuffer(uint32_t* bg_texture);
void drawPixel(int x, int y, uint32_t color);
void fillRect(int x, int y, int width, int height, uint32_t color);
void strokeRect(int x, int y, int width, int height, uint32_t color);
void renderColorBuffer(void);
void destroyWindow(void); 

#endif