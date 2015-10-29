/**
 * Module dependencies.
 */

var resolve = require('path').resolve;
var assert = require('assert');
var debug = require('debug')('koa-static');
var send = require('koa-send');

/**
 * Expose `serve()`.
 */

module.exports = serve;

/**
 * Serve static files from `root`.
 *
 * @param {String} root
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function serve(root, opts) {
    opts = opts || {};

    assert(root, 'root directory is required to serve files');

    // options
    debug('static "%s" %j', root, opts);
    opts.root = resolve(root);
    opts.index = opts.index || 'index.html';
    console.log(opts);

    if (!opts.defer) {
        return function *serve(next) {
            if (this.method == 'HEAD' || this.method == 'GET') {
                console.log(this.path);
                if (!opts.regexp || (opts.regexp && new RegExp(opts.regexp).test(this.path))) {
                    if (yield send(this, this.path, opts)) return;
                }

            }
            yield* next;
        };
    }

    return function *serve(next) {
        yield* next;

        if (this.method != 'HEAD' && this.method != 'GET') return;
        // response is already handled
        if (this.body != null || this.status != 404) return;
        //yield send(this, this.path, opts);
    };
}
