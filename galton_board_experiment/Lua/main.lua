local size=12
local n=14
local startNbRows=4
local endNbRows=50
local nbRows=startNbRows+2*n+endNbRows
local nbCols=n*4+1
local windowW=nbCols*size
local windowH=nbRows*size
local listBalls={}
local totalBalls=600
local countBall=0
local grid={}
local centerC=math.floor(nbCols/2)+1
local durationIntervalAdd=0.3
local durationIntervalMove=durationIntervalAdd/2
local timerIntervalAdd=durationIntervalAdd
local timerIntervalMove=durationIntervalMove

function initGrid()
  local i, j
  for i=1, nbRows do 
    grid[i]={}
    for j=1, nbCols do 
      if i<startNbRows then 
        if j==centerC-1 then 
          grid[i][j]=3
        elseif j==centerC+1 then 
          grid[i][j]=4
        else
          grid[i][j]=0
        end
      elseif i==startNbRows then 
         grid[i][j]=0
      elseif i<=startNbRows+2*n then 
        if (i-startNbRows)%4==1 then 
          if j%4==1 then 
            grid[i][j]=1
          else 
            grid[i][j]=0
          end
        elseif (i-startNbRows)%4==0 or (i-startNbRows)%4==2 then 
          grid[i][j]=0
        elseif (i-startNbRows)%4==3 then 
          if j%4==3 then 
            grid[i][j]=1
          else 
            grid[i][j]=0
          end
        end
      else
        if j%4==3 then 
          grid[i][j]=2
        else
          grid[i][j]=0
        end
      end
    end
  end
end

function love.load()
  love.window.setMode(windowW, windowH)
  love.window.setTitle("Galton board experiment")
  love.math.setRandomSeed(love.timer.getTime())
  initGrid()
  addBall()
end

function addBall()
  local ball={}
  ball.x=(centerC-1)*size+size/2
  ball.y=size/2
  ball.r=size/2
  ball.vx=0
  ball.vy=size
  ball.color={love.math.random(), love.math.random(), love.math.random()}
  table.insert(listBalls, ball)
end

function love.update(dt)
  timerIntervalAdd=timerIntervalAdd-dt 
  timerIntervalMove=timerIntervalMove-dt
  if timerIntervalMove<=0 then
    updateBalls()
    timerIntervalMove=durationIntervalMove
  end
  if countBall < totalBalls then 
    if timerIntervalAdd<=0 then 
      addBall()
      countBall=countBall+1
      timerIntervalAdd=durationIntervalAdd
    end
  end
end

function updateBalls()
  local i 
  for i=1, #listBalls do
    local ball=listBalls[i]
    ball.x=ball.x+ball.vx 
    ball.y=ball.y+ball.vy 
    local r=math.floor((ball.y-size/2)/size)+1
    local c=math.floor((ball.x-size/2)/size)+1
    local belowBall=below(r, c)
    if r<startNbRows+2*n then 
      if belowBall==1 then 
        local num=love.math.random()
        if num<0.5 then 
          ball.vx=-size
        else 
          ball.vx=size
        end
      end
    else 
      ball.vx=0
      if belowBall==-1 then
        if r<nbRows and c<nbCols and grid[r+1][c+1]==0 then 
          ball.x=ball.x+size
          ball.y=ball.y+size
        elseif r<nbRows and c>1 and grid[r+1][c-1]==0 then
          ball.x=ball.x-size
          ball.y=ball.y+size
        else 
          grid[r][c]=-1
        end
        ball.vy=0
      end
    end
  end
end
  
function below(pR, pC)
  if pR>=nbRows then return -1 end
  return grid[pR+1][pC]
end

function drawGrid()
  love.graphics.setColor(0.2, 0, 0.2)
  local i, j
  for i=1, nbRows do 
    for j=1, nbCols do 
      local value=grid[i][j]
      local x=(j-1)*size
      local y=(i-1)*size
      if value==1 then 
        love.graphics.circle("fill", x+size/2, y+size/2, size/2)
      elseif value==2 then 
        love.graphics.rectangle("fill", x, y, size, size)
      elseif value==3 then 
        love.graphics.rectangle("fill", x, y, size/2, size)
      elseif value==4 then 
        love.graphics.rectangle("fill", x+size/2, y, size/2, size)
      end
    end
  end
end

function drawBalls()
  love.graphics.setColor(1, 0, 1)
  local i 
  for i=1, #listBalls do
    local ball=listBalls[i]
    love.graphics.setColor(ball.color[1], ball.color[2], ball.color[3])
    love.graphics.circle("fill", ball.x, ball.y, ball.r)
  end
end

function love.draw()
  drawGrid()
  drawBalls()
end