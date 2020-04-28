#!/bin/bash

for i in *.tex ; do FILE=`basename $i .tex` ; pdflatex $FILE ; bibtex $FILE ; pdflatex $FILE ; pdflatex $FILE ; done 
rm -f *.ps *.dvi *.out *.log *.lof *.lot *.toc *.aux *.bbl *.blg *.pyg
