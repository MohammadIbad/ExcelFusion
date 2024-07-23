//grid_container
let topRow = document.querySelector(".top_row");
let leftCol = document.querySelector(".left_col");
let grid = document.querySelector(".grid");

//formula_bar
let addressInput = document.querySelector(".address_input");
let formulaInput = document.querySelector(".formula_input");

//menu_bar
let fontSizeInput = document.querySelector(".font_size_input");
let fontFamilyInput = document.querySelector(".font_family_input");
let boldIcon = document.querySelector(".fa-bold");
let underlineIcon = document.querySelector(".fa-underline");
let italicIcon = document.querySelector(".fa-italic");
let alignmentContainer = document.querySelector(".alignment_container");
let textColorHInput = document.querySelector(".text_color");
let textColorInput = document.querySelector(".fa-tint");
let backgroundHInput = document.querySelector(".background_color");
let backgroundInput = document.querySelector(".fa-fill-drip");

//sheets_container
let createSheetIcon = document.querySelector(".fa-plus");
let sheetList = document.querySelector(".sheets-list");
let firstSheet = document.querySelector(".sheet");

//Grid & Sheets

for(let i = 0 ; i < 26 ; i++){
    let div = document.createElement("div");
    div.setAttribute("class" , "cell");
    div.textContent = String.fromCharCode(65 + i);
    topRow.appendChild(div);
}
for(let i = 1 ; i <= 100 ; i++){
    let div = document.createElement("div");
    div.setAttribute("class" , "cell")
    div.textContent = i;
    leftCol.appendChild(div);
}
for(let i = 0 ; i < 100 ; i++){
    let row = document.createElement("div");
    row.setAttribute("class" , "row");
    for(let j = 0 ; j < 26 ; j++){
        let div = document.createElement("div");
        div.setAttribute("class" , "cell");
        div.setAttribute("contentEditable" , "true");
        div.setAttribute("rId" , i);
        div.setAttribute("cId" , j);
        row.appendChild(div);
    }
    grid.appendChild(row);
}

let sheetsDb = [];
function initDB(){
    let db = [];
    for(let i = 0 ; i < 100 ; i++){
        let rowArr = [];
        for(let j = 0 ; j < 26 ; j++){
            let cellObject = {
                color: "black",
                backgroundColor: "white",
                fontFamily: "'Courier New'",
                fontSize: 14,
                halign: "center",
                italic: false,
                underline: false,
                bold: false,
                value: "",
                formula: "",
                children: []
            }
            rowArr.push(cellObject);
        }
        db.push(rowArr);
    }
    sheetsDb.push(db);
}
initDB();

let db = sheetsDb[0];
let AllGridCells = document.querySelectorAll(".grid .cell");
for(let i = 0 ; i < AllGridCells.length ; i++){
    AllGridCells[i].addEventListener("click" , function(e){
        let prevAddress = addressInput.value;
        if(prevAddress != ""){
            let ridcidObj = getRidCidFromAddress(prevAddress);
            let prevCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
            prevCell.style.border = "0.1px solid gray";
            prevCell.style.borderRight = "none";
            prevCell.style.borderTop = "none";
        }
        let rid = AllGridCells[i].getAttribute("rId");
        let cid = AllGridCells[i].getAttribute("cId");
        rid = Number(rid);
        cid = Number(cid);
        addressInput.value = String.fromCharCode(cid + 65) + (rid + 1);
        let cCell = AllGridCells[i];
        cCell.style.border = "2px solid #1B9CFC";
        let cellObject = db[rid][cid];
        let fontSize = cellObject.fontSize;
        fontSizeInput.value = fontSize;
        boldIcon.classList.remove("selected");
        italicIcon.classList.remove("selected");
        underlineIcon.classList.remove("selected");
        let optionElements = alignmentContainer.children;
        for(let i = 0 ; i < optionElements.length ; i++){
            optionElements[i].classList.remove("selected");
        }
        if(cellObject.bold){
            boldIcon.classList.add("selected");
        }
        if(cellObject.italic){
            italicIcon.classList.add("selected");
        }
        if(cellObject.underline){
            underlineIcon.classList.add("selected");
        }
        if(cellObject.halign){
            for(let i = 0 ; i < optionElements.length ; i++){
                let elementClasses = optionElements[i].classList;
                let hAlignment = elementClasses[elementClasses.length - 1];
                if(hAlignment == cellObject.halign){
                    elementClasses.add("selected");
                } 
            }
        }
        formulaInput.value = cellObject.formula;
    });
}

let firstCell = document.querySelector(".grid .cell[rId='0'][cId='0']");
firstCell.click();
firstCell.focus();
function getRidCidFromAddress(address){
    let AsciiValue = address.charCodeAt(0);
    let cid = AsciiValue - 65;
    let rid = Number(address.substring(1)) - 1;
    return{
        rid: rid , cid: cid
    }
}

