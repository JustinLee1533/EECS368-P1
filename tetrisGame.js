/*
*	@author: Justin Lee
*	@date:	4/3/2016
*	@name:	tetrisGame.js
*/
tetrisGame = {};	//tetris game object
tetrisGame.currentState = []; //array that holds all the values of the tetris game
tetrisGame.shapesArr = []; //array of all the shapes to add to current state
tetrisGame.aboveArr = [];	//stores the indeces of objects above cleared rows
tetrisGame.belowArr = [];	//stores objects below cleard rows
tetrisGame.currentShape = 0; //current shape moving
tetrisGame.initialized = false; //whether the currentState array has had 200 -1's pushed to it
tetrisGame.falling = false;	//boolean value whether the shape is moving or not
tetrisGame.points = 0;	//the score that the user has
tetrisGame.shapeID = 0;	//unique id of each shape
tetrisGame.cur =0;	//for testing/debug purposes

/*
	@Pre: A shapeType, position, and id are passed in;
	@Post: a new shape is created with the parameters passed in and falling is se to true
	@Return: None
*/
tetrisGame.AddShape = function(shapeType, position, id)
{
	AddToConsole("Need to add shape with type = {"+shapeType+"}, position = {"+position+"}, and id = {" + id + "}");
	this.cur +=2;
	if(this.cur>8)
	{
		this.cur = 0;
	}
	if(!this.initialized){this.Initialize();}	//initialize

	//create shape here

	if((this.posistion>=7)&&(this.shapeType == 0))
	{
		this.position = 6;
	}

	this.currentShape = new shape(0, this.cur);
	this.falling = true;
}

/*
	@Pre: a shape is currently falling
	@Post: the shape can move left or right, rotate, and move down, provided it will not hit another block
	@Return: None
*/
tetrisGame.IncrementTime = function()
{
	AddToConsole("IncrementTime");

		/*TODO peek to see if the currentShape is the one at the end of the shapesArr, if it is, pop it so we're not popping new objects
		this.shapesArr.pop();
		*/
	if(!this.initialized){this.Initialize();}
	//1.each call, every falling block in the game must move down 1 unit
	//can move any number of left or right per call

	//2.if any bottom edge of a block is in contact with any other block
	//the block can no longer fall, it cannot rotate or shift horizontally
	//where the function call results in contact, no other actions can take place

	//3. if the bottom edge of a block is in contact of the bottom, it can no longer fall

	//determine the critical pieces of the current shape based on if its a "normal" shape and determine which of the four orientations it has,

	//compare the indices of the current shapes and the Currentstate Array

	this.rotLeft(this.currentShape);

	var check1 = this.incCheck();
	var check2 = this.bottomCheck();

	if((this.incCheck())&&(this.bottomCheck())&&(this.currentShape.standard === "normal")) // its not going to hit anything, so move each piece down
	{
		for(var z = 0; z<4; z++)
		{
			this.currentShape.indices[z] +=10;
		}
	}else if (/*(run a check on the irregular)&&*/(this.currentShape.standard === "irregular"))
	{
			//TODO allow for irregular shape exceptions here
	}else //its going to hit something, stop the object from falling
	{
		AddToConsole("stop falling");
		this.falling = false;
		this.currentShape.isFalling=false;

		this.rowCheck();
	}
	this.shapesArr.push(this.currentShape); // push currentShape onto the shapes array


	//5. after a row is removed, everything above the row combines to become a single shape
	// and begins falling following the same rules as above

}

/*
	@Pre: None
	@Post: The currentState array is cleared and redrawn with each of the shapes in the shapesArr
	@Return: the currentState array
*/
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

/*
	@Pre: None
	@Post: None
	@Return: The falling boolean
*/
tetrisGame.IsShapeFalling = function()
{
	AddToConsole("is shape falling");
	AddToConsole(this.falling);
	if(!this.initialized){this.Initialize();}

	return this.falling;
}

/*
	@Pre: None
	@Post: the currentState array has 200 -1's pushed to it
	@Return: None
*/
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

/*
	@Pre: two x and y integers are passed in
	@Post: the two parameters are converted into an integer
	@Return: an integer corresponding to an index on the currentState Array
*/
tetrisGame.cart2i = function(x,y)
{
	var i = x+(10*y);
	return(i);
}

/*
	@Pre: an index from the currentState array is passed in
	@Post: the index's x cartesian value is computed
	@Return: the x value of the index
*/
tetrisGame.i2x = function(i)
{
	var x = i%10;
	return(x);
}

/*
	@Pre: an index from the currentState array is passed in
	@Post: the index's y cartesian value is computed
	@Return: the y value of the index
*/
tetrisGame.i2y = function(i)
{
	var y = i/10;
	return(y);
}

