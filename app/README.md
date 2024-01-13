# APP
    Add description here.

## Getting Started
    Here we use GetX for state management and we used MVC architecture.
    Flutter version: 3.7.6
    Dart version: 2.19.3 • DevTools 2.20.1

### Activate get_cli using following commands:
    flutter pub global activate get_cli
    dart pub global activate get_cli
    export PATH="$PATH":"$HOME/.pub-cache/bin"

### To create a new page using get_cli, you can run
    get create page:<page_name>

### To create a sub pages:
    get create page:<page_name> on <main_page_name>

### For generate the model class from build generator and freeze:
    flutter pub run build_runner build --delete-conflicting-outputs

### Branch structure:
    - master (only for production)
    - develop (only for development)
    - feature/<feature_name> (always be rebase from develop)
    - bug/<bug_name> (always be rebase from develop)

### Commit message structure:
    - git status (to see the changes)
    - git add -A (to add the changes)
    - git commit -m "commit message" example: "update login UI" (to commit the changes)
    - git push origin <branch_name> (to push the changes)


### Before commit the code:
     - dart format lib
     - flutter analyze
     - flutter test

### Coding standards and guidelines:
    * Meaningful and understandable variable names help anyone to understand the reason for using it.
    * Local variables should be named using camel case lettering starting with small letters (e.g. localData) whereas Global variables names should start with a capital letter (e.g. GlobalData). Constant names should be formed using capital letters only (e.g. CONSDATA).
    * It is better to avoid the use of digits in variable names.
    * The names of the function should be written in camel case starting with small letters.
    * The name of the function must describe the reason for using the function clearly and briefly.
    * Proper indentation is very important to increase the readability of the code. For making the code readable, programmers should use White spaces properly. Some of the spacing conventions are given below:
    * There must be a space after giving a comma between two function arguments.
    * Each nested block should be properly indented and spaced.
    * Proper Indentation should be there at the beginning and at the end of each block in the program.
    * All braces should start from a new line and the code following the end of braces also start from a new line.
    * All functions that encounter an error condition should either return a 0 or 1 for simplifying the debugging. 
    * Code should be easily understandable. The complex code makes maintenance and debugging difficult and expensive. 
    * The code should be properly commented for understanding easily. Comments regarding the statements increase the understandability of the code. 
    * Lengthy functions are very difficult to understand. That’s why functions should be small enough to carry out small work and lengthy functions should be broken into small ones for completing small tasks.