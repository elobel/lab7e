// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript

/**
 * Your thoughtful comment here.
 */

class Stack{
  constructor(size, stackElements) {
    this.size = size;
    this.stackElements = [];
  }

  push(object){
    this.stackElements[this.size] = object;
    this.size++;
  }

  pop(){
    if(this.size === 0){
      return undefined;
    } else {
      var popped = this.stackElements[this.size];
      delete this.stackElements[this.size];
      return popped;
    }
  }

  getStackElements(){
    return this.stackElements;
  }

  getSize(){
    return this.size;
  }
}

class ObservableStack extends Stack {
  constructor(size, stackElements, observers){
    super();
    this.size = size;
    this.stackElements = [];
    this.observers = [];
  }

  registerObserver(observer){
    this.observers.push(observer);
  }

  push(object){
    this.stackElements[this.size] = object;
    this.size++;
    for(var i = 0; i < this.observers.length; i++ ){
      function func () { this.observers[i](this.stackElements); }
      func();
    }
  }

  pop(){
    if(this.size === 0){
      return undefined;
    } else {
      var popped = this.stackElements[this.size];
      delete this.stackElements[this.size];
      return popped;
    }
    for(var i = 0; i < this.observers.length; i++ ){
      function func() { this.observers[i](this.stackElements); }
      func();
    }
  }

  getStackElements(){
    return this.stackElements;
  }


}


// functions begin
function addNums(stack){
  var x = stack.pop();
  var y = stack.pop();
  var z = x + y;
  stack.push(z);
}

function subtractNums(stack){
  var x = stack.pop();
  var y = stack.pop();
  var z = x - y;
  stack.push(z);
}

function multiplyNums(stack){
  var x = stack.pop();
  var y = stack.pop();
  var z = x * y;
  stack.push(z);
}

function divideNums(stack){
  var x = stack.pop();
  var y = stack.pop();
  var z = x/y;
  stack.push(z);
}

function nip(stack){
  var top = stack.pop();
  stack.pop();
  stack.push(top);
}

function swap(stack){
  var top = stack.pop();
  var second = stack.pop();
  stack.push(top);
  stack.push(second);
}

function over(stack){
  var top = stack.pop();
  stack.push(top);
  swap(stack);
  stack.push(top);
}

function lessThan(stack){
  var second = stack.pop();
  var first = stack.pop();
  if (second > first){
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

function greaterThan(stack){
  var second = stack.pop();
  var first = stack.pop();
  if(second < first){
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

function equalTo(stack){
  var second = stack.pop();
  var first = stack.pop();
  if (second == first){
    stack.push(-1);
  } else {
    stack.push(0);
  }
}
// functions end

//hash and key begin
var words = {};
words["+"] = addNums;
words["-"] = subtractNums;
words["*"] = multiplyNums;
words["/"] = divideNums;
words["nip"] = nip;
words["swap"] = swap;
words["over"] = over;
words["<"] = lessThan;
words[">"] = greaterThan;
words["="] = equalTo;

var userwords = {};
var userdefinedfunctions = 0;
var anotheruserdefined = 0;
var newestfunction = null;


function draw() {
  var canvas = document.getElementById('tutorial');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
  }
}


/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}

/**
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */


/**
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
var name;
/*function addnewbutton(stack, name, terminal){
  print(terminal, "addnewbutton");
  if(userdefinedfunctions > anotheruserdefined){
    print(terminal, "was bigger");
    anotheruserdefined++;

  }
}*/

//var stack = new ObservableStack();
//stack.registerObserver(renderStack(stack));
var stack = [];

function renderStack(stack) {
    $("#thestack").empty();
  //  stack.stackElements.slice().reverse().forEach(function(element) {
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};


function userprocess(stack, key, terminal){
  var str = userwords[key];
  process(stack, str, terminal);
}



function process(stack, input, terminal) {
    var startFunc = false;
    var getName = false;
    var userfunc = [];
    var ifclause = [];
    var ifhappening = false;
    var elseclause = [];
    var elsehappening = false;
    var inputs = input.trim().split(/ +/);
    for(var i = 0; i < inputs.length; i++) {
      if (!(isNaN(Number(inputs[i]))) && startFunc === false) {
          print(terminal,"pushing " + Number(inputs[i]));
          stack.push(Number(inputs[i]));
      } else if (inputs[i] === ".s" && startFunc === false) {
          print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
      } else if (inputs[i] == ":"){
          var getName = true;
          var name;
          //var userfunc = [];
      } else if (getName === true){
          name = inputs[i];
          getName = false;
          startFunc = true;
  //        print(terminal, "name gotten");
      } else if (startFunc === true && inputs[i] != ";") {
          userfunc.push(inputs[i]);
      //    print(terminal, "startfunc push to userfunc");
      } else if (inputs[i] == ";"){
          var str = userfunc.join(" ");
          userwords[name] = str;
          startFunc = false;
      //    print(terminal, ";");
          userdefinedfunctions++;
          var $button = $('<button/>').attr({
            type: "button", name: name , value: name
          });
          $button.text(name);
          $button.click(function(){
          process(stack,name,terminal);
          runRepl(terminal, stack);
        });
        $("#user-defined-funcs").append($button);

      } else if (inputs[i] == "if"){
        ifhappening = true;
      } else if (ifhappening === true && inputs[i] != "else"){
          ifclause.push(inputs[i]);
      } else if (inputs[i] == "else"){
        elsehappening = true;
        ifhappening = false;
      } else if (elsehappening === true && inputs[i] != "endif"){
        elseclause.push(inputs[i]);
      } else if (inputs[i] == "endif"){
        elsehappening = false;
        if(stack.pop() == 0){
          var str = elseclause.join(" ");
          userwords["else"] = str;
        } else {
          var str = ifclause.join(" ");
          userwords["if"] = str;
        }
      } else if (words.hasOwnProperty(inputs[i]) === true && startFunc === false) {
          words[inputs[i]](stack);
    //      print(terminal, "else if words");
      } else if (userwords.hasOwnProperty(inputs[i]) === true && startFunc === false) {
  //      print(terminal, "else if userwords");
        userprocess(stack, inputs[i], terminal);

      } else {
          print(terminal, ":-( Unrecognized input");
      }
    }
  //  print(terminal, "end of process");
    renderStack(stack);
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        runRepl(terminal, stack);
    });
};

// Whenever the page is finished loading, call this function.
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
  renderStack(stack);
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

//    var stack = [];
    var resetButton = $("#reset"); // resetButton now references
    $("#reset").click(function() {
        while(stack.length > 0) {
            stack.pop();
          }
          renderStack(stack);
        }
      );
    renderStack(stack);






                                // the HTML button with ID "reset"


    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
});
