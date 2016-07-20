// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * MutationObserver is cool and all, but there are limits. For instance, we can't
 * watch the Y.Node itself, but only its children. Since watching the node AND node's children
 * is a common pattern for resize/crop/rotate, this module will be built.
 *
 *     var crazyNode = Y.one('#foo');
 *     var options = {
 *       node: crazyNode,
 *       deletionCallback: function(removedNodes) {
 *         console.log('crazyNode or it's children is deleted.');
 *       },
 *
 *       // Usual MutationObserver arguments from down here.
 *       childList: true,  // true by default. Ovverride to false if you want.
 *       subtree: true  // true by default. Override to false if you want.
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.DeleteMutationObserver
 */
Y.M.atto_image.DeleteMutationObserver = function() {
    Y.M.atto_image.DeleteMutationObserver.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.DeleteMutationObserver, Y.Base, {
    /**
     * The node being watched.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * The mutation observer that observe's this.node's mutation.
     *
     * @property _mutationObserver
     * @type {null|MutationObserver}
     * @default null
     * @private
     */
    _mutationObserver: null,

    /**
     * The mutation observer that observe's this.node's children's mutation.
     *
     * @property _childrenMutationObserver
     * @type {null|MutationObserver}
     * @default null
     * @private
     */
    _childrenMutationObserver: null,

    /**
     * @property _mutationObserverConfig
     * @type {Object}
     * @default {childList: true, subtree: true}
     * @private
     */
    _mutationObserverConfig: {childList: true, subtree: true},

    /**
     * @property _deletionCallback
     * @type {Function}
     * @default Y.M.atto_image.utility.noop
     * @private
     */
    _deletionCallback: Y.M.atto_image.utility.noop,

    initializer: function(cfg) {
        this.node = cfg.node;
        this._deletionCallback = cfg.deletionCallback;

        delete cfg.node;
        delete cfg.deletionCallback;
        // @see http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_merge
        // "The properties from later objects will overwrite those in earlier objects."
        this._mutationObserverConfig = Y.merge(this._mutationObserverConfig, cfg);

        Y.log('initialized', 'debug', 'atto_image:delete-mutation-observer');
    },

    /**
     * Starts the MutationObserver instances.
     */
    start: function() {
        var self = this;

        this._childrenMutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !self.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.MutationObserver.node
            if (nodeNotSet) {
                Y.log(
                    'self.node not set causing problem in start method',
                    'debug',
                    'atto_image:delete-mutation-observer');
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred) {
                    Y.log(
                        "node deletion occurred in node's children",
                        'debug',
                        'atto_image:delete-mutation-observer');
                    self._deletionCallback(mutation.removedNodes);
                }
            });
        });
        this._childrenMutationObserver.observe(self.node.getDOMNode(), this._mutationObserverConfig);

        this._mutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !self.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.MutationObserver.node
            if (nodeNotSet) {
                Y.log(
                    'self.node not set causing problem in start method',
                    'debug',
                    'atto_image:delete-mutation-observer');
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred) {
                    if ([].indexOf.call(mutation.removedNodes, self.node.getDOMNode()) >= 0) {
                        Y.log("node deletion occurred in node", 'debug', 'atto_image:delete-mutation-observer');
                        self._deletionCallback(mutation.removedNodes);
                    }
                }
            });
        });
        this._mutationObserver.observe(self.node.ancestor().getDOMNode(), this._mutationObserverConfig);
    },

    /**
     * Stops MutationObserver instances.
     */
    stop: function() {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }

        if (this._childrenMutationObserver) {
            this._childrenMutationObserver.disconnect();
            this._childrenMutationObserver = null;
        }
    }
}, {
    NAME: 'DeleteMutationObserver'
});