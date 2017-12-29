/*Maayan Jenny 
 */

//general settings
var ideateColor = [99, 75, 90, 255]
var smallText = [214, 113, 89, 255]
var numMessages 
var numCrosses 
var numViews 

var activeMode = true
var activities = [0, 1, 2]
var activityRate = 5
var activityCount = 0

var dotArray = [];
var numOfCol=6;
var numOfRow=6;
var sizeOfDot = 5;
var spaceBetweenDots = 40;
var dotColor = [77, 77, 77, 50]
var backgroundColor = [16, 19, 32, 255]
var margin = 100

//message settings
var messageSpeed = .75
var messageSize = spaceBetweenDots/2
var beamArray = [];
var beamColor = [249, 199, 201]
var numLinksInBeam = 5
var beams = []
var sizeOfBeam = messageSize
var numJumps = 2

//view settigns
var viewColor = [240, 105, 81, 255]
var viewMaxSize = spaceBetweenDots * 1.5
var viewThinStroke = 1.5
var viewRow = -1
var viewCol = -1
var viewSpeed = .95
var pause = 7
var views = []

var crosses = []
var crossColor = [241, 115, 172, 255]
var crossWidth = spaceBetweenDots/4
var crossSpeed = .9
var numLines = 2
var lineLength = spaceBetweenDots 


function setup() {
	frameRate(30)
	// preloadFonts()
	numMessages = round(random(100, 300))
	numCrosses = round(random(100, 300))
	numViews = round(random(100, 300))


    createCanvas(600, 400);
    strokeWeight(0)
    for(var r=0; r<numOfRow; r++){
    	for(var c=0; c<numOfCol; c++){
    		var xx = margin*2 + c*spaceBetweenDots;
    		var yy= margin + r*spaceBetweenDots;
    		if((r + c) % 2 == 0){
    			var testForMessage = true
    		}
    		if((r + c) %2 == 1){
    			var testForMessage = false
    		}
    		var aDot = new DotMaker(xx,yy,sizeOfDot, r,c, testForMessage);
    		dotArray.push(aDot);
    	}
    }
}

function draw() {
	print(activityCount)

	background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);//background(r,g,b, alpha); alpha is opacity


	if(activeMode){
		activityCount += 1
		if(activityCount >= activityRate){
			activityCount = 0
			index = round(random(activities.length -1))
			activeModeOn(index)
		}


	}

	for (var i=0; i<dotArray.length; i++){
		dotArray[i].draw(i);
	}

	if(beams.length > 0){
		for(k = 0; k < beams.length; k++){
			beams[k].move()
			beams[k].draw()


			if(beams[k].fillStatus == 2){
				beams.splice(k, 1)
			}
			// print(beams)
		}
	}

	if(crosses.length > 0){
		for(k = 0; k < crosses.length; k++){
			crosses[k].upDateLines()
			crosses[k].drawLines()

			if(round(crosses[k].linesCurrent[0]) == round(crosses[k].linesEnd)&&
			crosses[k].lineStatus == 2){
				crosses.splice(k,1)
			}		
		}
	}


	if(views.length > 0){3
		for(k = 0; k < views.length; k++){
			views[k].setDimensions()
			views[k].draw()

			if(views[k].viewStatus == 2 && 
				round(views[k].currentStroke) == round(views[k].baseLineStroke)){
				views.splice(k,1)
		
			}
		}

	}
	
}

function activeModeOn(index){
	if(index == 0){
		numMessages += 1
		startBeamIndex = round(random(0, dotArray.length -1))
		startingDotX = dotArray[startBeamIndex].x
		startingDotY = dotArray[startBeamIndex].y
		endBeamIndex = round(random(0, dotArray.length -1)) 
		endX = dotArray[endBeamIndex].x
		endY = dotArray[endBeamIndex].y

		while(endX == startingDotX || endY == startingDotY || 
				dotArray[endBeamIndex].testForMessage != dotArray[startBeamIndex].testForMessage){
				endBeamIndex = round(random(0, dotArray.length - 1))
				endX = dotArray[endBeamIndex].x
				endY = dotArray[endBeamIndex].y
		}
		newBeam = new beamMaker(startingDotX, startingDotY, endX, endY, startBeamIndex, endBeamIndex)
		newBeam.create()
		beams.push(newBeam)
		lastBeam = beams.length - 1

	}else if(index == 1){
		numViews += 1
		posInDotArray = round(random(0, dotArray.length -1))
		newView = new viewMaker(posInDotArray)
		views.push(newView)

	}else if(index == 2){
		numCrosses += 1
		posInDotArray = round(random(0, dotArray.length -1))


		newCross = new crossMaker(posInDotArray)
		crosses.push(newCross)
	}
}

