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

        this.fire(Y.M.atto_image.resizable.NAME + ':delete');
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

        var newWidth = this._resizableOverlay.resize.info.offsetWidth;
        var newHeight = this._resizableOverlay.resize.info.offsetHeight;
        var sizeAttrs = {width: newWidth, height: newHeight};
        // TODO: This only works since this.node is mostly an img, in which widht/height attribute is valid.
        //       otherwise these are not respected. In the future, if div needs to be handled for some reason,
        //       have a check if this.node is img (in which use setAttrs), otherwise use setStyles.
        // Note: I'm using setAttrs to be consistent with the button.js
        this.node.setAttrs(sizeAttrs);

        // Since we were resizing the hidden this.node, we can use that as our dimension.
        this._editableImgGhostContainer.setGhostNodeContainerSize(sizeAttrs);

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
});