firstSheet.addEventListener("click" , function(e) {
    for(let i = 0 ; i < sheetList.children.length ; i++){
        sheetList.children[i].classList.remove("active-sheet");
    }
    firstSheet.classList.add("active-sheet");
    db = sheetsDb[0];
    setinitUI();
});

function setinitUI(){
    for(let i = 0 ; i < 100 ; i++){
        for(let j = 0 ; j < 26 ; j++){
            let cellObject = db[i][j];
            let tobeChangedCell = document.querySelector(`.grid .cell[rId='${i}'][cId='${j}']`);
            tobeChangedCell.innerText = cellObject.value;
            tobeChangedCell.style.color = cellObject.color;
            tobeChangedCell.style.backgroundColor = cellObject.backgroundColor;
            tobeChangedCell.style.fontFamily = cellObject.fontFamily;
            tobeChangedCell.style.textAlign = cellObject.halign;
            tobeChangedCell.style.textDecoration = cellObject.underline == false ? "none" : "underline";
            tobeChangedCell.style.fontStyle = cellObject.italic == false ? "normal" : "italic";
            tobeChangedCell.style.fontSize = cellObject.fontSize;
        }
    }
}

createSheetIcon.addEventListener("click" , sheetHandler);
function sheetHandler(){
    let noofChildren = sheetList.children.length;
    let newSheet = document.createElement("div");
    newSheet.setAttribute("class" , "sheet");
    newSheet.setAttribute("sheetIdx" , noofChildren);
    newSheet.textContent = `Sheet ${noofChildren + 1}`;
    sheetList.appendChild(newSheet);
    initDB();
    newSheet.addEventListener("click" , function() {
        for(let i = 0 ; i < sheetList.children.length ; i++){
            sheetList.children[i].classList.remove("active-sheet");
        }
        newSheet.classList.add("active-sheet");
        let idx = newSheet.getAttribute("sheetIdx");
        db = sheetsDb[idx];
        setinitUI();
    });
    newSheet.click();
}

//Menu Bar Functionality

textColorInput.addEventListener("click" , function(e) {
    textColorHInput.click();
});
textColorHInput.addEventListener("change" , function(e) {
    let color = textColorHInput.value;
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    tobeChangedCell.style.color = color;
    let { rid , cid } = getRidCidFromAddress(address);
    db[rid][cid].color = color;
});

backgroundInput.addEventListener("click" , function(e) {
    backgroundHInput.click();
});
backgroundHInput.addEventListener("change" , function(e) {
    let color = backgroundHInput.value;
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    tobeChangedCell.style.backgroundColor = color;
    let { rid , cid } = getRidCidFromAddress(address);
    db[rid][cid].backgroundColor = color;
});

fontSizeInput.addEventListener("change" , function() {
    let fontSize = fontSizeInput.value;
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    let { rid , cid } = getRidCidFromAddress(address);
    let cellObject = db[rid][cid];
    tobeChangedCell.style.fontSize = fontSize + "px";
    cellObject.fontSize = fontSize;
});

fontFamilyInput.addEventListener("change" , function() {
    let fontFamily = fontFamilyInput.value;
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    let { rid , cid } = getRidCidFromAddress(address);
    tobeChangedCell.style.fontFamily = fontFamily;
    let cellObject = db[rid][cid];
    cellObject.fontFamily = fontFamily;
});

boldIcon.addEventListener("click" , function() {
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    if(cellObject.bold){
        tobeChangedCell.style.fontWeight = "normal";
        boldIcon.classList.remove("selected");
        cellObject.bold = false;
    }
    else{
        tobeChangedCell.style.fontWeight = "bold";
        boldIcon.classList.add("selected");
        cellObject.bold = true;
    }
});

italicIcon.addEventListener("click" , function() {
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    if(cellObject.italic){
        tobeChangedCell.style.fontStyle = "normal";
        italicIcon.classList.remove("selected");
        cellObject.italic = false;
    }
    else{
        tobeChangedCell.style.fontStyle = "italic";
        italicIcon.classList.add("selected");
        cellObject.italic = true;
    }
});

underlineIcon.addEventListener("click" , function() {
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    if(cellObject.underline){
        tobeChangedCell.style.textDecoration = "none";
        underlineIcon.classList.remove("selected");
        cellObject.underline = false;
    }
    else{
        tobeChangedCell.style.textDecoration = "underline";
        underlineIcon.classList.add("selected");
        cellObject.underline = true;
    }
});

