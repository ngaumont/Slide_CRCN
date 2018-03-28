# Slide_CRCN

A version of the slides is hosted [here](https://ksadorf.github.io/Slide_CRCN/index.html#/)

## Dependencies

These slides use reveal.js, d3 and the reveald3 plugin.  
They are inside lib and plugin to have self-contained webpage.

## Local server and pdf version

To test your presentation, you may want to have a local web server.  
I used ```light-server```from node.js to have live reload of the changes made to some files (index.html, css and js).  
It's also helpful to create pdf version of you presentation with [decktape](https://github.com/astefanutti/decktape).

To install these dependencies:

```
npm install decktape light-server
```

There is a small makefile to launch the local server (`` make server``) with some parameter and also print the pdf correctly (`` make pdf``).


## Tweaks used

In order to make everything working, I used some tweaks that I find non standard:  

  - My presentation is intended to be shown on ``1920x1080`` definition.
  - All the transition last 2 seconds so that the export pdf just have to wait for 2s before printing the result.
  - Some d3 viz are either plain svg loaded inside d3 and the transition handled manually inside ``custom.js`` or standalone viz handled by the reveald3 plugin (including backward animation)
  - I use the ``simple.css`` theme but tweaked it a bit in addition to the ``custom.css`` file.
  - I added some css class like ``appear`` and ``tohide`` to have something similar to the command \\only<>{} in beamer.
