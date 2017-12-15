// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript

/**
 * Your thoughtful comment here.
 */

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
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

/**
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */

function userprocess(stack, key, terminal){
  var str = userwords[key];
  process(stack, str, terminal);
}

function process(stack, input, terminal) {
    var startFunc = false;
    var getName = false;
    var userfunc = [];
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
      } else if (startFunc === true && inputs[i] != ";") {
          userfunc.push(inputs[i]);
      } else if (inputs[i] == ";"){
          var str = userfunc.join(" ");
          userwords[name] = str;
          startFunc = false;
      } else if (words.hasOwnProperty(inputs[i]) === true && startFunc === false) {
          words[inputs[i]](stack);
      } else if (userwords.hasOwnProperty(inputs[i]) === true && startFunc === false) {
          userprocess(stack, inputs[i], terminal);
      } else {
          print(terminal, ":-( Unrecognized input");
      }
    }
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
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = [];
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
