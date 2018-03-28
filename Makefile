server:
	@`npm bin`/light-server -s . -w index.html -w css/**/simple.css  -w Fig/* -w js/*  -w css/custom.css  -w css/reveal.css

pdf:
	@`npm bin`/decktape http://0.0.0.0:4000/\?fragments=true output.pdf -s 1920x1080 -p 2000