function mousePressed(){
	// if(activeMode){
	// 	activeMode = false
	// }else{
	// 	activeMode = true
	// }
}


function crossMaker(posInDotArray){
	this.originX = dotArray[posInDotArray].x
	this.originY = dotArray[posInDotArray].y
	this.dirs = [[ -1, 'vert'], [1, 'horiz'], [-1, 'horiz'], [1,'vert']]
	this.direction = this.dirs[round(random(0, this.dirs.length -1))]
	this.lineStatus = 1
	this.linesConstant = []
	this.linesStart = null
	this.linesEnd = null
	this.linesCurrent = null
	for(lineInd = 0; lineInd < numLines; lineInd ++){
		if(this.direction[1] == 'vert'){
			this.linesConstant.push(this.originX +lineInd * spaceBetweenDots)
			this.linesStart = this.originY
			this.linesEnd = this.originY + lineLength * this.direction[0]
			this.linesCurrent = [this.originY, this.originY]
		}
		if(this.direction[1] == 'horiz'){
			this.linesConstant.push(this.originY + lineInd * spaceBetweenDots)
			this.linesStart = this.originX
			this.linesEnd = this.originX + lineLength * this.direction[0]
			this.linesCurrent = [this.originX, this.originX]
		}

	}

	this.upDateLines = function(){



			if(this.lineStatus == 1){
				this.linesCurrent[1] = this.linesCurrent[1] * crossSpeed + this.linesEnd * (1- crossSpeed)
			}

			if(round(this.linesCurrent[1]) == round(this.linesEnd)){
				this.lineStatus = 2
			}

			if(this.lineStatus == 2){
				this.linesCurrent[0] = this.linesCurrent[0] * crossSpeed + this.linesEnd * (1- crossSpeed)
			}
		
	}

	this.drawLines = function(){

		colorConverter = map(abs(this.linesCurrent[0] - this.linesEnd),
			0, lineLength, 0, 1)
		stroke(crossColor[0] * colorConverter + dotColor[0] *(1- colorConverter),
			crossColor[1] * colorConverter + dotColor[1] *(1- colorConverter),
			crossColor[2] * colorConverter + dotColor[2] *(1- colorConverter),
			crossColor[3] * colorConverter + 0 *(1- colorConverter))

		strokeCap(ROUND);
		strokeWeight(crossWidth)
		// stroke(crossColor[0], crossColor[1], crossColor[2])

		for(i = 0; i < numLines; i ++){
			if(this.direction[1] == 'vert'){
				line(this.linesConstant[i], this.linesCurrent[0], this.linesConstant[i], this.linesCurrent[1])
			}else if(this.direction[1] == 'horiz'){
				line(this.linesCurrent[0], this.linesConstant[i], this.linesCurrent[1], this.linesConstant[i])
			}
		}		

	} 

}

function viewMaker(posInDotArray){
	this.posInDotArray = posInDotArray
	this.xLoc = dotArray[this.posInDotArray].x
	this.yLoc = dotArray[this.posInDotArray].y
	this.baseLineStroke = sizeOfDot
	this.baseLineSize = 0
	this.currentSize = this.baseLineSize
	this.viewStatus = 1
	this.currentStroke = this.baseLineStroke
	this.pauseCount = 0


	this.setDimensions = function(){

		if(this.viewStatus == 1){
			this.currentStroke = this.currentStroke*viewSpeed + viewThinStroke*(1-viewSpeed)

			this.currentSize = this.currentSize*viewSpeed + viewMaxSize*(1-viewSpeed)

		}else if(this.viewStatus == 2){
			this.currentStroke = this.currentStroke*viewSpeed + this.baseLineStroke*(1-viewSpeed)
			this.currentSize = this.currentSize*viewSpeed + (this.baseLineSize)*(1-viewSpeed )
		}

		stroke(viewColor[0], viewColor[1], viewColor[2])
		strokeWeight(this.currentStroke)

		colorFactor = this.currentStroke
		colorFactor = map(this.currentStroke,this.baseLineStroke, viewThinStroke, 0, 2)
			stroke(viewColor[0] * colorFactor + dotColor[0] *(1- colorFactor),
				viewColor[1] * colorFactor + dotColor[1] *(1- colorFactor),
				viewColor[2] * colorFactor + dotColor[2] *(1- colorFactor),
				viewColor[3] * colorFactor + 0 *(1- colorFactor))


		fill(backgroundColor[0], backgroundColor[1], backgroundColor[2], 0)

		if(this.viewStatus == 1 && 
			round(this.currentStroke) == round(viewThinStroke )){
				this.viewStatus = 0
		}
		if(this.viewStatus == 0){
			this.pauseCount += 1
		}
		if(this.pauseCount == pause){
			this.viewStatus = 2
		}


	}

	this.draw = function(){

		sizeToDraw = this.currentSize
		if(dotArray[this.posInDotArray].size > sizeToDraw){
			sizeToDraw = dotArray[this.posInDotArray].size
		}

		ellipse(this.xLoc, this.yLoc, sizeToDraw, sizeToDraw)

	}
}

