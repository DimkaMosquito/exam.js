function ParsingError(message) {
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

function List(items, rightAnswerIndex) {
    this.items = items;
    this.rightAnswerIndex = rightAnswerIndex;
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

Parser.prototype._parseSyntaxBlocks = function(text) {
    var self = this;
    var regexp = new RegExp(self._patterns.blockPattern);
    var result = text.match(regexp);

    return result;
};

Parser.prototype._extractList = function(syntaxBlock) {
    var self = this;

    function trim(text) {
        var result = text.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        return result;
    }
    var tmpResult = [];
    var content = syntaxBlock.replace(/(\{|\})+?/g, '').split(',').forEach(function(elem) {
        tmpResult.push(trim(elem));
    });

    var result = new List(tmpResult, 0);
    return result;
};

Parser.prototype._extractObjects = function(syntaxBlocks) {
    var self = this;
    var result = [];

    function isBlockEmpty(obj) {
        if (obj === self._patterns.emptyBlock) {
            return true;
        }
        return false;
    }

    syntaxBlocks.forEach(function(block) {
        if (!isBlockEmpty(block)) {
            //do something
        } else {
            throw new ParsingError('Cannot parse empty block: {{}}');
        }
    });
};
