function tetrisGame()
{
  this.currentState = [];
  this.initialized = false;
  this.falling = false;
  this.dotLocation = 0;

  this.AddShape = function(shapetype, position, id)
  {
    if(!this.initialized)
    {
      this.Initialize();
    }
  	tetrisGame[0] = 1;
  	this.dotLocation = 0;
  	this.falling = true;
  	this.currentState[this.dotLocation] = 1;
  }

  this.IncrementTime = function()
  {
    if(!this.initialized){this.Initialize();}

  	// Get the color
  	var color = this.currentState[this.dotLocation];

  	// Increment the color
  	color++;
  	if(color > 6){
  		color = 0;
  	}


  	// Set the current position of the dot to be empty
  	this.currentState[this.dotLocation] = -1;
  	if(this.dotLocation + 1 == this.currentState.length){
  		this.falling = false;
  		return;
  	}

  	// Move the dotLocation
  	this.dotLocation = this.dotLocation + 1;

  	// Set the new current position of the dot to be filled
  	this.currentState[this.dotLocation] = color;

  }

  this.IsShapeFalling = function()
  {
    if(!this.initialized){this.Initialize();}
    return tetrisGame.falling;
  }

  this.GetCurrentState = function()
  {
    if(!this.initialized)
    {
      this.Initialize();
    }
    return(this.currentState);
  }

  this.Initialize = function() // set array to all -1
  {
    for(var i = 0; i< 10; i++)
    {
      for(var j = 0; j<20; j++)
      {
        this.currentState.push(-1);
      }
    }
    this.initialized = true;
  }
}