/*
	@Pre: an index from the currentState array is passed in
	@Post: removes blocks from completed rows in the shapesArr
	@Return: None
*/
tetrisGame.clearRow = function(i)
{
	AddToConsole("Calling clearRow");
	//this.setAbove(i);
	//this.setBelow(i);

	for(var k =0; k<this.shapesArr.length; k++)
	{
		for(var m=0; m<this.shapesArr[k].indices.length; m++)
		{
			//check its between i and i+9
			if((this.shapesArr[k].indices[m]>=i)&&(this.shapesArr[k].indices[m]))
			{
				//remove the index from the indices array of the shape in the shapes arr
				this.shapesArr[k].indices.splice(m,1);
				if(this.shapesArr[k].indices.length == 0) // this is a check to make sure empty objects are removed from the shapesArr
				{
					this.shapesArr.splice(k,1);
				}
			}
		}
	}
	this.GetCurrentState();
}

/*
	@Pre: Currentstate is initialized
	@Post: rows are checked to see if they are completed
	@Return: None
*/
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

/*
	@Pre: an index of the currentState array is passed in
	@Post: all the pixels below the row being cleared are passed in
	@Return:
*/
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

/*
	@Pre: an index of the currentState array is passed in
	@Post: all the pixels from the belowArr are pushed onto the current state array
	@Return: None
*/
tetrisGame.getBelow=function()
{
	for(var j = 0; j<this.aboveArr.length; j++)
	{
		this.currentState[this.belowArr[j]] = 3;	//sets everything in currentState equal to 3 where the structure is
	}
}

/*
	@Pre: an index of the currentState array is passed in
	@Post: all the pixels above the row being cleared are passed in
	@Return:
*/
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

/*
	@Pre: an index of the currentState array is passed in
	@Post: all the pixels from the aboveArr are pushed onto the current state array
	@Return: None
*/
tetrisGame.getAbove=function() // writes the aboveArr to the currentState array
{
	for(var j = 0; j<this.aboveArr.length; j++)
	{
		this.currentState[this.aboveArr[j]+10] = 3;	//sets everything in currentState equal to 3 where the structure is
	}
}

/*
	@Pre: a shape is falling
	@Post: None
	@Return: false if the shape is going to hit the bottom of the array, else true
*/
tetrisGame.bottomCheck = function()
{
	if((this.currentShape.direction === 0)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType == 0)	//check the relevant critical spots
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10> 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}
	}else if((this.currentShape.direction === 1)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if(this.currentShape.indices[0]+10 > 199)
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199))
			{
				return false;
			}
		}
	}else if ((this.currentShape.direction === 2)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[1]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[0]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[1]+10 > 199))
			{
				return false;
			}
		}
	}else if ((this.currentShape.direction === 3)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentShape.indices[2]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentShape.indices[1]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[1]+10 > 199))
			{
				return false;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentShape.indices[0]+10 > 199)||(this.currentShape.indices[3]+10 > 199))
			{
				return false;
			}
		}else
		{
			return true;
		}
	}

	return(true);
}

/*
	@Pre: a valid shape is passed in, and its falling
	@Post: a shape is rotated left, provided it does not run into anything else
	@Return: true if shape was rotated, else false
*/

