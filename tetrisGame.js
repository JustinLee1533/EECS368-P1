tetrisGame = {};
tetrisGame.currentState = [];
tetrisGame.shapesArr = []; //array of all the shapes to add to current state
tetrisGame.aboveArr = [];	//stores the indeces of objects above cleared rows
tetrisGame.belowArr = [];	//stores objects below cleard rows
tetrisGame.currentShape;
tetrisGame.initialized = false;
tetrisGame.falling = false;
tetrisGame.dotLocation = 0;
tetrisGame.count = 9;
tetrisGame.points = 0;
tetrisGame.shapeID = 0;

tetrisGame.AddShape = function(shapeType, position, id)
{
	AddToConsole("Need to add shape with type = {"+shapeType+"}, position = {"+position+"}, and id = {" + id + "}");

	if(!this.initialized){this.Initialize();}	//initialize

	//create shape here
	this.currentShape = new shape(shapeType, position);
	AddToConsole("debug 1");

	//push it onto the shapesArr
	this.shapesArr.push(this.currentShape);
	AddToConsole("debug 2");

	this.falling = true;
	//this.currentState[this.dotLocation] = 1;

/*/TESTING PURPOSES: move block to left each time
	this.count++;
	if(this.count>9)
	{
		this.count = 0;
	}
	this.dotLocation = this.count;
*/
}

tetrisGame.IncrementTime = function()
{
	AddToConsole("IncrementTime");

	if(!this.initialized){this.Initialize();}

	// Get the color
	//var color = this.currentState[this.dotLocation];

	// Increment the color
	color++;
	if(color > 6)
	{
		color = 0;
	}

	//1.each call, every falling block in the game must move down 1 unit
	//can move any number of left or right per call

	//2.if any bottom edge of a block is in contact with any other block
	//the block can no longer fall, it cannot rotate or shift horizontally
	//where the function call results in contact, no other actions can take place

	//3. if the bottom edge of a block is in contact of the bottom, it can no longer fall

	/*if((this.dotLocation + 1 > 190)||(this.currentState[this.dotLocation+10]!= -1))
	{
		this.falling = false;
		//4. if a row is unbroken, it is removed and increment the points
		this.rowCheck();
		return;
	}else
{
		this.currentState[this.dotLocation] = -1;

		// Move the dotLocation
		this.dotLocation = this.dotLocation + 10;

		// Set the new current position of the dot to be filled
		this.currentState[this.dotLocation] = color;
//	}
*/
	for(var k = 0; k<4; k++)
	{

		this.currentShape.indices[k] += 10;
		AddToConsole("debug 4");

	}

	//5. after a row is removed, everything above the row combines to become a single shape
	// and begins falling following the same rules as above

	//6. blocks may be rotated left or right by 90 degrees any number of times during a call

	//7. after a set number of cleared lines, the game enters a mode where multiple blocks
	// can fall at the same times
	// Set the current position of the dot to be empty

}

tetrisGame.GetCurrentState = function()
{
	AddToConsole("getting current state");

	if(!this.initialized){this.Initialize();}
	//1. Clear the "currentState" array.
	this.currentState = [];
	for(var r = 0; r < 20; r++)
	{
		for(var c = 0; c < 10; c++)
		{
			this.currentState.push(-1);
		}
	}
	//2. Draw each shape onto the board by adding to the array.
	for(var k = 0; k<this.shapesArr.length; k++)
	{
		this.DrawShape(this.shapes[k]);

	}
	//3. Sending the array out.
	AddToConsole("returning state");

	return this.currentState;
}

tetrisGame.IsShapeFalling = function()
{
	AddToConsole("is shape falling");
	if(!this.initialized){this.Initialize();}

	return tetrisGame.falling;
}

tetrisGame.Initialize = function()
{
	AddToConsole("Initializing");

	for(var i = 0; i < 10; i++)
	{
		for(var j = 0; j < 20; j++)
		{
			this.currentState.push(-1);
		}
	}
	this.initialized = true;
}