function beamMaker(startingDotX, startingDotY, endX, endY, startBeamIndex, endBeamIndex){
	this.startx = startingDotX;
	this.starty = startingDotY;
	this.endX = endX
	this.endY = endY
	this.listOfLinks = []
	this.newPosX = this.startx
	this.newPosY = this.starty
	this.tempTargetX = this.startx
	this.tempTargetY = this.starty
	this.forBiddenDir = []
	this.dirs = [[-1, -1, 'diag1'], [1, -1, 'diag2'],
				 [-1, 1, 'diag2'], [1, 1, 'diag1']]
	this.highlightedDots = [startBeamIndex]
	this.counter = 0
	this.done = false
	this.fillStatus = 1
	this.fillValue = 1
	this.sizeToDraw = messageSize
	this.create = function(){
		for(i = 0; i < numLinksInBeam; i++){
			newLink = new beamLinkMaker(this.startx, this.starty, sizeOfBeam)
			this.listOfLinks.push(newLink)
		}
	}
	this.draw = function(){
		// print(this.highlightedDots)
		for(j = 0;j < this.highlightedDots.length; j++){
			selectedDot = this.highlightedDots[j]

				// if(this.fillStatus == 1){
				// 	fill(beamColor[0], beamColor[1], beamColor[2], beamColor[3])
				// }else{
				// 	fill(beamColor[0], beamColor[1], beamColor[2], 0)
				// 	this.sizeToDraw  = this.sizeToDraw * .9 + 0 * .1

				// 	this.fillValue = this.fillValue *.9999 + 0 * .0001
				// 	fill(beamColor[0] * this.fillValue + dotColor[0] *(1- this.fillValue),
				// 		beamColor[1] * this.fillValue + dotColor[1] *(1- this.fillValue),
				// 		beamColor[2] * this.fillValue + dotColor[2] *(1- this.fillValue),
				// 		beamColor[3] * this.fillValue + 0*(1- this.fillValue))
				// }
				// print(this.fillValue)
				


				for(i = 0; i < this.listOfLinks.length; i++){
					if(i != this.listOfLinks.length -1 && this.fillStatus ==1){
					fill(beamColor[0], beamColor[1], beamColor[2], 75 *i)						
					} else if(this.fillStatus == 3){

				colorConverter = map(abs(this.newPosX - this.tempTargetX),
					0, spaceBetweenDots, 0, 1)
				fill(beamColor[0] * colorConverter + dotColor[0] *(1- colorConverter),
					beamColor[1] * colorConverter + dotColor[1] *(1- colorConverter),
					beamColor[2] * colorConverter + dotColor[2] *(1- colorConverter),
					100 * colorConverter + 0 *(1- colorConverter))
				// print(colorConverter)
						// 		this.newPosX = this.listOfLinks[headOfLink].posX * messageSpeed + this.tempTargetX * (1- messageSpeed )
						// this.newPosY = this.listOfLinks[headOfLink].posY * messageSpeed + this.tempTargetY * (1 - messageSpeed)

					}
					this.listOfLinks[i].draw()
				}
				// print(this.fillStatus)


				


				ellipse(dotArray[selectedDot].x, dotArray[selectedDot].y, this.sizeToDraw, this.sizeToDraw)

				if(this.highlightedDots.length > 1){
					this.highlightedDots.shift()
				}
		
		}
		

		if(round(this.listOfLinks[0].posX) == this.endX && 
				round(this.listOfLinks[0].posY) == this.endY){
				this.fillStatus = 2
		}if(this.done){
				this.fillStatus = 2
		}

	}

	this.setFirstDirection = function(headOfLink){
			if(this.startx < this.endX && this.starty < this.endY){
				this.tempDir = 3
				this.forbiddenDir = 0
			}else if(this.startx < this.endX && this.starty > this.endY){
				this.tempDir = 1
				this.forbiddenDir = 2
			}else if(this.startx > this.endX && this.starty > this.endY){
				this.tempDir = 0
				this.forbiddenDir = 3
			}else{
				this.tempDir = 2
				this.forbiddenDir = 1
			}
			this.tempTargetX = this.listOfLinks[headOfLink].posX + this.dirs[this.tempDir][0] * spaceBetweenDots
			this.tempTargetY = this.listOfLinks[headOfLink].posY + this.dirs[this.tempDir][1]* spaceBetweenDots

			for(i = 0; i < dotArray.length; i++){
				if(round(this.tempTargetX) == round(dotArray[i].x) &&
					round(this.tempTargetY) == round(dotArray[i].y)){
					this.highlightedDots.push(i)
				}
			}



	}

	this.setNextDirection = function(headOfLink){
		this.counter += 1
		if(this.counter > numJumps){
			this.done = true
		}
		if(this.done == true){
			return
		}
		if(this.counter == numJumps){
			this.fillStatus = 3
		}
		possibleDirs = []
		for(testDir = 0; testDir < this.dirs.length; testDir++){
			if(testDir != this.forbiddenDir &&
				this.dirs[testDir][2] != this.dirs[this.tempDir][2] &&
				this.tempDir != testDir){
				possibleDirs.push(this.dirs[testDir])
			}
		}
		if(possibleDirs.length == 2){
			tempX0 = this.listOfLinks[headOfLink].posX + possibleDirs[0][0] * spaceBetweenDots
			tempY0 = this.listOfLinks[headOfLink].posY + possibleDirs[0][1] * spaceBetweenDots
			tempX1 = this.listOfLinks[headOfLink].posX + possibleDirs[1][0] * spaceBetweenDots
			tempY1 = this.listOfLinks[headOfLink].posY + possibleDirs[1][1] * spaceBetweenDots
			dist0 = getDistance(tempX0, tempY0, endX, endY)
			dist1 = getDistance(tempX1, tempY1, endX, endY)
			if(tempX0 == endX && tempY0 == endY){
				tempTempDir = 0
			}else if(tempX1 == endX && tempY1 == endY){
				tempTempDir = 1
			}else if(dist0 < dist1){
				tempTempDir = 0
			}else{
				tempTempDir = 1
			}
		}else{
			tempTempDir = 0
		}


		for(testDir = 0; testDir < this.dirs.length; testDir++){
			if(possibleDirs[tempTempDir] == this.dirs[testDir]){
				this.tempDir = testDir
			}
		}

		this.tempTargetX = this.listOfLinks[headOfLink].posX + this.dirs[this.tempDir][0] * spaceBetweenDots
		this.tempTargetY = this.listOfLinks[headOfLink].posY + this.dirs[this.tempDir][1]* spaceBetweenDots

		for(i = 0; i < dotArray.length; i++){
			if(round(this.tempTargetX) == round(dotArray[i].x) &&
				round(this.tempTargetY) == round(dotArray[i].y)){
				this.highlightedDots.push(i)
			}
		}
	}

	this.move = function(){

		headOfLink = this.listOfLinks.length - 1
		this.newPosX = this.listOfLinks[headOfLink].posX * messageSpeed + this.tempTargetX * (1- messageSpeed )
		this.newPosY = this.listOfLinks[headOfLink].posY * messageSpeed + this.tempTargetY * (1 - messageSpeed)
		newLink = new beamLinkMaker(this.newPosX, this.newPosY, sizeOfBeam)
		this.listOfLinks.push(newLink)
		this.listOfLinks.shift()

		if(this.tempTargetX == this.startx && this.tempTargetY == this.starty){
			this.setFirstDirection(headOfLink)
		}
		if(round(this.newPosX) == round(this.endX) && 
			round(this.newPosY) == round(this.endY)){

		}else if(round(this.newPosX) == round(this.tempTargetX) && 
			round(this.newPosY) == round(this.tempTargetY)){
			
			this.setNextDirection(headOfLink)

		}


	}
}

function beamLinkMaker(posX, posY, size){
	this.posX = posX
	this.posY = posY
	this.size = size
	this.draw = function(){
		strokeWeight(0)
		linkSize = this.size - ((this.size/numLinksInBeam) * (numLinksInBeam- i))/2
		// fill(beamColor[0], beamColor[1], beamColor[2])
		ellipse(this.posX, this.posY, linkSize, linkSize)
	}
}

function getDistance(x0, y0, x1, y1){
	return sqrt((x1 - x0)**2 + (y1 - y0)**2)
}

function DotMaker(xx,yy,sizeOfDot,r,c, testForMessage, targetX, targetY){
	this.testForMessage = testForMessage
	this.x = xx;
	this.y = yy;
	this.row = r;
	this.column = c;
	this.size = sizeOfDot;
	this.color = dotColor;

	this.draw = function(i){
		sizeToDraw = this.size
		fill(dotColor[0], dotColor[1], dotColor[2], dotColor[3])

		ellipse(this.x, this.y, sizeToDraw, sizeToDraw)


		fill(this.color);

		strokeWeight(0)
		ellipse(this.x, this.y, sizeToDraw, sizeToDraw)

	}

}
