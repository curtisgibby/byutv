var request = require("request");

const baseUrl = 'https://api.byutv.org/api3/';
const headers = {
    'cache-control': 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    'Host': 'api.byutv.org',
    'x-byutv-platformkey': 'xsaaw9c7y5',
    'x-byutv-context': 'web$US',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0'
};

function getEpisode(rawEpisode, callback) {
    var options = {
        method: 'GET',
        url: baseUrl + 'catalog/getepisode',
        qs: {
            episodeid: rawEpisode.id,
            channel: 'byutv'
        },
        headers
    };

    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        callback(JSON.parse(body));
    });
}

function getPage(guid, callback) {
    var options = {
        method: 'GET',
        url: baseUrl + 'page/getpage',
        qs: {
            pageid: guid,
        },
        headers
    };

    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        callback(JSON.parse(body));
    });

}

function getListItems(list, callback) {
    var options = {
        method: 'GET',
        url: baseUrl + 'list/getlistitems',
        qs: {
            listid: list.id,
            start: 0,
            limit: 20,
            channel: 'byutv'
        },
        headers
    };

    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        callback(JSON.parse(body));
    });

}

module.exports = {
    getEpisode,
    getPage,
    getListItems
};
