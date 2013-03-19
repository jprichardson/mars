Node.js - mars
================

Tag steps in your code and navigate to them using Git.


Why?
----

Live coding demos can sometimes suck for noob-presenters. This makes it a lot better. Code up your demo. Tag spots that you want to show off. Let Mars checkout each one in sequential order when presenting.


Requirements
------------

You need NPM, Node.js, and Git installed. Fortunately, Node.js includes NPM. You can download Node.js for your platform here: http://nodejs.org/download/


Installation
------------

    npm install -g mars



How
---

Mars works by leveraging the power of Git tags and Git's checkout functionality. What you need to do is build your demo and at commit points that you want to demo, simply execute `mars-tag`.



Example
--------

Let's pretend that you want to show a group how Node.js work. Let's say that they are a completely new to programming. You thought that maybe you would create a demo that would print to the console, use a function to compute the sum of two numbers, and then require a module. You don't want to get to advanced just yet.

Assuming that Node.js, Git, and Mars are installed...


### setup demo package, tag step 0

let's go to a tmp directory:

    cd /tmp

create a tmp dir:

    mkdir testmars && cd testmars

create an empty js file:

    touch app.js

put some content in it:

    echo "console.log('hello world');" > app.js

commit it: 

    git init && git add . && git commit -m "hello world"

tag it with Mars:

    mars-tag

now get an overview:

    mars-overview

...outputs:

```
┌────┬──────┬──────────┬────────────────────────────────────────────────────────────┬──────────────────────────────┐
│ ^  │ #    │ commit   │ desc                                                       │ date                         │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ => │ 0    │ abc5a40  │ hello world                                                │ 2013-03-19 00:59:46 -0500    │
└────┴──────┴──────────┴────────────────────────────────────────────────────────────┴──────────────────────────────┘
```

Notice the `=>`? This indicates your current step in your presentation.


### create another step 1

OK, you've demonstrated how to print `hello world` to the console. Now you want to demonstrate functions:

modify app.js to contain the following:

```js
function sum(x, y) {
  return x + y;
}

console.log("The sum of 3 + 4 is %d", sum(3,4));

```

commit changes:

    git commit -am "demonstrating sum function"

tag it:

    mars-tag

get an overview:

    mars-overview

...outputs:

```
┌────┬──────┬──────────┬────────────────────────────────────────────────────────────┬──────────────────────────────┐
│ ^  │ #    │ commit   │ desc                                                       │ date                         │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│    │ 0    │ abc5a40  │ hello world                                                │ 2013-03-19 00:59:46 -0500    │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ => │ 1    │ 105b0ac  │ demonstrating sum function                                 │ 2013-03-19 09:46:54 -0500    │
└────┴──────┴──────────┴────────────────────────────────────────────────────────────┴──────────────────────────────┘
```


### create the last step 2

Now you want to demonstrate to how to use a function from a module:

create the new file:

    touch sum.js

modify `sum.js` to look like this:

```js
module.exports = function sum(x, y) {
  return x + y;
}
```

modify `app.js` to look like this:

```js
var sum = require('./sum')

console.log("The sum of 3 + 4 is %d", sum(3,4));

```

commit it:

    git add . && git commit -am "added a module"

tag it:

    mars-tag

get an overview if you like:

    mars-overview

...outputs:

```
┌────┬──────┬──────────┬────────────────────────────────────────────────────────────┬──────────────────────────────┐
│ ^  │ #    │ commit   │ desc                                                       │ date                         │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│    │ 0    │ abc5a40  │ hello world                                                │ 2013-03-19 00:59:46 -0500    │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│    │ 1    │ 105b0ac  │ demonstrating sum function                                 │ 2013-03-19 09:46:54 -0500    │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ => │ 2    │ b4b159b  │ added a module                                             │ 2013-03-19 09:50:46 -0500    │
└────┴──────┴──────────┴────────────────────────────────────────────────────────────┴──────────────────────────────┘
```


### demo time

Now you're ready to show off your demo.

let's go to the start

    mars-start

**Note:** You should modify your bash shell to show your current git branch, or download [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh). When you run `mars-start`, you'll notice that your shell display changes from:

    testmars git:(master)

to

    testmars git:(demo/0-hello-world)

When you ran `mars-start`, it created a new git branch named **demo/0-hello-world**. Notice how `app.js` is back to its original state?

get an overview if you like:

    mars-overview

...outputs:

```
┌────┬──────┬──────────┬────────────────────────────────────────────────────────────┬──────────────────────────────┐
│ ^  │ #    │ commit   │ desc                                                       │ date                         │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│ => │ 0    │ abc5a40  │ hello world                                                │ 2013-03-19 00:59:46 -0500    │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│    │ 1    │ 105b0ac  │ demonstrating sum function                                 │ 2013-03-19 09:46:54 -0500    │
├────┼──────┼──────────┼────────────────────────────────────────────────────────────┼──────────────────────────────┤
│    │ 2    │ b4b159b  │ added a module                                             │ 2013-03-19 09:50:46 -0500    │
└────┴──────┴──────────┴────────────────────────────────────────────────────────────┴──────────────────────────────┘
```

Notice that the `=>` is at step 0 now?

Now you can run the following commands:

- `mars-next`: go to the next step
- `mars-last`: go to the last step
- `mars-prev`: go to the previous step
- `mars-goto [n]`: go to the nth step

You can also run `mars-kbserver` and then press the `[right arrow]`, `[left arrow]`, `l`, `s`, or type in a number and press `[enter]` to navigate through your demo. Mars will create and clean up branches as needed.


Todo
----

Create a Sublime Text 2 plugin to highlight the lines to easily visibly see what changed. 


Presentations / Demos Using Mars
--------------------------------

I'll be uploading my video soon. If you use it, send me a link, and I'll add it here.


License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>


