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


### setup demo package

Let's go to a tmp directory:

    cd /tmp

Create an empty js file:

    touch app.js

Put some content in it:

    echo "console.log('hello world');" > app.js

Commit it: 

    git init && git add . && git commit -m "hello world"

Tag it with Mars:

    mars-tag



License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>


