function ParsingError(message) {
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

function List(items, rightAnswerIndex, syntaxBlock) {
    this.items = items;
    this.rightAnswerIndex = rightAnswerIndex;
    this.syntaxBlock = syntaxBlock;
}

function TextInput(rightAnswer, syntaxBlock){
	this.rightAnswer = rightAnswer;
	this.syntaxBlock = syntaxBlock;
}

function Parser() {
    'use strict';
    if (!(this instanceof Parser)) {
        return new Parser();
    }
    var self = this;
    self._patterns = {
        blockPattern: /\{\{(.|\n)*?\}\}/g,
        emptyBlock: '{{}}',
    };
}

Parser.prototype._getTypeBlock = function(block){
	var self = this;
	var textInputPattern = /\{\{\s*\.{3}\s*\|\s*.*/g;
	var regexp = new RegExp(textInputPattern);
	if(textInputPattern.test(block)){
		return "textInput";
	}else{
		return "list";
	}

};

Parser.prototype._extractTextInput = function(syntaxBlock){
	var self = this;

	function getRightAnswer(syntaxBlock){
		var firstVerticalSeparatorPosition = syntaxBlock.indexOf("|",0);
		var rightAnswer = syntaxBlock.substring(firstVerticalSeparatorPosition+1,syntaxBlock.length-2).trim();	

		return rightAnswer;
	}

	var result = new TextInput(getRightAnswer(syntaxBlock), syntaxBlock);

	return result;
};

Parser.prototype._parseSyntaxBlocks = function(text) {
    var self = this;
    var regexp = new RegExp(self._patterns.blockPattern);
    var result = text.match(regexp);

    return result;
};

Parser.prototype._indexOfRightAnswer = function(items){
    var self = this;
    var result = -1;
    items.forEach(function(item){
        if(item.indexOf('!') === 0 && item.lastIndexOf('!') === item.length - 1){
            result = items.indexOf(item);
        }
    });

    return result;
};

Parser.prototype._removeExclamationPoints = function(items){
    var self = this;
    var index = self._indexOfRightAnswer(items);
    if(index === -1){
        return items;
    }
    var tmpWord = items[index];
    var result = [];

    var resultWord = tmpWord.substring(1,tmpWord.length - 1);
    items.forEach(function(item){
        if(items.indexOf(item) === index){
            result.push(resultWord);
        } else {
            result.push(item);
        }
    });

    return result;
};

Parser.prototype._extractList = function(syntaxBlock) {
    var self = this;
    var tmpResult = [];

    function trim(text) {
        var result = text.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        return result;
    }

    try {
        syntaxBlock.replace(/(\{|\})+?/g, '').split(',').forEach(function(elem) {
            tmpResult.push(trim(elem));
        });
    } catch (e) {
        return null;
    }

    var result = new List(self._removeExclamationPoints(tmpResult), self._indexOfRightAnswer(tmpResult),syntaxBlock);
    return result;
};

Parser.prototype._extractObjects = function(syntaxBlocks) {
    var self = this;
    var result = [];
    if(syntaxBlocks === null){
        return result; 
    }

    function isBlockEmpty(obj) {
        if (obj === self._patterns.emptyBlock) {
            return true;
        }
        return false;
    }

    syntaxBlocks.forEach(function(block) {
        var tmpObj;
        if (!isBlockEmpty(block)) {
        	var typeBlock = self._getTypeBlock(block);
        	switch (typeBlock){
        		case 'textInput':{
        			tmpObj = self._extractTextInput(block);
        			break;
        		}
        		case 'list':{
        			tmpObj = self._extractList(block);
        			break;
        		}
        	}
            if(tmpObj !== null){
                result.push(tmpObj);
            }
        } else {
            throw new ParsingError('Cannot parse empty block: {{}}');
        }
    });

    return result;
};

Parser.prototype.parse = function(text){
    var self = this;
    if(typeof text !== 'string'){
        throw new ParsingError('Parser Error: into the parse() method was passed not a string parameter');
    }
    
    var result = self._extractObjects(self._parseSyntaxBlocks(text));
    return result;
};
