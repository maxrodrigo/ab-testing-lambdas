#!/usr/bin/env bash
shopt -s extglob

#===============================================================================
#        FILE:  build.sh
#
#       USAGE:  ./build.sh
#
# DESCRIPTION:  Update, sanitize and compress lambdas and bookmarklet.
#
#   ARGUMENTS:  ---
#       NOTES:  ---
#===============================================================================

build_folder='./dist';
build_jsonfile=$build_folder"/build.json"
config_file="./conf"

ph_substitute(){
  for k in "${!ph[@]}"; do
    v=${ph[$k]};
    sed -i "" -e "s#{$k}#$v#g" $1
  done
}

# define placeholders
declare -A ph; while read line; do ph[${line%:*}]=${line#*:}; done < $config_file

# RUN!
echo "***************************************"
for k in "${!ph[@]}"; do echo $k: ${ph[$k]}; done
echo "***************************************"

read -p "Confirm ? [y/N] " response
case ${response:0:1} in [yY][eE][sS]|[yY])
  mkdir -p $build_folder;

  echo "Processing files..."

  for jsf in ./code/*.js; do
    echo "> "$(basename $jsf);
    cp $jsf $build_folder;
    built_jsf=$build_folder/$(basename $jsf);
    ph_substitute $built_jsf;
  done

  func_min=$(curl -X POST -s --data-urlencode "input@$build_folder/bookmarklet.js" https://javascript-minifier.com/raw);
  bookmarklet="javascript:"$func_min;
  echo $bookmarklet > $build_folder/bookmarklet.js;
  echo "Bookmarklet generated: $build_folder/bookmarklet.js"

  for k in "${!ph[@]}"; do
    v=${ph[$k]};
    build_json="$build_json\"$k\":\"$v\","
  done
  # build json and remove last comma from variables
  echo "{${build_json: : -1}}" > $build_jsonfile
  echo "Build file generated: $build_jsonfile"

  echo "All done! 🍰"
  ;;
*)
  echo "Nothing to do. ⭐️"
    ;;
esac
