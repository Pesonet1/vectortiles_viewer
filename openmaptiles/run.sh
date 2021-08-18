#!/bin/bash
set -e

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

export AZURE_STORAGE_ACCOUNT=vectortilesstore

export CONTAINER_NAME=vectortiles
export BLOB_NAME=vectortiles.mbtiles
export FILENAME=data/tiles.mbtiles
export PREVIOUS_EXPORT_FILENAME=data/prev/old_tiles.mbtiles

if [ -f $FILENAME ]; then
  mkdir -p data/prev
  mv -f $FILENAME $PREVIOUS_EXPORT_FILENAME
fi

if [ -z "$AZURE_BLOB_SAS_ACCESS_KEY" ]; then
  (echo >&2 "\$AZURE_BLOB_SAS_ACCESS_KEY needs to be set. Export it as environmental variable on host machine.")
  exit 1
fi

# https://www.hsl.fi/avoindata
# https://karttapalvelu.storage.hsldev.com/hsl.osm/hsl.osm.pbf
# curl -sSfL "https://karttapalvelu.storage.hsldev.com/hsl.osm/hsl.osm.pbf" -o data/finland-latest.osm.pbf
curl -sSfL "https://karttapalvelu.storage.hsldev.com/finland.osm/finland.osm.pbf" -o data/finland-latest.osm.pbf

# Generates tile under data folder
./quickstart.sh finland-latest

if [ ! -f $FILENAME ]; then
  (echo >&2 "File not found, exiting")
  exit 1
fi

URL="https://"$AZURE_STORAGE_ACCOUNT".blob.core.windows.net/"$CONTAINER_NAME"/"$BLOB_NAME""
URL_WITH_SAS=$URL"?"$AZURE_BLOB_SAS_ACCESS_KEY
echo "Uploading... to " $URL
azcopy copy $FILENAME $URL_WITH_SAS
echo "Done."
