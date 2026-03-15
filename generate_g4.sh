#!/bin/sh
cd src/antlr

npx antlr-ng -Dlanguage=TypeScript -visitor bnf.g4

cd ../..

echo "You must add 'type' in between 'import' and the first '{' in the src/antlr/bnfListener.ts file"
echo "It should go from this: 'import {ErrorNode, Par...' to this: 'import type {ErrorNode, Par...'"
