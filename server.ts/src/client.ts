
import * as https from 'https'
import * as http from 'http'

const baseUrl = 'https://frozen-refuge-69652.herokuapp.com/v1'
function doRequest(options, callback) {
    if (options.protocol == 'http:') {
        return http.request(options, callback)
    } else {
        return https.request(options, callback)
    }
}
function buildOptions(urlStr, method, headers) {
    const url = new URL(urlStr);
    return {
        protocol: url.protocol,
        hostname: url.hostname,
        method: method,
        port: url.port,
        path: url.pathname + url.search,
        headers: headers 
    }
}
function request(options, encodedData) : Promise<[number, string]> {
    return new Promise((resolve, reject) => {
        const req = doRequest(options, (res) => {
            let rawData = ''
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve([res.statusCode, rawData])
            });
        });

        req.on('error', (e) => {
            resolve([400, e.message]);
        });

        if (encodedData != null) {
            req.write(encodedData)
        }

        req.end();
    });
}

export async function get(uri, headers) {
    return request(buildOptions(baseUrl + uri, 'GET', headers), null)
}

export async function post(uri, headers, data) {
    return request(buildOptions(baseUrl + uri, 'POST', headers), data)
}

export default {}