//TODO: for each shape, check its critical points paths to see if it can move
//if it can, move the shape (update eache index)
//update  direction
tetrisGame.rotLeft = function(shape)
{
	if(shape.shapeType === 0)	//----
	{
		if(shape.direction == 0)
		{
			if((this.currentState[shape.indices[0]+10] == -1)&& /*check to see if rotation will hit other blocks*/
					(this.currentState[shape.indices[0]+20] == -1)&&
					(this.currentState[shape.indices[0]+21] == -1)&&
					(this.currentState[shape.indices[1]+10] == -1)&&
					(this.currentState[shape.indices[3]-10] == -1)&&
					(this.currentState[shape.indices[3]-11] == -1)&&
					(this.currentState[shape.indices[3]-12] == -1)&&	/*end checking of other blocks*/
					(this.i2y(shape.indices[0]) != 0) &&/*begin boundary checks (not row 0, 19, 20)*/
					(this.i2y(shape.indices[0]) != 19)&&
					(this.i2y(shape.indices[0]) != 18) /*end boundary check*/
				)
				{
					//rotate the shape
					shape.indices[0] = shape.indices[0]+21;
					shape.indices[1] = shape.indices[1]+10;
					shape.indices[2] = shape.indices[2]-1;
					shape.indices[3] = shape.indices[3]-12;
					AddToConsole("rotating");


					shape.direction = 1;
					return true;
				}else {
					AddToConsole("can't rotating");

				}
		}else if(this.direction == 1)
		{
			if((this.currentState[shape.indices[3]-1] == -1)&& /*begin rotation check*/
				(this.currentState[shape.indices[3]+9] == -1)&&
				(this.currentState[shape.indices[3]+19] == -1)&&
				(this.currentState[shape.indices[1]+1] == -1)&&
				(this.currentState[shape.indices[0]+1] == -1)&&
				(this.currentState[shape.indices[0]+2] == -1)&&
				(this.currentState[shape.indices[0]+8] == -1)&& /*end rotation check*/
				(this.i2x(shape.indices[3]) != 0)&& /*begin boundary check (not in columns 0, 8, or 9)*/
				(this.i2x(shape.indices[3]) != 8)&&
				(this.i2x(shape.indices[3]) != 9)/*end boundary check*/
			)
			{
				shape.indices[0] = shape.indices[0]-8;
				shape.indices[1] = shape.indices[1]+1;
				shape.indices[2] = shape.indices[2]+10;
				shape.indices[3] = shape.indices[3]+19;
				shape.direction = 2;
				AddToConsole("rotating");

				return true;
			}else {
				AddToConsole("Can't rotate");
			}
		}else if(this.direction == 2)
		{
			if((this.currentState[shape.indices[0]-10] == -1)&& /*check to see if rotation will hit other blocks*/
					(this.currentState[shape.indices[0]-20] == -1)&&
					(this.currentState[shape.indices[0]-21] == -1)&&
					(this.currentState[shape.indices[1]-10] == -1)&&
					(this.currentState[shape.indices[3]+10] == -1)&&
					(this.currentState[shape.indices[3]+11] == -1)&&
					(this.currentState[shape.indices[3]+12] == -1)&&	/*end checking of other blocks*/
					(this.i2y(shape.indices[0]) != 0)&& /*begin boundary check ensure you're not in the row 0, 1, 19*/
					(this.i2y(shape.indices[0]) != 1)&&
					(this.i2y(shape.indices[0]) != 19) /*end boundary check*/
			)
			{
				shape.indices[0] = shape.indices[0]-21;
				shape.indices[1] = shape.indices[1]-10;
				shape.indices[2] = shape.indices[2]+1;
				shape.indices[3] = shape.indices[3]+12;
				shape.direction = 3;
				AddToConsole("rotating");

				return true;
			}else {
				AddToConsole("can't rotating");

			}
		}else if(this.direction == 3)
		{
			if((this.currentState[shape.indices[3]+1] == -1)&& /*begin rotation check*/
				(this.currentState[shape.indices[3]-9] == -1)&&
				(this.currentState[shape.indices[3]-19] == -1)&&
				(this.currentState[shape.indices[1]-1] == -1)&&
				(this.currentState[shape.indices[0]-1] == -1)&&
				(this.currentState[shape.indices[0]-2] == -1)&&
				(this.currentState[shape.indices[0]-8] == -1)&& /*end rotation check*/
				(this.i2x(shape.indices[3]) != 0)&& /*begin boundary check (not in columns 0, 1, or 9)*/
				(this.i2x(shape.indices[3]) != 1)&&
				(this.i2x(shape.indices[3]) != 9) /*end boundary check*/
			)
			{
				shape.indices[0] = shape.indices[0]+8;
				shape.indices[1] = shape.indices[1]-1;
				shape.indices[2] = shape.indices[2]+10;
				shape.indices[3] = shape.indices[3]-19;
				AddToConsole("rotating");

				shape.direction = 0;
				return true;
			}else
			{
				AddToConsole("can't rotating");

			}
		}
	}else if(this.shapeType ===1)// _|_
	{
		if(this.direction == 0)
		{
			if((this.currentState[shape.indices[0]+10] == -1) &&/*check rotation space*/
				(this.currentState[shape.indices[3]+1] == -1)&&
				(this.currentState[shape.indices[2]-10] == -1)&&
				(this.currentState[shape.indices[3]-9] == -1)&& /*end check rotation space*/
				(shape.indices[0]+10 >= 0) /*begin boundary check*/
			)
			{

			}
		}else if(this.direction == 1)
		{

		}else if(this.direction == 2)
		{

		}else if(this.direction == 3)
		{

		}
	}else if(this.shapeType===2) // --_
	{
		if(this.direction == 0)
		{

		}else if(this.direction == 1)
		{

		}else if(this.direction == 2)
		{

		}else if(this.direction == 3)
		{

		}
	}else if(this.shapeType===3) // _--
	{
		if(this.direction == 0)
		{

		}else if(this.direction == 1)
		{

		}else if(this.direction == 2)
		{

		}else if(this.direction == 3)
		{

		}
	}else if(this.shapeType===4) // ||
	{
		return false;
	}else if(this.shapeType ===5) //|___
	{
		if(this.direction == 0)
		{

		}else if(this.direction == 1)
		{

		}else if(this.direction == 2)
		{

		}else if(this.direction == 3)
		{

		}
	}else if(this.shapeType ===6)
	{
		if(this.direction == 0)
		{

		}else if(this.direction == 1)
		{

		}else if(this.direction == 2)
		{

		}else if(this.direction == 3)
		{

		}
	}
}

