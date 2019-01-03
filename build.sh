#!/usr/bin/env zsh

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

sed_placeholders(){
  for k in "${(@k)ph}"; do
    v=${ph[$k]};
    sed -i "" -e "s/{$k}/$v/g" $1
  done
}

build_folder='./dist';
build_jsonfile=$build_folder"/build.json"

# define placeholders
typeset -A ph

ph[cookie_name]='_yd_ab_source';
ph[source_main]='G2bHPu5G';
ph[source_experiment]='0rlHlu9d';
ph[experiment_traffic]=0.1;
ph[experiment_domain_name]="yourdictionary-web.s3-website-us-east-1.amazonaws.com"

# RUN!
echo "***************************************"
for k in "${(@k)ph}"; do echo $k: ${ph[$k]}; done
echo "***************************************"

read "CONFIRM?Confirm? [Y/n]"
CONFIRM=${CONFIRM:l} #tolower
if [[ $response =~ ^(yes|y| ) ]] || [[ -z $response ]]; then
  mkdir -p $build_folder;

  echo "Processing files..."
  for jsf in ./code/*.js; do
    echo "> "$(basename $jsf);
    cp $jsf $build_folder;
    built_jsf=$build_folder/$(basename $jsf);
    sed_placeholders $built_jsf;
  done

  func_min=$(curl -X POST -s --data-urlencode "input@$build_folder/bookmarklet.js" https://javascript-minifier.com/raw);
  bookmarklet="javascript:"$func_min;
  echo $bookmarklet > $build_folder/bookmarklet.js;
  echo "\nBookmarklet generated: $build_folder/bookmarklet.js"

  for k in "${(@k)ph}"; do
    v=${ph[$k]};
    build_json="$build_json\"$k\":\"$v\","
  done
  # build json and remove last comma from variables
  echo "{${build_json: : -1}}" > $build_jsonfile
  echo "\nBuild json file generated: $build_jsonfile"

  echo "All done! 🍰"
fi
