function NumberFormatString(str, dec) {
    var _removeAllExistCharacter = function (value, character) {
        while (value.indexOf(character) >= 0) {
            value = value.replace(character, "");
        }
        return value;
    };
    var value = str + "";
    if (value == "0") return "0";
    
    while (value.indexOf(",") >= 0) {
        value = _removeAllExistCharacter(value, ",");//value.replace(",", "");
    }
    var strFormated = parseFloat(value).formatMoney(dec, ".", ",");
    while ((strFormated.substr(strFormated.length - 1, 1) == "0" && strFormated.indexOf(".") >= 0) || strFormated.substr(strFormated.length - 1, 1) == ".") {
        strFormated = strFormated.substr(0, strFormated.length - 1);
    }
    
    //set formated value
    return strFormated;
}