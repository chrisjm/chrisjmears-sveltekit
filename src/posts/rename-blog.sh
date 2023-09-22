#!/bin/bash

for dir in blog/*/
do
    dir=${dir%*/}
    file=${dir##*/}
    cp "$dir/index.md" "blog/$file.md"
done