alignmentContainer.addEventListener("click" , function(e) {
    if(e.target != alignmentContainer){
        let classesArr = e.target.classList;
        let hAlignment = classesArr[classesArr.length - 1];
        let address = addressInput.value;
        let ridcidObj = getRidCidFromAddress(address);
        let tobeChangedCell = document.querySelector(`.grid .cell[rId='${ridcidObj.rid}'][cid='${ridcidObj.cid}']`);
        tobeChangedCell.style.textAlign = hAlignment;
        let optionElements = alignmentContainer.children;
        for(let i = 0 ; i < optionElements.length ; i++){
            optionElements[i].classList.remove("selected");
        }
        e.target.classList.add("selected");
        let cellObject = db[ridcidObj.rid][ridcidObj.cid];
        cellObject.halign = hAlignment;
    }
});

//Value & Formula

for(let i = 0 ; i < AllGridCells.length ; i++){
    AllGridCells[i].addEventListener("blur" , function cellHelper(e) {
        let content = AllGridCells[i].textContent;
        let address = addressInput.value;
        let { rid , cid } = getRidCidFromAddress(address);
        let cellObject = db[rid][cid];
        if(cellObject.value == content){
            return;
        }
        if(cellObject.formula){
            removeFormula(address , cellObject.formula);
            cellObject.formula = "";
        }
        setUI(content , rid , cid);
    });
}

formulaInput.addEventListener("keydown" , function(e) {
    if(e.key == "Enter" && formulaInput.value != ""){
        let cFormula = formulaInput.value;
        let addressOfTheCell = addressInput.value;
        let { rid , cid } = getRidCidFromAddress(addressOfTheCell);
        let cellObject = db[rid][cid];
        if(cellObject.formula != cFormula){
            removeFormula(addressOfTheCell , cellObject.formula);
        }
        let value = evaluateFormula(cFormula);
        setUI(value , rid , cid);
        cellObject.formula = cFormula;
        setFormula(addressOfTheCell , cFormula);
    }
});

function setFormula(address , formula){
    let formulaEntities = formula.split(" ");
    for(let i = 0 ; i < formulaEntities.length ; i++){
        let ascii = formulaEntities[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let parentrcObj = getRidCidFromAddress(formulaEntities[i]);
            let children = db[parentrcObj.rid][parentrcObj.cid].children;
            children.push(address);
        }
    }
}

function removeFormula(address , formula) {
    let formulaEntities = formula.split(" ");
    for(let i = 0 ; i < formulaEntities.length ; i++){
        let ascii = formulaEntities[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let parentrcObj = getRidCidFromAddress(formulaEntities[i]);
            let children = db[parentrcObj.rid][parentrcObj.cid].children;
            let idx = children.indexOf(address);
            children.splice(idx , 1);
        }
    }
}

function setUI(value , rid , cid) {
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${rid}'][cid='${cid}']`);
    tobeChangedCell.textContent = value;
    db[rid][cid].value = value;
    let childrenArr = db[rid][cid].children;
    for(let i = 0 ; i < childrenArr.length ; i++){
        let chriciobj = getRidCidFromAddress(childrenArr[i]);
        let chCellObj = db[chriciobj.rid][chriciobj.cid];
        let value = evaluateFormula(chCellObj.formula);
        setUI(value , chriciobj.rid , chriciobj.cid);
    }
}

function evaluateFormula(formula){
    let formulaEntities = formula.split(" ");
    for(let i = 0 ; i < formulaEntities.length ; i++){
        let ascii = formulaEntities[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let cellrcObj = getRidCidFromAddress(formulaEntities[i]);
            let value = db[cellrcObj.rid][cellrcObj.cid].value;
            formula = formula.replace(formulaEntities[i] , value);
        }
    }
    return evaluateInfix(formula);
}

function evaluateInfix(expression) {
    let values = [];
    let ops = [];
    for(let i = 0 ; i < expression.length ; i++){
        if(expression[i] == ' ') continue;
        if(expression[i] >= '0' && expression[i] <= '9'){
            let val = 0;
            while(i < expression.length && expression[i] >= '0' && expression[i] <= '9'){
                val = (val * 10) + (parseInt(expression[i]));
                i++;
            }
            values.push(val);
            i--
        }
        else if(expression[i] == '(') {
            ops.push(expression[i]);
        }
        else if(expression[i] == ')') {
            while(ops.length && ops[ops.length - 1] != '(') {
                let val2 = values.pop();
                let val1 = values.pop();
                let op = ops.pop();
                values.push(applyOperation(val1 , val2 , op));
            }
            ops.pop();
        }
        else{
            while(ops.length && precedence(ops[ops.length - 1]) >= precedence(expression[i])) {
                let val2 = values.pop();
                let val1 = values.pop();
                let op = ops.pop();
                values.push(applyOperation(val1 , val2 , op));
            }
            ops.push(expression[i]);
        }
    }
    while(ops.length){
        let val2 = values.pop();
        let val1 = values.pop();
        let op = ops.pop();
        values.push(applyOperation(val1 , val2 , op));
    }
    return values[0];
}

function precedence(op) {
    if(op == '+' || op == '-') return 1;
    if(op == '*' || op == '/') return 2;
    return 0;
}

function applyOperation(a , b , op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
}