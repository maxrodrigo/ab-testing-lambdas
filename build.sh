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
#
function sed_placeholders(){
  for k in "${(@k)ph}"; do
    v=${ph[$k]};
    sed -e "s/{$k}/$v/g" $1
  done
}


build_folder='./build';

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
  echo
  mkdir -p $build_folder

  echo "Processing files..."
  echo ${ph[cookie_name]}

  for jsf in ./code/*.js; do
    cp $jsf $build_folder;
    built_jsf=$build_folder/$(basename $jsf);
    sed_placeholders $built_jsf
  done
fi
