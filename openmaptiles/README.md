
export AZURE_BLOB_SAS_ACCESS_KEY='sv=2020-02-10&ss=b&srt=o&sp=rwac&se=2021-07-31T16:46:39Z&st=2021-04-22T08:46:39Z&spr=https&sig=nQVVhud8%2BFvDAnvyJ0ZNz5AyPdp5PQP8%2BpWowCCCcf8%3D'
echo $AZURE_BLOB_SAS_ACCESS_KEY
unset AZURE_BLOB_SAS_ACCESS_KEY

sudo chown -R azureuser:azureuser <dir>
sudo chmod u+x <file>

# urls

client asks for style.json file => this is fetched from api management api
however style.json contains urls for openmaptiles that is straight to vectortiles-api endpoint => not getting cached

we could host our own openmaptiles.json file where tiles url goes to api management endpoint

app => style.json https://vectortiles-api-apim.azure-api.net/styles/basic/style.json

Following url can be manually set inside style.json file

https://vectortiles-api-apim.azure-api.net/data/openmaptiles.json
style.json => openmaptiles.json https://vectortiles-api.azurewebsites.net/data/openmaptiles.json

Can the following url be change inside tileserver configuration?
Try to set config url to storage url?

"openmaptiles": {
  "tiles": ["https://vectortiles-api.azurewebsites.net/data/vectortiles/{z}/{x}/{y}.pbf"],
  "type": "vector"
}

https://vectortiles-api-apim.azure-api.net/data/openmaptiles/{z}/{x}/{y}.pbf
data/openmaptiles/9/292/148.pbf
openmaptiles.json => mbtile data https://vectortiles-api.azurewebsites.net/data/openmaptiles/{z}/{x}/{y}.pbf

# Setting up VM

TODO Arm template initialization

ssh -i vectortiles_generator_ssh_key.pem azureuser@10.0.0.4

Set VM with computing enforced => memory is not as important D2s_v3 => 75€/month. Maybe use F2s

memory usage max 1gb

azureuser
vectortiles_123

AZURE APP DOCKER VOLUME MOUNT
https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/mounting_azure_blob.md

# Installation

Docker installation instructions copied from [here](https://docs.docker.com/engine/install/ubuntu/).

```bash
sudo apt-get update

sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common \
  git \
  build-essential
	

# Git is neede for cloning & build-essential for make

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
   
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

sudo docker run hello-world
```

Docker-compose installation instructions copied from [here](https://docs.docker.com/compose/install/).

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt install -y docker-compose
```

```bash
sudo usermod -a -G docker azureuser
```

Azcopy installation instructions copied from [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10).

```bash
wget https://aka.ms/downloadazcopy-v10-linux
tar -xvf downloadazcopy-v10-linux
sudo cp ./azcopy_linux_amd64_*/azcopy /usr/bin/
sudo chmod +x /usr/bin/azcopy

sudo chown azureuser: /usr/bin/azcopy
```

```
git clone https://github.com/openmaptiles/openmaptiles.git
cd openmaptiles
```

COPY run.sh file
CHANGE PERMISSIONS chmod u+x run.sh
mkdir data

# Add cron job

Open cron jobs configuration file

```bash
crontab -e
```

Add following lines for automatic tile generations. NOTE: Azure Blob storage access key can be generator via Azure portal or with CLI tools.

```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
AZURE_BLOB_SAS_ACCESS_KEY=<azure_blob_sas_access_key>

0 18 * * 1,3,5 cd /home/azureuser/openmaptiles && ./run.sh > /dev/null 2> /home/azureuser/run.log
```

Or run manually (on openmaptiles folder)

sudo su
export AZURE_BLOB_SAS_ACCESS_KEY='<sas-key>'
./run.sh > /dev/null 2> ./run.log & disown

Manually update tiles.mbfile to Blob Storage

```bash
azcopy copy <mbtiles-file> 'https://<azure-storage-account>.blob.core.windows.net/<container-name>/<filename>?<blob-sas-token>'
```


# MISC

Mitä quickstart tekee?


- make refresh-docker-images
- make destroy-db
- make init-dirs
- make "download osm data"
- make clean
- make all
- make start-db
- make import-data
- make import-osm
- make import-borders
- make import-wikidata (onko tarpeellinen?)
- make import-sql
- make analyze-db
- make test-perf-null
- make generate-tiles
- make stop-db

1. Lataa docker imaget (openmaptiles)
2. Alusta projekti rakentamalla riippuvuudet
3. Lataa tiedot tietokantaan ja analysoi se
4. Generoi tiilet tietokannan datasta
5. Sammuta tietokanta