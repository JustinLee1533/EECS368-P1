tetrisGame = {};
tetrisGame.currentState = [];
tetrisGame.shapesArr = []; //array of all the shapes to add to current state
tetrisGame.aboveArr = [];	//stores the indeces of objects above cleared rows
tetrisGame.belowArr = [];	//stores objects below cleard rows
tetrisGame.currentShape = 0;
tetrisGame.initialized = false;
tetrisGame.falling = false;
tetrisGame.points = 0;
tetrisGame.shapeID = 0;

tetrisGame.AddShape = function(shapeType, position, id)
{
	AddToConsole("Need to add shape with type = {"+shapeType+"}, position = {"+position+"}, and id = {" + id + "}");

	if(!this.initialized){this.Initialize();}	//initialize

	//create shape here
	this.currentShape = new shape(0, position);

	//push it onto the shapesArr TODO, this after its done falling
	//this.shapesArr.push(this.currentShape);

	this.falling = true;
}

tetrisGame.IncrementTime = function()
{
	AddToConsole("IncrementTime");
	this.shapesArr.pop();
	if(!this.initialized){this.Initialize();}
	//1.each call, every falling block in the game must move down 1 unit
	//can move any number of left or right per call

	//2.if any bottom edge of a block is in contact with any other block
	//the block can no longer fall, it cannot rotate or shift horizontally
	//where the function call results in contact, no other actions can take place

	//3. if the bottom edge of a block is in contact of the bottom, it can no longer fall

	//determine the critical pieces of the current shape based on if its a "normal" shape and determine which of the four orientations it has, 
	var flag = true;
	
	//TODO, not correct.  Needs to compare the indices of the current shapes and the Currentstate Array
	if((this.currentShape.direction === 0)&&(this.currentShape.standard === "normal")) 
	{
		if(this.currentShape.shapeType == 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10]!= -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}	
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		
		AddToConsole("reaching end of if-else-if block without entering");
			
		}
	}else if((this.currentShape.direction === 1)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if(this.currentState[this.currentShape.indices[0]+10] != -1)
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}	
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				flag = false;
			}
		}
	}else if ((this.currentShape.direction === 2)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[0]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}	
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				flag = false;
			}
		}
	}else if ((this.currentShape.direction === 3)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				flag = false;
			}	
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				flag = false;
			}
		}
	}

	if((flag === true)&&(this.currentShape.standard === "normal")) // its not going to hit anything, so move each piece down 
	{
		for(var z = 0; z<4; z++)
		{
			this.currentShape.indices[z] +=10; 
		}

	}else if ((flag === true)&&(this.currentShape.standard === "irregular"))		
	{
			//TODO allow for irregular shape exceptions here

	}else //its going to hit something, stop the object from falling
	{
		this.isFalling = false;
		
		
		//this.rowCheck();
		//Questions what to do new next: add the current shape to shapes Arr? how to deal with partially deleted shapes?
		//could check each shape in shapesArr to see if it has an index in the row delete zone., if it does, delete it
	}
	this.shapesArr.push(this.currentShape); // push currentShape onto the shapes array


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
		this.DrawShape(this.shapesArr[k]);
	}
	//3. Sending the array out.

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

tetrisGame.clearRow = function(i) 
{
	AddToConsole("Calling clearRow");
	this.setAbove(i);
	this.setBelow(i);
//TODO check each index of the shapes arr and remove it if its in the row
	for(var k =0; k<this.shapesArr.length; k++)
	{
		for(var m=0; m<this.shapesArr[i].indices.length; m++)
		{
			//check its between i and i+9
			if((this.shapesArr[k].indices[m]>i)&&(this.shapesArr[k].indices[m]))
			{
				//remove the index from the indices array of the shape in the shapes arr
				this.shapesArr[k].indices.splice(m,1);
			}
		}
	}
	this.GetCurrentState();
}

tetrisGame.rowCheck = function()
{
	AddToConsole("row check");
	for(var i = 0; i<20; i++)
	{
		var rowBool = true;				//assume that the row is full
		for(var j = 0; j<10; j++)
		{

			var k = this.cart2i(j,i);
			if(this.currentState[k] === -1) //presence of one -1 means its not full
			{
				rowBool = false;
			}
		}

		if(rowBool === true)
		{
			this.clearRow(i*10); //clear the row and shift everthing else down
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
	for(var i =0; i<shape.indices.length; i++) //for each shape in the shapes arr
	{
		//TODO draw each pixel 
		this.currentState[shape.indices[i]]=shape.shapeType;
	}
}

shape = function(type, position)
{
	AddToConsole("creating shape with shapeType set to"+type);

	this.indices = []; //array of the indices where each colVal maps to onthe currentState array
	this.position = position;
	this.shapeType = type;
	this.isFalling = false;
	this.center=0;	//pivot
	this.standard=0; //this will be used to distinguish between standard added shapes and the ones that are formed above the rows that are cleared
	this.direction = 0;	//on of a maximum of four possible orientations

	AddToConsole("confirming shapeType set to"+this.shapeType);

	if(this.shapeType === 0)	//----
	{
		AddToConsole("Creating this shape like we're supposed to");
		this.indices.push(position, position+1, position+2, position+3);
		this.center = position+1;
		this.standard= "normal";
	}else if(this.shapeType ===1)// _|_
	{
		this.center = position+1;
		this.indices.push(position, position+1, position+2, position+11);
		this.standard= "normal";
	}else if(this.shapeType===2) // --_
	{
		this.center = position+11;
		this.indices.push(position, position+1, position+11, position+12);
		this.standard= "normal";
	}else if(this.shapeType===3) // _--
	{
		this.center = position+11;
		this.indices.push(position+10, position+11, position+1, position+2);
		this.standard= "normal";
	}else if(this.shapeType===4) // ||
	{
		this.center = position;
		this.indices.push(position, position+1, position+10, position+11);
		this.standard= "normal";
	}else if(this.shapeType ===5) //|___
	{
		this.center = position+11;
		this.indices.push(position, position+10, position+11, position+12);
		this.standard= "normal";
	}else // L
	{
		this.center = position+1;
		this.indices.push(position+10, position, position+1, position+2);
		this.standard= "normal";
	}
}