tetrisGame.cart2i = function(x,y)
{
	var i = x+(10*y);
	return(i);
}

tetrisGame.i2x = function(i)
{
	var x = i%10;
	return(x);
}

tetrisGame.i2y = function(i)
{
	var y = i/10;
	return(y);
}

tetrisGame.clearRow = function(i) //.slice(start index, stopindex), make a member function
{

	this.setAbove(i);
	this.setBelow(i);
	this.currentState.splice(i, i+9); //clear row and shift
	/*for(var z = 0; z<10;z++) // add -1 to the top row
	{
		this.currentState.unshift(-1);
	}*/
	this.GetCurrentState();


}

tetrisGame.rowCheck = function()
{
	for(var i = 0; i<20; i++)
	{
		var rowBool = true;				//assume that the row is full
		for(var j = 0; j<10; j++)
		{

			var k = this.cart2i(j,i);
			if(this.currentState[k] == -1) //presence of one -1 means its not full
			{
				rowBool = false;
			}
		}

		if(rowBool == true)
		{

			this.clearRow(i*10); //clear the row and shift everthing else down
			//TESTING: Row clears but last block remains, clears before block actually lands
			this.points++;
		}
	}
}

tetrisGame.setBelow=function(i)
{
	this.belowArr = [];
	for(var j = i+10; j<199; j++)
	{
		if(this.currentState[j]!=-1)
		{
			this.belowArr.push(j); //push the index onto the array
		}
	}
}

tetrisGame.getBelow=function()
{
	for(var j = 0; j<this.aboveArr.length; j++)
	{
		this.currentState[this.belowArr[j]] = 3;	//sets everything in currentState equal to 3 where the structure is
	}
}

tetrisGame.setAbove=function(i) // store all the pieces into a single object when a row is cleared, above the row that was just cleared
{
	this.aboveArr = [];
	for(var j = 0; j<i; j++)
	{
		if(this.currentState[j]!=-1)
		{
			this.aboveArr.push(j);	//push its index onto the array

		}
	}
}

tetrisGame.getAbove=function() // writes the aboveArr to the currentState array
{
	for(var j = 0; j<this.aboveArr.length; j++)
	{
		this.currentState[this.aboveArr[j]+10] = 3;	//sets everything in currentState equal to 3 where the structure is
	}
}


tetrisGame.DrawShape = function(shape)
{
	// Draw center pixels
	this.currentState[shape.center] = shape.type;
	this.currentState[shape.center - 10] = shape.type;

	// Draw left pixels
	this.currentState[shape.center - 1] = shape.type;
	this.currentState[shape.center - 2] = shape.type;
	this.currentState[shape.center - 2 - 10] = shape.type;

	// Draw right pixels
	this.currentState[shape.center + 1] = shape.type;
	this.currentState[shape.center + 2] = shape.type;
	this.currentState[shape.center + 2 - 10] = shape.type;


}

shape = function(shapeType, position)
{
	AddToConsole("creating shape");

	this.colVal=shapeType;
	this.indices = []; //array of the indices where each colVal maps to onthe currentState array
	this.position = position;
	this.shapeType = shapeType;
	this.isFalling = false;

	if(shapeType == 0)	//----
	{
		this.indices.push(position, position+1, position+2, position+3);
	}else if(shapeType ==1)// _|_
	{
		this.indices.push(position, position+1, position+2, position+11);
	}else if(shapeType==2) // --_
	{
		this.indices.push(position, position+1, position+11, position+12);
	}else if(shapeType==3) // _--
	{
		this.indices.push(position, position+1, position-9, position-8);
	}else if(shapeType==4) // ||
	{
		this.indices.push(position, position+1, position+10, position+11);
	}else if(shapeType ==5) //|___
	{
		this.indices.push(position, position+10, position+11, position+12);
	}else // L
	{
		this.indices.push(position, position+1, position+2, position+10);
	}
}
