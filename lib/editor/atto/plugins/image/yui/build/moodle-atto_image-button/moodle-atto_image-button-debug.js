YUI.add('moodle-atto_image-button', function (Y, NAME) {

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

Y.namespace('M.atto_image');
Y.M.atto_image.hideUntilSaveClass = 'atto-image-helper-hide-until-save';
Y.M.atto_image.resizeNodeContainer =
    '<div class="atto-image-resize-container atto_control {{classes}}" ></div>';
Y.M.atto_image.resizeOverlayNodeTemplate =
    '<div class="atto-image-resize-overlay atto_control {{classes}}"></div>';// This file is part of Moodle - http://moodle.org/
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
 * @copyright  2015 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * This is where utility functions are placed so they can be modified easily.
 *
 * @module moodle-atto_image-utility
 */

Y.M.atto_image.utility = {
    /**
     * A helper function for parsing string to base 10 and avoiding jsling/shifter complains about having no radix.
     *
     * @param {String|Number} val
     * @returns {Number}
     */
    parseInt10: function(val) {
        return parseInt(val, 10);
    },

    /**
     * A helper function for getting the natural image size prior to any html attributes and css styling.
     *
     * @param {string} src Source of the image.
     * @return {{width: {Number}, height: {Number}}} The object containing width and height.
     */
    getNaturalImageSize: function(src) {
        var img = new Image();
        img.src = src;
        return {width: img.width, height: img.height};
    },

    /**
     * Acquires the DOM node size without the border and margin.
     *
     * @param {Y.Node} node The to acquire size.
     * @return {{width: {Number}, height: {Number}}} Width and height without the border and margin.
     */
    getNodeSize: function(node) {
        var newWidth =
            Y.M.atto_image.utility.parseInt10(node.getComputedStyle("width")) -
            Y.M.atto_image.utility.getHorizontalNonContentWidth(node);
        var newHeight =
            Y.M.atto_image.utility.parseInt10(node.getComputedStyle("height")) -
            Y.M.atto_image.utility.getVerticalNonContentWidth(node);
        return {width: newWidth, height: newHeight};
    },

    /**
     * A helper function for getting the approximate aspect ratio.
     *
     * @param {{width: {Number}, height: {Number}}} size of the image to acquire aspect ratio of.
     * @returns {number} aspect ratio approximation.
     */
    getNaturalImageAspectRatio: function(size) {
        // We need imageSizeMultiplier so that when we divide, we get more precision for our aspect ratio approximation.
        var imageSizeMultiplier = 1000;
        return (size.width * imageSizeMultiplier) / (size.height * imageSizeMultiplier);
    },

    /**
     * @param {Y.Node} node to acquire the total horizontal border.
     * @returns {Number} Total horizontal border in px.
     */
    getHorizontalBorderWidth: function(node) {
        var borderLeftWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-left-width"));
        var borderRightWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-right-width"));
        return borderLeftWidth + borderRightWidth;
    },

    /**
     * @param {Y.Node} node to acquire the total vertical border.
     * @returns {Number} Total vertical border in px.
     */
    getVerticalBorderWidth: function(node) {
        var borderTopWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-top-width"));
        var borderBottomWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-bottom-width"));
        return borderTopWidth + borderBottomWidth;

    },

    /**
     * @param {Y.Node} node to acquire the total horizontal padding.
     * @returns {Number} Total horizontal border in px.
     */
    getHorizontalPaddingWidth: function(node) {
        var paddingLeft = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-left"));
        var paddingRight = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-right"));
        return paddingLeft + paddingRight;
    },

    /**
     * @param {Y.Node} node to acquire the total vertical padding.
     * @returns {Number} Total vertical border in px.
     */
    getVerticalPaddingWidth: function(node) {
        var paddingBottom = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-bottom"));
        var paddingTop = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-top"));
        return paddingBottom + paddingTop;
    },

    /**
     * @param {Y.Node} node to acquire the total non-content (border+padding) width .
     * @returns {Number} Total horizontal non-content in px.
     *
     * Note: Margin is not part of this, since by def'n, margin is outside box-model.
     */
    getHorizontalNonContentWidth: function(node) {
        return this.getHorizontalBorderWidth(node) + this.getHorizontalPaddingWidth(node);
    },

    /**
     * @param {Y.Node} node to acquire the total non-content (border+padding) height.
     * @returns {Number} Total vertical non-content in px.
     *
     * Note: Margin is not part of this, since by def'n, margin is outside box-model.
     */
    getVerticalNonContentWidth: function(node) {
        return this.getVerticalBorderWidth(node) + this.getVerticalPaddingWidth(node);
    },

    /**
     * "Hide until save" simply means the given node is hidden from the user until atto does an autosave/save.
     * @see clean.js of atto
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    enableHideUntilSave: function(node) {
        node.addClass(Y.M.atto_image.hideUntilSaveClass);
    },

    /**
     * @see enableHideUntilSave, this is simply the opposite.
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    disableHideUntilSave: function(node) {
        node.removeClass(Y.M.atto_image.hideUntilSaveClass);
    },

    /**
     * Compares two rangy object if their selection is the same.
     *
     * @param {rangy.Range} rangy1
     * @param {rangy.Range} rangy2
     * @return {boolean} True if the selection they range represents are equal.
     */
    rangyCompare: function(rangy1, rangy2) {
        return (
            (rangy1.startContainer == rangy2.startContainer) &&
            (rangy1.endContainer == rangy2.endContainer) &&
            (rangy1.startOffset == rangy2.startOffset) &&
            (rangy1.endOffset == rangy2.endOffset)
        );
    },

    /**
     * Disable IE's custom contenteditable features on img.
     *
     * @param {Y.Node} editorNode
     */
    disableIEImgContentEditable: function(editorNode) {
        editorNode.all('img').each(function(imgNode) {
            imgNode.getDOMNode().setAttribute('unselectable', 'on');
        });
    }
};// This file is part of Moodle - http://moodle.org/
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
 * is a common pattern for resize/crop/rotate, this module is built.
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
     * @type {Function|null}
     * @default null
     * @private
     */
    _deletionCallback: null,

    /**
     * When a div with many children is deleted, multiple calls to _deletionCallback might be called. What if
     * the developer calls Y.M.atto_image.DeletionMutationObserver.stop() in first callback?
     * The remaining _deletionCallback (for other deleted DOM elements) are still going to be called.
     * To avoid this, this.stop() will set this._start flag to false thus avoiding further calls to _deletionCallback.
     *
     * @property _start
     * @type {Boolean}
     * @default false
     * @private
     */
    _start: false,

    initializer: function(cfg) {
        this.node = cfg.node;
        this._deletionCallback = cfg.deletionCallback;

        delete cfg.node;
        delete cfg.deletionCallback;
        // @see http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_merge
        // "The properties from later objects will overwrite those in earlier objects."
        this._mutationObserverConfig = Y.merge(this._mutationObserverConfig, cfg);

        Y.log(
            'initialized',
            'debug',
            Y.M.atto_image.DeleteMutationObserver.NAME
        );
    },

    /**
     * Starts the MutationObserver instances.
     */
    start: function() {
        var self = this;

        this._start = true;

        this._childrenMutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !self.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.DeleteMutationObserver.node
            if (nodeNotSet) {
                Y.log(
                    'self.node not set causing problem in start method',
                    'debug',
                    Y.M.atto_image.DeleteMutationObserver.NAME
                );
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred && self._start) {
                    Y.log(
                        "node deletion occurred in node's children",
                        'debug',
                        Y.M.atto_image.DeleteMutationObserver.NAME
                    );
                    if (self._deletionCallback) {
                        self._deletionCallback(mutation.removedNodes);
                    }
                }
            });
        });
        this._childrenMutationObserver.observe(self.node.getDOMNode(), this._mutationObserverConfig);

        this._mutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !self.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.DeleteMutationObserver.node
            if (nodeNotSet) {
                Y.log(
                    'self.node not set causing problem in start method',
                    'debug',
                    Y.M.atto_image.DeleteMutationObserver.NAME
                );
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred && self._start) {
                    if ([].indexOf.call(mutation.removedNodes, self.node.getDOMNode()) >= 0) {
                        Y.log(
                            'delete-mutation-observer',
                            'debug',
                            Y.M.atto_image.DeleteMutationObserver.NAME
                        );
                        if (self._deletionCallback) {
                            self._deletionCallback(mutation.removedNodes);
                        }
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
        this._start = false;

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
    NAME: 'atto_image_DeleteMutationObserver',

    /**
     * See if DeleteMutationObserver is supported.
     *
     * @return {Boolean} true if supported in browser, false otherwise.
     */
    isSupported: function() {
        var supported = !!window.MutationObserver;
        Y.log(
            supported ? 'supported' : 'not supported',
            'debug',
            Y.M.atto_image.DeleteMutationObserver.NAME
        );
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
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
 * Encapsulate the editable image ghost container.
 * This is aggregated by editable classes, e.g. Y.M.atto_image.resizable.
 *
 * @class Y.M.atto_image.EditableImgGhostContainer
 */
Y.M.atto_image.EditableImgGhostContainer = function() {
    Y.M.atto_image.EditableImgGhostContainer.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.EditableImgGhostContainer, Y.Base, {
    /**
     * The DOM element to resize, more specifically, img.
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
     * False by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * The DeleteMutationObserver for self.ghostNodeContainer.
     *
     * @property _ghostNodeContainerDeleteMutationObserver
     * @type {null|Y.M.atto_image.DeleteMutationObserver}
     * @default null
     * @private
     */
    _ghostNodeContainerDeleteMutationObserver: null,

    /**
     * @property ghost_node
     * @type {null|Y.Node}
     * @default null
     */
    ghostNode: null,

    /**
     * Wraps the _ghostNode. This is because _ghostNode is likely to be an img tag where we can't really
     * suspsend resize handles.
     *
     * @property ghost_node_container
     * @type {null|Y.Node}
     * @default null
     */
    ghostNodeContainer: null,

    initializer: function(cfg) {
        this.node = cfg.node;

        this.enable();

        this._publishEvents();

        Y.log('initialized', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    },

    /**
     * Create the EditableImgGhostContainer.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this.ghostNode = this._createGhostNode();
        this.ghostNodeContainer = this._createGhostNodeContainer();
        this.ghostNodeContainer.appendChild(this.ghostNode);

        this.node.insert(this.ghostNodeContainer, "before");

        // Now that this.ghostNodeContainer is attached to DOM assuming that this.node is attached to DOM, we can
        // start running the DeleteMutationObserver.
        this.startDeleteMutationObserver();

        this._enable = true;

        Y.log('enabled', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    },

    /**
     * Destroys the EditableImgGhostContainer.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.stopDeleteMutationObserver();

        if (this.ghostNodeContainer) {
            this.ghostNodeContainer.remove(true);  // Destroy it and its child nodes.

            this.ghostNodeContainer = null;
            this.ghostNode = null;
        }

        this._enable = false;

        Y.log('disabled', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    },

    /**
     * Starts watching ghostNodeContainer if not already.
     */
    startDeleteMutationObserver: function() {
        if (!this._ghostNodeContainerDeleteMutationObserver) {
            this._ghostNodeContainerDeleteMutationObserver = new Y.M.atto_image.DeleteMutationObserver({
                node: this.ghostNodeContainer,
                deletionCallback: this._onDelete.bind(this)
            });
            this._ghostNodeContainerDeleteMutationObserver.start();
        }
    },

    /**
     * Stops watching ghostNodeContainer (and its children) for deletion.
     */
    stopDeleteMutationObserver: function() {
        // Ensure to disable all MutationObservers first since we will be deleting those node.
        // We will be calling deletionCallback which we don't want. What if we just want to disable
        // the resizable and not call this.deleteNode().
        if (this._ghostNodeContainerDeleteMutationObserver) {
            this._ghostNodeContainerDeleteMutationObserver.stop();
            this._ghostNodeContainerDeleteMutationObserver = null;
        }
    },

    /**
     * The node being edited.
     * @return {Y.Node} this.node The node being edited.
     */
    getNode: function() {
        return this.node;
    },

    /**
     * The ghost node.
     * @returns {null|Y.Node} Return the ghostNode.
     */
    getGhostNode: function() {
        return this.ghostNode;
    },

    /**
     * The container of the ghost node.
     * @return {Y.Node} Return the ghostNodeContainer.
     */
    getGhostNodeContainer: function() {
        return this.ghostNodeContainer;
    },

    /**
     * Sets the size of the img.
     * @param {{width: {Number|String}, height: {Number|String}}} size
     */
    setGhostNodeContainerSize: function(size) {
        // Since ghostNodeContainer is div, we can only set its size via css styles not html attributes.
        this.ghostNodeContainer.setStyles({
            width: size.width,
            height: size.height
        });
    },

    /**
     * Adds a control node that aids the editing of the imae. e.g. for Y.M.atto_image.resizable,
     * control node with the be the Y.M.atto_image.resizable._resizeOverlayNode.
     * @param {Y.Node} controlNode The node that aids the editing of the image.
     */
    addControl: function(controlNode) {
        this.ghostNodeContainer.appendChild(controlNode);
    },

    /**
     * Publish events for Y.M.atto_image.resizable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event atto_image_resizable:click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish(Y.M.atto_image.EditableImgGhostContainer.NAME + ':click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:dblclick Fired when at least one of the nodes inside resize div is double
         *        clicked.
         */
        this.publish(Y.M.atto_image.EditableImgGhostContainer.NAME + ':dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_editable_img_ghost_node_container:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish(Y.M.atto_image.EditableImgGhostContainer.NAME + ':init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event atto_image_editable_img_ghost_node_container:delete Fired once the node (image) or any auxiliary
         *        resizing items is deleted.
         */
        this.publish(Y.M.atto_image.EditableImgGhostContainer.NAME + ':delete', {
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * Create the ghost node, which is a clone of node (original image) with added styles so that it will fill up
     * the resizeOverlay.
     *
     * @returns {Y.Node}
     * @private
     */
    _createGhostNode: function() {
        var ghostNode = this.node.cloneNode(true);

        // Remove id attribute on _ghostNode for sanity and replace it with something else.
        ghostNode.removeAttribute('id').generateID();

        ghostNode.removeAttribute('width');
        ghostNode.removeAttribute('height');

        ghostNode.setStyles({
            // Remove styling that affect's non-content widths (e.g. margin and top/left css properties).
            margin: '0px',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',

            // This is so other will just stack over this.ghostNode instead of doing a doc flow.
            position: 'absolute'
        });

        // To handle cases in some version of IE or FF, in which if the image is a contenteditable
        // (an inheritable property), resize handle or move handle shows up during image click. This
        // is addressed by manually disabling inheritance, by setting contentEditable property to false.
        ghostNode.getDOMNode().contentEditable = false;

        return ghostNode;
    },

    /**
     * ghostNodeContainer wraps ghostNode. This will wrap all the auxiliary resizing DOM objects so if we remove
     * this, we remove all auxiliary items.
     *
     * @returns {Y.Node}
     * @private
     */
    _createGhostNodeContainer: function() {
        var containerTemplate = Y.Handlebars.compile(Y.M.atto_image.resizeNodeContainer);
        var ghostNodeContainer = Y.Node.create(containerTemplate({classess: ''}));

        // Copy all styling from node to container.
        ghostNodeContainer.getDOMNode().style.cssText = this.node.getDOMNode().style.cssText;

        /*
         * Setup some quirks, i.e. Although they are styling that applies outside the border, we don't want some
         * values of them since they can disrupt proper operation.
         *
         * display: We want initial|display|inline -> inline-block to respect the margins.
         */
        var nodeDisplayStyle = this.node.getComputedStyle("display") || 'inline-block';
        if (nodeDisplayStyle.toLowerCase() === "inline") {
            nodeDisplayStyle = "inline-block";
        }

        // position: We want initial|static -> relative so child with position: absolute, respect container.
        // @see https://developer.mozilla.org/en/docs/Web/CSS/position
        var nodePositionStyle = this.node.getComputedStyle("position") || 'relative';
        if (nodePositionStyle.toLowerCase() === "static" || nodePositionStyle.toLowerCase() === "initial") {
            nodePositionStyle = "relative";
        }

        /*
         * Reset all styling that applies from border within, the following is the list of such, and explanation why:
         * a.) width/height: We want the container to hug ghost_node
         * b.) padding: We want the container to hug ghost_node
         * c.) border-width: We want the container to hug ghost_node, plus, ghost_node already have this (copied from node).
         * d.) (... Insert something due to a bug ...)
         */
        ghostNodeContainer.setStyles({
            // (3) Quirks.
            display: nodeDisplayStyle,
            position: nodePositionStyle,

            // (4) Reset all styling that applies from border within.
            padding: '0px',
            'border-width': '0px'
        });

        // Setup event handlers.
        // Bubble up the click event from container to this resizable object.
        ghostNodeContainer.on("click", this._onClick, this);
        ghostNodeContainer.on("dblclick", this._onDblClick, this);

        // Bubble up the click event from container's children to this resizable object.
        // Note: For some reason resizing does not call click event, thus no worries when those handles are selected
        //       for dragging.
        ghostNodeContainer.get("children").each(function(child) {
            child.on('click', this._onClick, this);
        }, this);
        ghostNodeContainer.get("children").each(function(child) {
            child.on('dblclick', this._onDblClick, this);
        });

        /**
         * Resize container contains many components. If we are dragging something, many things
         * to consider what we might be dragging around. A node that is dragged out of container also becomes
         * it's own node, thus when Y.M.atto_image.resizable.disable is called, those node are left lying
         * around. Solution is just disallow dragging.
         */
        ghostNodeContainer.before('dragstart', function(e) {
            Y.log('dragstart', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
            e.halt(true);
        }, this);

        return ghostNodeContainer;
    },

    /**
     * Event handler for click event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        e.EditableImgGhostContainer = this;
        this.fire(Y.M.atto_image.EditableImgGhostContainer.NAME + ':click', e);
        Y.log('click', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    },

    /**
     * Event handler for dblclick event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        e.EditableImgGhostContainer = this;
        this.fire(Y.M.atto_image.EditableImgGhostContainer.NAME + ':dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    },

    /**
     * Event handler for delete event.
     *
     * @param {Y.Node} node Node that got deleted.
     * @private
     */
    _onDelete: function() {
        this.disable();

        this.fire(Y.M.atto_image.EditableImgGhostContainer.NAME + ':delete');
        Y.log('delete', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
    }
}, {
    NAME: 'atto_image_EditableImgGhostContainer',

    /**
     * Function to check if Y.M.atto_image.resizable is supported.
     *
     * @return {Boolean} true if Y.M.atto_image.resizable is supported, otherwise false.
     */
    isSupported: function() {
        var supported = Y.M.atto_image.DeleteMutationObserver.isSupported();
        Y.log(supported ? 'supported' : 'not supported', 'debug', Y.M.atto_image.EditableImgGhostContainer.NAME);
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
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
 * Adds image resizing capability. Suppose you have an img DOM node with id='foo-img', to
 * resize the img:
 *
 *     var options = {
 *       node: Y.one('img#foo-img')
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.resizable
 */
Y.namespace('M.atto_image').resizable = function() {
    Y.M.atto_image.resizable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.namespace('M.atto_image').resizable, Y.Base, {
    /**
     * The DOM element to resize, more specifically, img.
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
     * The DeleteMutationObserver for self.node.
     *
     * @property _nodeDeleteMutationObserver
     * @type {null|Y.M.atto_image.DeleteMutationObserver}
     * @default null
     * @private
     */
    _nodeDeleteMutationObserver: null,

    /**
     * Represents the EditableImgGhostContainer, the thing where we suspend the resize handles and the thing
     * that user can see while in img editing mode.
     *
     * @property _editableImgGhostContainer
     * @type {null|Y.M.atto_image.EditableImgGhostContainer}
     * @private
     */
    _editableImgGhostContainer: null,

    /**
     * Keeps track of the Y.Overlay object during resizing. Null when not resizing (this._enable is false).
     *
     * @property _resizableOverlay
     * @type {null|Y.Overlay}
     * @default null
     * @private
     */
    _resizableOverlay: null,

    /**
     * _resizableOverlayNode as opposed to _resizableOverlay, is the DOM object _resizableOverlay will be dealing with.
     *
     * @property _resizableOverlayNode
     * @type {null|Y.Node}
     * @default null
     * @private
     */
    _resizableOverlayNode: null,

    /**
     * False by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * @property preserve_aspect_ratio
     * @type {Boolean}
     * @default false
     * @public
     */
    preserveAspectRatio: false,

    initializer: function(cfg) {
        this.node = cfg.node;

        if (!Y.Lang.isUndefined(cfg.preserveAspectRatio)) {
            this.preserveAspectRatio = cfg.preserveAspectRatio;
        }

        this._editableImgGhostContainer = new Y.M.atto_image.EditableImgGhostContainer({
            node: this.node
        });

        this.enable();

        this._publishEvents();

        Y.log('initialized', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Call to build the resizing scaffolding.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._editableImgGhostContainer.enable();
        // If this._editableImgGhostContainer is click/dblclick, we pass the event here.
        this._editableImgGhostContainer.on(
            Y.M.atto_image.EditableImgGhostContainer.NAME + ':click',
            this._onClick.bind(this)
        );
        this._editableImgGhostContainer.on(
            Y.M.atto_image.EditableImgGhostContainer.NAME + ':dblclick',
            this._onDblClick.bind(this)
        );
        // Temporarily stops the DeleteMutationObserver since this._createResizeOverlay does some deletion
        // in the background.
        this._editableImgGhostContainer.stopDeleteMutationObserver();

        this._resizableOverlayNode = this._createResizeOverlayNode();

        this._editableImgGhostContainer.addControl(this._resizableOverlayNode);

        this._resizableOverlay = this._createResizeOverlay(
            this._resizableOverlayNode,
            this._editableImgGhostContainer.getGhostNodeContainer()
        );

        Y.M.atto_image.utility.enableHideUntilSave(this.node);

        this._nodeDeleteMutationObserver = new Y.M.atto_image.DeleteMutationObserver({
            node: this.node,
            deletionCallback: this.deleteNode.bind(this)
        });
        this._nodeDeleteMutationObserver.start();
        this._editableImgGhostContainer.startDeleteMutationObserver();
        this._editableImgGhostContainer.on(
            Y.M.atto_image.EditableImgGhostContainer.NAME + ':delete',
            this.deleteNode.bind(this)
        );

        this._enable = true;

        Y.log('enabled', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Call to take down the resizing scaffolding.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        // Garbage collection, in reverse order. Note some operations are redundant, but I want order.

        if (this._nodeDeleteMutationObserver) {
            this._nodeDeleteMutationObserver.stop();
            this._nodeDeleteMutationObserver = null;
        }

        this._editableImgGhostContainer.disable();
        if (this._resizableOverlayNode) {
            this._resizableOverlayNode.remove(true);
        }
        this._resizableOverlayNode = null;

        Y.M.atto_image.utility.disableHideUntilSave(this.node);

        this._enable = false;

        Y.log('disabled', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Deletes the node (image) itself. Also the auxiliary items if they exist.
     */
    deleteNode: function() {
        // Call this.disable first to stop all DeleteMutationObserver, so we don't call non-existent callbacks.
        this.disable();
        if (this.node) {
            this.node.remove(true);
        }

        this.fire('atto_image_resizable:delete');
        Y.log('delete', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Get the node being resized.
     * @return {Y.Node} this.node The node being resized.
     */
    getNode: function() {
        return this.node;
    },

    /**
     * Get ghostNodeContainer.
     *
     * @returns {null|Y.Node} The container for auxiliary Y.Node, which contains resize handles.
     */
    getGhostNodeContainer: function() {
        return this._editableImgGhostContainer.getGhostNodeContainer();
    },

    /**
     * Publish events for Y.M.atto_image.resizable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event atto_image_resizable:click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:dblclick Fired when at least one of the nodes inside resize div is double clicked.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:start Fired before resizing.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':resize:start', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:resize Fired during resizing.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':resize:resize', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:end Fired after resizing.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':resize:end', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event atto_image_resizable:delete Fired once the node (image) or any auxiliary resizing items is deleted.
         */
        this.publish(Y.M.atto_image.resizable.NAME + ':delete', {
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * @see this._resizeOverlayNode
     *
     * @returns {Y.Node}
     * @private
     */
    _createResizeOverlayNode: function() {
        var resizableOverlayTemplate = Y.Handlebars.compile(Y.M.atto_image.resizeOverlayNodeTemplate);
        var resizableOverlayNode = Y.Node.create(resizableOverlayTemplate({classes: ''}));

        return resizableOverlayNode;
    },

    /**
     * @see this._resizeOverlay
     *
     * @param {Y.Node} resizableOverlayNode A div that will be manipulated by Y.Overlay.
     * @param {Y.Node} nodeToOverlay The node (img in our case) that will be placed inside resizableOverlayNode.
     * @returns {Y.Overlay}
     * @private
     */
    _createResizeOverlay: function(resizableOverlayNode, nodeToOverlay) {
        var resizableOverlay = new Y.Overlay({
            srcNode: resizableOverlayNode,

            width: this.node.getDOMNode().getBoundingClientRect().width + 'px',
            height: this.node.getDOMNode().getBoundingClientRect().height + 'px',

            visible: true,
            render: true,

            // Place overlay on top of each other.
            align: {node: nodeToOverlay, points: ["tl", "tl"]}
        });
        resizableOverlay.plug(Y.Plugin.Resize, {
            handles: ['t', 'r', 'b', 'l', 'tr', 'tl', 'br', 'bl']
        });
        resizableOverlay.resize.plug(Y.Plugin.ResizeConstrained, {
            preserveRatio: this.preserveAspectRatio
        }, this);

        // Setup resize event handlers.
        resizableOverlay.resize.on('resize:start', function(e) {
            this._onResizeStart(e);
        }, this);
        resizableOverlay.resize.on('resize:resize', function(e) {
            this._onResize(e);
        }, this);
        resizableOverlay.resize.on('drag:end', function(e) {
            this._onResizeEnd(e);
        }, this);

        return resizableOverlay;
    },

    /**
     * Event handler for resizing start.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResizeStart: function(e) {
        e.resizable = this;

        // Since we were resizing the hidden this.node, we can use that as our dimension.
        this._editableImgGhostContainer.setGhostNodeContainerSize(Y.M.atto_image.utility.getNodeSize(this.node));

        this.fire(Y.M.atto_image.resizable.NAME + ':resize:start', e);

        Y.log('resize start', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Event handler for resizing.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResize: function(e) {
        this._resizableOverlay.align();

        var newWidth = this._resizableOverlay.resize.info.offsetWidth;
        var newHeight = this._resizableOverlay.resize.info.offsetHeight;

        var sizeAttrs = {width: newWidth, height: newHeight};

        // TODO: This only works since this.node is mostly an img, in which widht/height attribute is valid.
        //       otherwise these are not respected. In the future, if div needs to be handled for some reason,
        //       have a check if this.node is img (in which use setAttrs), otherwise use setStyles.
        // Note: I'm using setAttrs to be consistent with the button.js
        this.node.setAttrs(sizeAttrs);

        e.resizable = this;
        this.fire(Y.M.atto_image.resizable.NAME + ':resize:resize', e);
        Y.log('resizing to {' + newWidth + 'px, ' + newHeight + 'px }', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Event handler for resizing end.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResizeEnd: function(e) {
        this._resizableOverlay.align();

        // Since we were resizing the hidden this.node, we can use that as our dimension.
        this._editableImgGhostContainer.setGhostNodeContainerSize(Y.M.atto_image.utility.getNodeSize(this.node));

        e.resizable = this;
        this.fire(Y.M.atto_image.resizable.NAME + ':resize:end', e);
        Y.log('resize end', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Event handler for click event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        e.resizable = this;
        this.fire(Y.M.atto_image.resizable.NAME + ':click', e);
        Y.log('click', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Event handler for dblclick event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        e.resizable = this;
        this.fire(Y.M.atto_image.resizable.NAME + ':dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.resizable.NAME);
    }
}, {
    NAME: 'atto_image_resizable',

    /**
     * Function to check if Y.M.atto_image.resizable is supported.
     *
     * @return {Boolean} true if Y.M.atto_image.resizable is supported, otherwise false.
     */
    isSupported: function() {
        var supported =
            Y.M.atto_image.DeleteMutationObserver.isSupported() &&
            Y.M.atto_image.EditableImgGhostContainer.isSupported();
        Y.log(supported ? 'supported' : 'not supported', 'debug', Y.M.atto_image.resizable.NAME);
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
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
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_image_alignment-button
 */

/**
 * Atto image selection tool.
 *
 * @namespace M.atto_image
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

var CSS = {
        RESPONSIVE: 'img-responsive',
        INPUTALIGNMENT: 'atto_image_alignment',
        INPUTALT: 'atto_image_altentry',
        INPUTHEIGHT: 'atto_image_heightentry',
        INPUTSUBMIT: 'atto_image_urlentrysubmit',
        INPUTURL: 'atto_image_urlentry',
        INPUTSIZE: 'atto_image_size',
        INPUTWIDTH: 'atto_image_widthentry',
        IMAGEALTWARNING: 'atto_image_altwarning',
        IMAGEBROWSER: 'openimagebrowser',
        IMAGEPRESENTATION: 'atto_image_presentation',
        INPUTCONSTRAIN: 'atto_image_constrain',
        INPUTCUSTOMSTYLE: 'atto_image_customstyle',
        IMAGEPREVIEW: 'atto_image_preview',
        IMAGEPREVIEWBOX: 'atto_image_preview_box'
    },
    SELECTORS = {
        INPUTURL: '.' + CSS.INPUTURL
    },
    ALIGNMENTS = [
        // Vertical alignment.
        {
            name: 'text-top',
            str: 'alignment_top',
            value: 'vertical-align',
            margin: '0 .5em'
        }, {
            name: 'middle',
            str: 'alignment_middle',
            value: 'vertical-align',
            margin: '0 .5em'
        }, {
            name: 'text-bottom',
            str: 'alignment_bottom',
            value: 'vertical-align',
            margin: '0 .5em',
            isDefault: true
        },

        // Floats.
        {
            name: 'left',
            str: 'alignment_left',
            value: 'float',
            margin: '0 .5em 0 0'
        }, {
            name: 'right',
            str: 'alignment_right',
            value: 'float',
            margin: '0 0 0 .5em'
        }, {
            name: 'customstyle',
            str: 'customstyle',
            value: 'style'
        }
    ],

    REGEX = {
        ISPERCENT: /\d+%/
    },

    COMPONENTNAME = 'atto_image',

    TEMPLATE = '' +
            '<form class="atto_form">' +
                '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                '<input class="fullwidth {{CSS.INPUTURL}}" type="url" id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                '<br/>' +

                // Add the repository browser button.
                '{{#if showFilepicker}}' +
                    '<button class="{{CSS.IMAGEBROWSER}}" type="button">{{get_string "browserepositories" component}}</button>' +
                '{{/if}}' +

                // Add the Alt box.
                '<div style="display:none" role="alert" class="warning {{CSS.IMAGEALTWARNING}}">' +
                    '{{get_string "presentationoraltrequired" component}}' +
                '</div>' +
                '<label for="{{elementid}}_{{CSS.INPUTALT}}">{{get_string "enteralt" component}}</label>' +
                '<input class="fullwidth {{CSS.INPUTALT}}" type="text" value="" id="{{elementid}}_{{CSS.INPUTALT}}" size="32"/>' +
                '<br/>' +

                // Add the presentation select box.
                '<input type="checkbox" class="{{CSS.IMAGEPRESENTATION}}" id="{{elementid}}_{{CSS.IMAGEPRESENTATION}}"/>' +
                '<label class="sameline" for="{{elementid}}_{{CSS.IMAGEPRESENTATION}}">' +
                    '{{get_string "presentation" component}}' +
                '</label>' +
                '<br/>' +

                // Add the size entry boxes.
                '<label class="sameline" for="{{elementid}}_{{CSS.INPUTSIZE}}">{{get_string "size" component}}</label>' +
                '<div id="{{elementid}}_{{CSS.INPUTSIZE}}" class="{{CSS.INPUTSIZE}}">' +
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTWIDTH}}">{{get_string "width" component}}</label>' +
                '<input type="text" class="{{CSS.INPUTWIDTH}} input-mini" id="{{elementid}}_{{CSS.INPUTWIDTH}}" size="4"/> x ' +

                // Add the height entry box.
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTHEIGHT}}">{{get_string "height" component}}</label>' +
                '<input type="text" class="{{CSS.INPUTHEIGHT}} input-mini" id="{{elementid}}_{{CSS.INPUTHEIGHT}}" size="4"/>' +

                // Add the constrain checkbox.
                '<input type="checkbox" class="{{CSS.INPUTCONSTRAIN}} sameline" id="{{elementid}}_{{CSS.INPUTCONSTRAIN}}"/>' +
                '<label for="{{elementid}}_{{CSS.INPUTCONSTRAIN}}">{{get_string "constrain" component}}</label>' +
                '</div>' +

                // Add the alignment selector.
                '<label class="sameline" for="{{elementid}}_{{CSS.INPUTALIGNMENT}}">{{get_string "alignment" component}}</label>' +
                '<select class="{{CSS.INPUTALIGNMENT}}" id="{{elementid}}_{{CSS.INPUTALIGNMENT}}">' +
                    '{{#each alignments}}' +
                        '<option value="{{value}}:{{name}};">{{get_string str ../component}}</option>' +
                    '{{/each}}' +
                '</select>' +
                // Hidden input to store custom styles.
                '<input type="hidden" class="{{CSS.INPUTCUSTOMSTYLE}}"/>' +
                '<br/>' +

                // Add the image preview.
                '<div class="mdl-align">' +
                '<div class="{{CSS.IMAGEPREVIEWBOX}}">' +
                    '<img src="#" class="{{CSS.IMAGEPREVIEW}}" alt="" style="display: none;"/>' +
                '</div>' +

                // Add the submit button and close the form.
                '<button class="{{CSS.INPUTSUBMIT}}" type="submit">{{get_string "saveimage" component}}</button>' +
                '</div>' +
            '</form>',

        IMAGETEMPLATE = '' +
            '<img src="{{url}}" alt="{{alt}}" ' +
                '{{#if width}}width="{{width}}" {{/if}}' +
                '{{#if height}}height="{{height}}" {{/if}}' +
                '{{#if presentation}}role="presentation" {{/if}}' +
                'style="{{alignment}}{{margin}}{{customstyle}}"' +
                '{{#if classlist}}class="{{classlist}}" {{/if}}' +
                '{{#if id}}id="{{id}}" {{/if}}' +
                'unselectable="on" ' +
                '/>';

Y.namespace('M.atto_image').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * The most recently selected image.
     *
     * @param _selectedImage
     * @type Node
     * @private
     */
    _selectedImage: null,

    /**
     * A reference to the currently open form.
     *
     * @param _form
     * @type Node
     * @private
     */
    _form: null,

    /**
     * The dimensions of the raw image before we manipulate it.
     *
     * @param _rawImageDimensions
     * @type Object
     * @private
     */
    _rawImageDimensions: null,

    initializer: function() {
        var self = this,
            host = this.get('host');

        this.addButton({
            icon: 'e/insert_edit_image',
            callback: this._displayDialogue,
            tags: 'img',
            tagMatchRequiresAll: false
        });

        // In ie, they have their own resizing handles. Get rid of that for consistency and use our own.
        Y.M.atto_image.utility.disableIEImgContentEditable(this.editor);

        Y.on('atto_image_resizable:dblclick', this._displayDialogueWhileResizing, this);
        Y.on('atto_image_resizable:init', this._resizableInitHandler, this);
        Y.on('atto_image_resizable:delete', this._resizableDeleteHandler, this);
        Y.on('atto_image_resizable:resize:start', this._resizableResizeStartHandler, this);

        this.editor.delegate('dblclick', this._displayDialogue, 'img', this);
        this.editor.delegate('click', this._handleClick, 'img', this);
        this.editor.on('drop', this._handleDragDrop, this);

        // Handle cases when something not an image is selected.
        this.editor.delegate('click', this._handleDeselect, ':not(img)', this);

        // e.preventDefault needed to stop the default event from clobbering the desired behaviour in some browsers.
        this.editor.on('dragover', function(e){e.preventDefault();}, this);
        this.editor.on('dragenter', function(e){e.preventDefault();}, this);

        // Handle what to do when copying. This is to catch the cases in which there are resizable handles on the
        // editor.
        this.editor.before(['copy', 'cut'], this._beforeCopyCutHandler, this);

        host.on('atto:htmlcleaned', function(e) {
            e.args.html = self._cleanHelperClasses(e.args.html);
        });
    },

    /**
     * Callback passed to atto:htmlcleaned event for atto_image plugin. It removes atto-image-helper* classes.
     *
     * @param {String} content HTML content.
     * @return {String} content without atto-image-helper-* classes.
     */
    _cleanHelperClasses: function(content) {
        return content.replace(
            /(<[^>]*?class\s*?=\s*?")([^>"]*)(")/gi,
            function(match, group1, group2, group3) {
                var group2WithoutHelperClass = group2.replace(/(?:^|[\s])[\s]*atto-image-helper[_a-zA-Z0-9\-]*/gi, "");
                return group1 + group2WithoutHelperClass + group3;
            }
        );
    },

    /**
     * Event handler before copy event occurs. This is need to modify atto's content editable, getting rid of
     * resize handles DOM elements.
     *
     * Algorithm Summary:
     *
     * 1. Get the current selection. This will be in array of rangy objects.
     * 2. For each of the selection/rangy object, see if resizable container is in it.
     *    i.) If resizable container is in it: See if resizable container is in the start,end, both, or middle of selection/rangy.
     *        a.) start only: Get rid of the resize container, change the start of selection to the img being resized.
     *        b.) end only: Get rid of the resize container, change the end of selection to the img being resized.
     *        c.) start and end (both): Get rid of the resize container.
     *            x.) if only resize container is really selected, set selection to the image only.
     *            xx.) otherwise, copy start and end container (the same anyway), but end container with x less offset
     *                 to account for deleted components.
     *            Note: xx only happens at firefox.
     *        d.) Middle: Get rid of the resize container. Create a new rangy, copy the start and end selection from before.
     *    ii.) Resizable container is NOT in it: Keep the old rangy/selection.
     * 3. Go back to (2) until no more rangy/selection.
     * 4. The new array of selection from (2) will now be set as the new selection.
     *
     * Note: I scanned through the rangy API, I can't believe this functionality is not there. I thought that modifying
     *       the DOMNode, and update the selection should be have a written routine already.
     *
     * @param {EventTarget} e
     * @private
     */
    _beforeCopyCutHandler: function() {
        if (this._resizable) {
            var oldRangyArr = this.get('host').getSelection();

            // See if the start/end node contains _resizable stuff.
            var newRangeArr = oldRangyArr.map(function(oldRange) {
                // If resizable exist and selection contains the resizable, we must modify that selection to
                // not include the resizable.
                // Otherwise, just return the unmodified range.
                if (this._resizable &&
                    this.get('host').selectionContainsNode(this._resizable.getGhostNodeContainer())) {

                    // See if resize container is start_node or contains start_node.
                    var start = Y.one(oldRange.startContainer).compareTo(this._resizable.getGhostNodeContainer()) ||
                        this._resizable.getGhostNodeContainer().contains(Y.one(oldRange.startContainer)) ||
                        Y.one(oldRange.startContainer).contains(this._resizable.getGhostNodeContainer());
                    var end = Y.one(oldRange.endContainer).compareTo(this._resizable.getGhostNodeContainer()) ||
                        this._resizable.getGhostNodeContainer().contains(Y.one(oldRange.endContainer)) ||
                        Y.one(oldRange.endContainer).contains(this._resizable.getGhostNodeContainer());

                    var resizableSelection = this.get('host').getSelectionFromNode(this._resizable.getGhostNodeContainer())[0];
                    var onlyResizableSelected = Y.M.atto_image.utility.rangyCompare(resizableSelection, oldRange);

                    var preStartChildrenCount = Y.one(oldRange.startContainer).get("children").size();
                    var node = this._resizable.getNode();
                    this._resizable.disable();
                    this._resizable = null;

                    var newRange = window.rangy.createRange();
                    if (start && end) {
                        var onlyOneNodeSelected = Math.abs(oldRange.endOffset - oldRange.startOffset) === 1;
                        if (onlyOneNodeSelected) {
                            /* Two cases here:
                             * 1. Either the one node selected is only the resizable.
                             * 2. The one node selected is a DOM element not the resizable.
                             */
                            if (onlyResizableSelected) {
                                newRange = this.get('host').getSelectionFromNode(node)[0];
                            } else {
                                newRange = this.get('host').getSelectionFromNode(Y.Node(oldRange.commonAncestorContainer))[0];
                            }
                        } else {
                            /**
                             * (The following is just for the next developer not convinced).
                             * Proof that if start and end contains container node, then start = end.
                             *
                             * (proof by contradiction).
                             * Suppose start and end contains container node but start != end, then
                             * container is a text node, or container belongs to two element (start and end).
                             *
                             * Since container != text node, nor can any div belong to two parent (same level in DOM),
                             * a contradiction. Therefore, start = end.
                             */

                            var postStartChildrenCount = Y.one(oldRange.startContainer).get("children").size();
                            var diff = Math.abs(postStartChildrenCount - preStartChildrenCount);

                            newRange.setStart(oldRange.startContainer, oldRange.startOffset);
                            newRange.setEnd(oldRange.endContainer, oldRange.endOffset - diff);
                        }
                    } else if (start) {
                        newRange.setStartBefore(node.getDOMNode());
                        newRange.setEnd(oldRange.endContainer, oldRange.endOffset);
                    } else if (end) {
                        newRange.setStart(oldRange.startContainer, oldRange.startOffset);
                        newRange.setEndAfter(node.getDOMNode());
                    } else {
                        newRange.setStart(oldRange.startContainer, oldRange.startOffset);
                        newRange.setEnd(oldRange.endContainer, oldRange.endOffset);
                    }

                    return newRange;
                }

                return oldRange;
            }, this);

            this.get('host').setSelection(newRangeArr);  // Set selection (rangy).
        }
    },

    /**
     * Handle a drag and drop event with an image.
     *
     * @method _handleDragDrop
     * @param {EventFacade} e
     * @private
     */
    _handleDragDrop: function(e) {

        var self = this,
            host = this.get('host'),
            template = Y.Handlebars.compile(IMAGETEMPLATE);

        host.saveSelection();
        e = e._event;

        // Only handle the event if an image file was dropped in.
        var handlesDataTransfer = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length);
        if (handlesDataTransfer && /^image\//.test(e.dataTransfer.files[0].type)) {

            var options = host.get('filepickeroptions').image,
                savepath = (options.savepath === undefined) ? '/' : options.savepath,
                formData = new FormData(),
                timestamp = 0,
                uploadid = "",
                xhr = new XMLHttpRequest(),
                imagehtml = "",
                keys = Object.keys(options.repositories);

            e.preventDefault();
            e.stopPropagation();
            formData.append('repo_upload_file', e.dataTransfer.files[0]);
            formData.append('itemid', options.itemid);

            // List of repositories is an object rather than an array.  This makes iteration more awkward.
            for (var i = 0; i < keys.length; i++) {
                if (options.repositories[keys[i]].type === 'upload') {
                    formData.append('repo_id', options.repositories[keys[i]].id);
                    break;
                }
            }
            formData.append('env', options.env);
            formData.append('sesskey', M.cfg.sesskey);
            formData.append('client_id', options.client_id);
            formData.append('savepath', savepath);
            formData.append('ctx_id', options.context.id);

            // Insert spinner as a placeholder.
            timestamp = new Date().getTime();
            uploadid = 'moodleimage_' + Math.round(Math.random() * 100000) + '-' + timestamp;
            host.focus();
            host.restoreSelection();
            imagehtml = template({
                url: M.util.image_url("i/loading_small", 'moodle'),
                alt: M.util.get_string('uploading', COMPONENTNAME),
                id: uploadid
            });
            host.insertContentAtFocusPoint(imagehtml);
            self.markUpdated();

            // Kick off a XMLHttpRequest.
            xhr.onreadystatechange = function() {
                var placeholder = self.editor.one('#' + uploadid),
                    result,
                    file,
                    newhtml,
                    newimage;

                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        result = JSON.parse(xhr.responseText);
                        if (result) {
                            if (result.error) {
                                if (placeholder) {
                                    placeholder.remove(true);
                                }
                                return new M.core.ajaxException(result);
                            }

                            file = result;
                            if (result.event && result.event === 'fileexists') {
                                // A file with this name is already in use here - rename to avoid conflict.
                                // Chances are, it's a different image (stored in a different folder on the user's computer).
                                // If the user wants to reuse an existing image, they can copy/paste it within the editor.
                                file = result.newfile;
                            }

                            // Replace placeholder with actual image.
                            newhtml = template({
                                url: file.url,
                                presentation: true
                            });
                            newimage = Y.Node.create(newhtml);
                            if (placeholder) {
                                placeholder.replace(newimage);
                            } else {
                                self.editor.appendChild(newimage);
                            }
                            self.markUpdated();
                        }
                    } else {
                        Y.use('moodle-core-notification-alert', function() {
                            new M.core.alert({message: M.util.get_string('servererror', 'moodle')});
                        });
                        if (placeholder) {
                            placeholder.remove(true);
                        }
                    }
                }
            };
            xhr.open("POST", M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', true);
            xhr.send(formData);
            return false;
        }

},

    /**
     * Handle a click on an image.
     *
     * @method _handleClick
     * @param {EventFacade} e EventFacade with resizable field added.
     * @private
     */
    _handleClick: function(e) {
        var image = e.target;

        this._initResizable(image);

        // Prevent further bubbling the DOM tree.
        // @see http://yuilibrary.com/yui/docs/event/#facade-properties
        // Without this, this will propagate up (bubble) and will hit the textarea, thus calling _handleDeselect,
        // immediately deselecting anything.
        Y.log("_handleClick Killing propagation.", 'debug', 'atto_image:button');
        e.halt(true);
    },

    /**
     * Deselect event handler.
     *
     * @param {EventFacade} e
     * @private
     */
    _handleDeselect: function() {
        // If there is an image selected, such that this._resizable is set. Delete it.
        this._destroyResizable();
    },

    /**
     * Handler when the resizable is created in the editor. It deals with cases in which there are multiple images
     * in the editor.
     *
     * @param {EventFacade} e EventFacade with resizable field added.
     * @private
     */
    _resizableInitHandler: function(e) {
        // If something was selected, deselect it. (Both range and resizable selection).
        var newResizable = e.currentTarget;
        if (newResizable !== this._resizable) {
            this._handleDeselect();

            this._resizable = newResizable;
            this._resizable.enable();
            window.rangy.getSelection().removeAllRanges();  // Deselect all selection.
            var resizableSelection = this.get('host').getSelectionFromNode(this._resizable.getGhostNodeContainer());
            this.get('host').setSelection(resizableSelection);  // Set selection (window.rangy).
        }
    },

    /**
     * Handler when the resizable is deleted. Since Y.M.att_image.resizable basically self destructs, might aswell
     * clear our reference to it.
     *
     * @param {EventFacade} e EventFacade
     * @private
     */
    _resizableDeleteHandler: function() {
        this._destroyResizable();
    },

    /**
     * Handler when the this._resizable starts being resized.
     *
     * @param {EventFacade} e EventFacade
     * @private
     */
    _resizableResizeStartHandler: function() {
        if (this._resizable) {
            this._resizable.node.removeClass(CSS.RESPONSIVE);
        }
    },

    /**
     * Initialize this._resizable.
     *
     * @param {Y.Node} imgNode Image node to be resized.
     * @private
     */
    _initResizable: function(imgNode) {
        if (!Y.M.atto_image.resizable.isSupported()) {
            return;
        }

        var selection = this.get('host').getSelectionFromNode(imgNode);
        if (this.get('host').getSelection() !== selection) {
            this.get('host').setSelection(selection);
        }

        var resizeCfg = {
            node: imgNode,
            after: {
                // A bug in YUI. @see https://github.com/yui/yui3/issues/1043 in which resizable.on('init', callback)
                // won't fire. Issue above suggest this solution.
                init: function() {
                    this.fire('atto_image_resizable:init');
                }
            }
        };
        this._resizable = new Y.M.atto_image.resizable(resizeCfg);

    },

    /**
     * Destroy _resizable
     *
     * @private
     */
    _destroyResizable: function() {
        if (this._resizable) {
            // Select nothing, destroy options overlay, and destroy the resizable object.
            window.rangy.getSelection().removeAllRanges();  // Deselect all selection.
            this._resizable.disable();
            this._resizable = null;
        }
    },

    /**
     * Display the image editing tool.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        // Reset the image dimensions.
        this._rawImageDimensions = null;

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('imageproperties', COMPONENTNAME),
            width: '480px',
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTURL
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent())
                .show();
    },

    /**
     * This is called instead of _displayDialogue if the dblclicked occured whilre resizing.
     *
     * @param {EventFacade} e Event object.
     * @private
     */
    _displayDialogueWhileResizing: function(e) {
        // this._resizable should exist, but check for sanity.
        // Currently, the selected element during the dblclick'd is/are the auxiliary DOM elements (we don't want).
        // So we want to destroy the current resizable to reveal the original image, which we change our selection to.
        if (this._resizable) {
            var imgNode = this._resizable.node;
            this._destroyResizable();
            var nodeSelection = this.get('host').getSelectionFromNode(imgNode);
            this.get('host').setSelection(nodeSelection);
            this._currentSelection = this.get('host').getSelection();
        }

        this._displayDialogue();

        // Don't let other dblclick handler handle this.
        e.stopImmediatePropagation();
    },

    /**
     * Set the inputs for width and height if they are not set, and calculate
     * if the constrain checkbox should be checked or not.
     *
     * @method _loadPreviewImage
     * @param {String} url
     * @private
     */
    _loadPreviewImage: function(url) {
        var image = new Image(), self = this;

        image.onerror = function() {
            var preview = self._form.one('.' + CSS.IMAGEPREVIEW);
            preview.setStyles({
                'display': 'none'
            });

            // Centre the dialogue when clearing the image preview.
            self.getDialogue().centerDialogue();
        };

        image.onload = function() {
            var input, currentwidth, currentheight, widthRatio, heightRatio;

            self._rawImageDimensions = {
                width: this.width,
                height: this.height
            };

            input = self._form.one('.' + CSS.INPUTWIDTH);
            currentwidth = input.get('value');
            if (currentwidth === '') {
                input.set('value', this.width);
                currentwidth = "" + this.width;
            }
            input = self._form.one('.' + CSS.INPUTHEIGHT);
            currentheight = input.get('value');
            if (currentheight === '') {
                input.set('value', this.height);
                currentheight = "" + this.height;
            }
            input = self._form.one('.' + CSS.IMAGEPREVIEW);
            input.setAttribute('src', this.src);
            input.setStyles({
                'display': 'inline'
            });

            input = self._form.one('.' + CSS.INPUTCONSTRAIN);
            if (currentwidth.match(REGEX.ISPERCENT) && currentheight.match(REGEX.ISPERCENT)) {
                input.set('checked', currentwidth === currentheight);
            } else {
                if (this.width === 0) {
                    this.width = 1;
                }
                if (this.height === 0) {
                    this.height = 1;
                }
                // This is the same as comparing to 3 decimal places.
                widthRatio = Math.round(1000*parseInt(currentwidth, 10) / this.width);
                heightRatio = Math.round(1000*parseInt(currentheight, 10) / this.height);
                input.set('checked', widthRatio === heightRatio);
            }

            // Apply the image sizing.
            self._autoAdjustSize(self);

            // Centre the dialogue once the preview image has loaded.
            self.getDialogue().centerDialogue();
        };

        image.src = url;
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            canShowFilepicker = this.get('host').canShowFilepicker('image'),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                component: COMPONENTNAME,
                showFilepicker: canShowFilepicker,
                alignments: ALIGNMENTS
            }));

        this._form = content;

        // Configure the view of the current image.
        this._applyImageProperties(this._form);

        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.IMAGEPRESENTATION).on('change', this._updateWarning, this);
        this._form.one('.' + CSS.INPUTALT).on('change', this._updateWarning, this);
        this._form.one('.' + CSS.INPUTWIDTH).on('blur', this._autoAdjustSize, this);
        this._form.one('.' + CSS.INPUTHEIGHT).on('blur', this._autoAdjustSize, this, true);
        this._form.one('.' + CSS.INPUTCONSTRAIN).on('change', function(event) {
            if (event.target.get('checked')) {
                this._autoAdjustSize(event);
            }
        }, this);
        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._setImage, this);

        if (canShowFilepicker) {
            this._form.one('.' + CSS.IMAGEBROWSER).on('click', function() {
                    this.get('host').showFilepicker('image', this._filepickerCallback, this);
            }, this);
        }

        return content;
    },

    _autoAdjustSize: function(e, forceHeight) {
        forceHeight = forceHeight || false;

        var keyField = this._form.one('.' + CSS.INPUTWIDTH),
            keyFieldType = 'width',
            subField = this._form.one('.' + CSS.INPUTHEIGHT),
            subFieldType = 'height',
            constrainField = this._form.one('.' + CSS.INPUTCONSTRAIN),
            keyFieldValue = keyField.get('value'),
            subFieldValue = subField.get('value'),
            imagePreview = this._form.one('.' + CSS.IMAGEPREVIEW),
            rawPercentage,
            rawSize;

        // If we do not know the image size, do not do anything.
        if (!this._rawImageDimensions) {
            return;
        }

        // Set the width back to default if it is empty.
        if (keyFieldValue === '') {
            keyFieldValue = this._rawImageDimensions[keyFieldType];
            keyField.set('value', keyFieldValue);
            keyFieldValue = keyField.get('value');
        }

        // Clear the existing preview sizes.
        imagePreview.setStyles({
            width: null,
            height: null
        });

        // Now update with the new values.
        if (!constrainField.get('checked')) {
            // We are not keeping the image proportion - update the preview accordingly.

            // Width.
            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;
                imagePreview.setStyle('width', rawSize + 'px');
            } else {
                imagePreview.setStyle('width', keyFieldValue + 'px');
            }

            // Height.
            if (subFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(subFieldValue, 10);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize + 'px');
            } else {
                imagePreview.setStyle('height', subFieldValue + 'px');
            }
        } else {
            // We are keeping the image in proportion.
            if (forceHeight) {
                // By default we update based on width. Swap the key and sub fields around to achieve a height-based scale.
                var _temporaryValue;
                _temporaryValue = keyField;
                keyField = subField;
                subField = _temporaryValue;

                _temporaryValue = keyFieldType;
                keyFieldType = subFieldType;
                subFieldType = _temporaryValue;

                _temporaryValue = keyFieldValue;
                keyFieldValue = subFieldValue;
                subFieldValue = _temporaryValue;
            }

            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                // This is a percentage based change. Copy it verbatim.
                subFieldValue = keyFieldValue;

                // Set the width to the calculated pixel width.
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;

                // And apply the width/height to the container.
                imagePreview.setStyle('width', rawSize);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize);
            } else {
                // Calculate the scaled subFieldValue from the keyFieldValue.
                subFieldValue = Math.round((keyFieldValue / this._rawImageDimensions[keyFieldType]) *
                        this._rawImageDimensions[subFieldType]);

                if (forceHeight) {
                    imagePreview.setStyles({
                        'width': subFieldValue,
                        'height': keyFieldValue
                    });
                } else {
                    imagePreview.setStyles({
                        'width': keyFieldValue,
                        'height': subFieldValue
                    });
                }
            }

            // Update the subField's value within the form to reflect the changes.
            subField.set('value', subFieldValue);
        }
    },

    /**
     * Update the dialogue after an image was selected in the File Picker.
     *
     * @method _filepickerCallback
     * @param {object} params The parameters provided by the filepicker
     * containing information about the image.
     * @private
     */
    _filepickerCallback: function(params) {
        if (params.url !== '') {
            var input = this._form.one('.' + CSS.INPUTURL);
            input.set('value', params.url);

            // Auto set the width and height.
            this._form.one('.' + CSS.INPUTWIDTH).set('value', '');
            this._form.one('.' + CSS.INPUTHEIGHT).set('value', '');

            // Load the preview image.
            this._loadPreviewImage(params.url);
        }
    },

    /**
     * Applies properties of an existing image to the image dialogue for editing.
     *
     * @method _applyImageProperties
     * @param {Node} form
     * @private
     */
    _applyImageProperties: function(form) {
        var properties = this._getSelectedImageProperties(),
            img = form.one('.' + CSS.IMAGEPREVIEW),
            i,
            css;

        if (properties === false) {
            img.setStyle('display', 'none');
            // Set the default alignment.
            for (i in ALIGNMENTS) {
                if (ALIGNMENTS[i].isDefault === true) {
                    css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                    form.one('.' + CSS.INPUTALIGNMENT).set('value', css);
                }
            }
            // Remove the custom style option if this is a new image.
            form.one('.' + CSS.INPUTALIGNMENT).getDOMNode().options.remove(ALIGNMENTS.length - 1);
            return;
        }

        if (properties.align) {
            form.one('.' + CSS.INPUTALIGNMENT).set('value', properties.align);
            // Remove the custom style option if we have a standard alignment.
            form.one('.' + CSS.INPUTALIGNMENT).getDOMNode().options.remove(ALIGNMENTS.length - 1);
        } else {
            form.one('.' + CSS.INPUTALIGNMENT).set('value', 'style:customstyle;');
        }
        if (properties.customstyle) {
            form.one('.' + CSS.INPUTCUSTOMSTYLE).set('value', properties.customstyle);
        }
        if (properties.width) {
            form.one('.' + CSS.INPUTWIDTH).set('value', properties.width);
        }
        if (properties.height) {
            form.one('.' + CSS.INPUTHEIGHT).set('value', properties.height);
        }
        if (properties.alt) {
            form.one('.' + CSS.INPUTALT).set('value', properties.alt);
        }
        if (properties.src) {
            form.one('.' + CSS.INPUTURL).set('value', properties.src);
            this._loadPreviewImage(properties.src);
        }
        if (properties.presentation) {
            form.one('.' + CSS.IMAGEPRESENTATION).set('checked', 'checked');
        }

        // Update the image preview based on the form properties.
        this._autoAdjustSize();
    },

    /**
     * Gets the properties of the currently selected image.
     *
     * The first image only if multiple images are selected.
     *
     * @method _getSelectedImageProperties
     * @return {object}
     * @private
     */
    _getSelectedImageProperties: function() {
        var properties = {
                src: null,
                alt :null,
                width: null,
                height: null,
                align: '',
                presentation: false
            },

            // Get the current selection.
            images = this.get('host').getSelectedNodes(),
            i,
            width,
            height,
            style,
            css,
            image,
            margin;

        if (images) {
            images = images.filter('img');
        }

        if (images && images.size()) {
            image = images.item(0);
            this._selectedImage = image;

            style = image.getAttribute('style');
            properties.customstyle = style;
            style = style.replace(/ /g, '');

            width = image.getAttribute('width');
            if (!width.match(REGEX.ISPERCENT)) {
                width = parseInt(width, 10);
            }
            height = image.getAttribute('height');
            if (!height.match(REGEX.ISPERCENT)) {
                height = parseInt(height, 10);
            }

            if (width !== 0) {
                properties.width = width;
            }
            if (height !== 0) {
                properties.height = height;
            }
            for (i in ALIGNMENTS) {
                css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                if (style.indexOf(css) !== -1) {
                    margin = 'margin:' + ALIGNMENTS[i].margin + ';';
                    margin = margin.replace(/ /g, '');
                    // Must match alignment and margins - otherwise custom style is selected.
                    if (style.indexOf(margin) !== -1) {
                        properties.align = css;
                        break;
                    }
                }
            }
            properties.src = image.getAttribute('src');
            properties.alt = image.getAttribute('alt') || '';
            properties.presentation = (image.get('role') === 'presentation');
            return properties;
        }

        // No image selected - clean up.
        this._selectedImage = null;
        return false;
    },

    /**
     * Update the form when the URL was changed. This includes updating the
     * height, width, and image preview.
     *
     * @method _urlChanged
     * @private
     */
    _urlChanged: function() {
        var input = this._form.one('.' + CSS.INPUTURL);

        if (input.get('value') !== '') {
            // Load the preview image.
            this._loadPreviewImage(input.get('value'));
        }
    },

    /**
     * Update the image in the contenteditable.
     *
     * @method _setImage
     * @param {EventFacade} e
     * @private
     */
    _setImage: function(e) {
        var form = this._form,
            url = form.one('.' + CSS.INPUTURL).get('value'),
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            width = form.one('.' + CSS.INPUTWIDTH).get('value'),
            height = form.one('.' + CSS.INPUTHEIGHT).get('value'),
            alignment = form.one('.' + CSS.INPUTALIGNMENT).get('value'),
            margin = '',
            presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked'),
            constrain = form.one('.' + CSS.INPUTCONSTRAIN).get('checked'),
            imagehtml,
            customstyle = '',
            i,
            css,
            classlist = [],
            host = this.get('host');

        e.preventDefault();

        // Check if there are any accessibility issues.
        if (this._updateWarning()) {
            return;
        }

        // Focus on the editor in preparation for inserting the image.
        host.focus();
        if (url !== '') {
            if (this._selectedImage) {
                host.setSelection(host.getSelectionFromNode(this._selectedImage));
            } else {
                host.setSelection(this._currentSelection);
            }

            if (alignment === 'style:customstyle;') {
                alignment = '';
                customstyle = form.one('.' + CSS.INPUTCUSTOMSTYLE).get('value');
            } else {
                for (i in ALIGNMENTS) {
                    css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                    if (alignment === css) {
                        margin = ' margin: ' + ALIGNMENTS[i].margin + ';';
                    }
                }
            }

            if (constrain) {
                classlist.push(CSS.RESPONSIVE);
            }

            if (!width.match(REGEX.ISPERCENT) && isNaN(parseInt(width, 10))) {
                form.one('.' + CSS.INPUTWIDTH).focus();
                return;
            }
            if (!height.match(REGEX.ISPERCENT) && isNaN(parseInt(height, 10))) {
                form.one('.' + CSS.INPUTHEIGHT).focus();
                return;
            }

            var template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                url: url,
                alt: alt,
                width: width,
                height: height,
                presentation: presentation,
                alignment: alignment,
                margin: margin,
                customstyle: customstyle,
                classlist: classlist.join(' ')
            });

            this.get('host').insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();

    },

    /**
     * Update the alt text warning live.
     *
     * @method _updateWarning
     * @return {boolean} whether a warning should be displayed.
     * @private
     */
    _updateWarning: function() {
        var form = this._form,
            state = true,
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked');
        if (alt === '' && !presentation) {
            form.one('.' + CSS.IMAGEALTWARNING).setStyle('display', 'block');
            form.one('.' + CSS.INPUTALT).setAttribute('aria-invalid', true);
            form.one('.' + CSS.IMAGEPRESENTATION).setAttribute('aria-invalid', true);
            state = true;
        } else {
            form.one('.' + CSS.IMAGEALTWARNING).setStyle('display', 'none');
            form.one('.' + CSS.INPUTALT).setAttribute('aria-invalid', false);
            form.one('.' + CSS.IMAGEPRESENTATION).setAttribute('aria-invalid', false);
            state = false;
        }
        this.getDialogue().centerDialogue();
        return state;
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-rangy", "moodle-editor_atto-plugin", "resize", "resize-plugin"]});
