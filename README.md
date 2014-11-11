# epimport

Import files to an etherpad-lite instance.

Basically, just open config.json, set the keys as detailed below and node
epimport.js.

## Config

### instance

The path to your etherpad-lite instance, without a trailing slash.

### api_key

This will be in your etherpad-lite install directory in APIKEY.TXT.

### file_dir

The location of the files to import. Probably easiest to use the default and
stick everything you want to upload in import/.

### user_group

The group ID to create your pads under. This can be a little difficult to get
normally, I recommend using the ep_adminpads plugin to figure them out from the
admin interface.