/*
	@Pre: a valid shape is passed in, and its falling
	@Post: a shape is rotate right, provided it does not run into anything else
	@Return:  true if shape was rotated, else false
*/
tetrisGame.rotRight = function(shape)
{
	if(this.shapeType === 0)	//----
	{

	}else if(this.shapeType ===1)// _|_
	{

	}else if(this.shapeType===2) // --_
	{

	}else if(this.shapeType===3) // _--
	{

	}else if(this.shapeType===4) // ||
	{

	}else if(this.shapeType ===5) //|___
	{

	}else if(this.shapeType ===6)
	{

	}
}

/*
	@Pre: a shape is falling
	@Post: None
	@Return: false if the shape is going to hit another shape, else true
*/
tetrisGame.incCheck = function()
{
	if((this.currentShape.direction === 0)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType == 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10]!= -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{

				return false;
			}else
			{
				return true;
			}
		}
	}else if((this.currentShape.direction === 1)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if(this.currentState[this.currentShape.indices[0]+10] != -1)
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				return false;
			}else
			{
				AddToConsole("Not a valid shape");
			}
		}
	}else if ((this.currentShape.direction === 2)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[0]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else
		{
			AddToConsole("Not a valid shape")
		}
	}else if ((this.currentShape.direction === 3)&&(this.currentShape.standard === "normal"))
	{
		if(this.currentShape.shapeType === 0)	//check the relevant critical spots
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 1)
		{
			if((this.currentState[this.currentShape.indices[2]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 2)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 3)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 4)
		{
			if((this.currentState[this.currentShape.indices[1]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 5)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[1]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else if(this.currentShape.shapeType === 6)
		{
			if((this.currentState[this.currentShape.indices[0]+10] != -1)||(this.currentState[this.currentShape.indices[3]+10] != -1))
			{
				return false;
			}else
			{
				return true;
			}
		}else
		{
			AddToConsole("Not a valid shape")
		}
	}else
	{
		AddToConsole("Either invalid direction or not a 'normal' type");
	}
}

/*
	@Pre: a shape is passed in
	@Post: each pixel of the shape is pushed onto the currentState array
	@Return: None
*/
tetrisGame.DrawShape = function(shape)
{
	for(var i =0; i<shape.indices.length; i++) //for each shape in the shapes arr
	{
		//draw each pixel
		this.currentState[shape.indices[i]]=shape.shapeType;
	}
}

/*
	@Pre: the type and position of the shape is passed in
	@Post: a shape is created
	@Return: None
*/
shape = function(type, pos)
{
	this.indices = []; //array of the indices where each colVal maps to onthe currentState array
	this.position = pos;
	this.shapeType = type;
	this.isFalling = false;
	this.center=0;	//pivot
	this.standard= "normal"; //this will be used to distinguish between standard added shapes and the ones that are formed above the rows that are cleared
	this.direction = 0;	//on of a maximum of four possible orientations

	if(this.shapeType === 0)	//----
	{
		this.indices.push(this.position, this.position+1, this.position+2, this.position+3);
		this.center = this.position+1;
		this.standard= "normal";
	}else if(this.shapeType ===1)// _|_
	{
		this.center = this.position+1;
		this.indices.push(this.position, this.position+1, this.position+2, this.position+11);
		this.standard= "normal";
	}else if(this.shapeType===2) // --_
	{
		this.center = this.position+11;
		this.indices.push(this.position, this.position+1, this.position+11, this.position+12);
		this.standard= "normal";
	}else if(this.shapeType===3) // _--
	{
		this.center = this.position+11;
		this.indices.push(this.position+10, this.position+11, this.position+1, this.position+2);
		this.standard= "normal";
	}else if(this.shapeType===4) // ||
	{
		this.center = this.position;
		this.indices.push(this.position, this.position+1, this.position+10, this.position+11);
		this.standard= "normal";
	}else if(this.shapeType ===5) //|___
	{
		this.center = this.position+11;
		this.indices.push(this.position, this.position+10, this.position+11, this.position+12);
		this.standard= "normal";
	}else if(this.shapeType ===6)
	{
		this.center = this.position+1;
		this.indices.push(this.position+10, this.position, this.position+1, this.position+2);
		this.standard= "normal";
	}
}
