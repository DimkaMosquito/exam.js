function Translator() {
    'use strict';
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    var self = this;
    self._currentID = 0;
}

Translator.prototype._getNextID = function() {
    var self = this;
    return 'examjs_id_' + (++self._currentID);
};

Translator.prototype._createTextInput = function(inputObject){
	var self = this;
	var id = self._getNextID();
	var result = "<input type=\'text\' id=\'" + id +"\'></input>";

	return result;
};

Translator.prototype._createListBox = function(listObject) {
    var self = this;
    var id = self._getNextID();
    var result = '<input list="' + id + '">';
    result += '<datalist id="' + id + '">';

    listObject.items.forEach(function(item) {
        result += '<option value="' + item + '">';
    });
    result += '</datalist>';

    return result;
};

Translator.prototype._convertAllObjects = function(objects) {
    var self = this;
    var result = [];
    objects.forEach(function(object) {
        if (object instanceof List) {
            result.push({
                source: object.syntaxBlock,
                result: self._createListBox(object)
            });
        }else{
        	if(object instanceof TextInput){
        		result.push({
        			source: object.syntaxBlock,
        			result: self._createTextInput(object)
        		});
        	}else {
            	throw new Error('Converting error. Translator cannot convert object that was passed into it');
        	}
        }
    });

    return result;
};
