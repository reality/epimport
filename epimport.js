// Import a bunch of files into etherpad-lite

var _ = require('underscore')._,
    request = require('request'),
    fs = require('fs'),
    async = require('async'),
    toMarkdown = require('to-markdown').toMarkdown,
    html_strip = require('htmlstrip-native').html_strip;


var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
var htmlStripOptions = {
    'include_script': false,
    'include_style': false,
    'compact_whitespace': false
};

// Check for missing config
var diff = _.difference(_.keys(config), [ 'instance', 'api_key', 'file_dir', 'user_group', 'convert_html' ]);
if(diff.length !== 0) {
    console.log('Missing settings: ' + diff.join(', '));
    process.exit(1);
}

var files = fs.readdirSync(config.file_dir),
    count = 0,
    createPath = config.instance + '/api/1/createGroupPad';

async.each(files, function(file, done) {
    var content = fs.readFileSync(config.file_dir + '/' + file, 'utf-8');
    if(config.convert_html) {
        content = html_strip(toMarkdown(content), htmlStripOptions);
    }

    request.get({
        'url': createPath,
        'qs': {
            'apikey': config.api_key,
            'groupID': config.user_group,
            'padName': file.split('.')[0],
            'text': content
        },
        'json': true
    }, function(err, res, body) {
        if(!err && res.statusCode === 200) {
            if(body.code === 0) {
                console.log('-> Uploaded ' + file);
            } else {
                console.log('-> ERR: ' + body.message); 
            }
            count++;
            done();
        } else {
            console.log('-> Fatal ERR: ' + res.statusCode + ' - ' + err);
            process.exit(1);
        }
    });
}, function() {
    console.log('-> Uploaded ' + count + ' files.');
});
