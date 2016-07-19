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
 *       node: Y.one('img#foo-img');
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
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * @property _ghost_node
     * @type {null|Y.Node}
     * @default null
     * @private
     */
    _ghostNode: null,

    /**
     * Wraps the _ghostNode. This is because _ghostNode is likely to be an img tag where we can't really
     * suspsend resize handles.
     *
     * @property _ghost_node_container
     * @type {null|Y.Node}
     * @default null
     * @private
     */
    _ghostNodeContainer: null,

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

        this.enable();

        this._publishEvents();

        Y.log('initialized', 'debug', 'atto_image:resizable');
    },

    /**
     * Call to build the resizing scaffolding.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        // Note: No incentive to make resizable_overlay_node to be a property of atto_image::resizable since
        //       it is under this._ghostNodeContainer, which when deleted also deletes resizable_overlay_node.
        this._ghostNode = this._createGhostNode();
        this._ghostNodeContainer = this._createGhostNodeContainer();
        this._resizableOverlayNode = this._createResizeOverlayNode();
        this._resizableOverlayNode.appendChild(this._ghostNode);

        // Insert the this._ghostNodeContainer before this.node, this is because we want this._ghostNodeContainer
        // to appear as this.node, while this.node is hidden.
        this.node.insert(this._ghostNodeContainer, "before");
        this._ghostNodeContainer.appendChild(this._resizableOverlayNode);

        this._resizableOverlay = this._createResizeOverlay(this._resizableOverlayNode, this._ghostNodeContainer);

        Y.M.atto_image.utility.enableHideUntilSave(this.node);

        this._enable = true;

        Y.log('enabled', 'debug', 'atto_image:resizable');
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
        this._createResizeOverlayNode = null;
        if (this._resizableOverlayNode) {
            this._resizableOverlayNode.remove(true);
        }
        this._resizableOverlayNode = null;
        if (this._ghostNodeContainer) {
            this._ghostNodeContainer.remove(true);  // Destroy it and its child nodes.
        }
        this._ghostNodeContainer = null;
        this._ghostNode = null;

        Y.M.atto_image.utility.disableHideUntilSave(this.node);

        this._enable = false;

        Y.log('disabled', 'debug', 'atto_image:resizable');
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
        this.publish('atto_image_resizable:click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:dblclick Fired when at least one of the nodes inside resize div is double clicked.
         */
        this.publish('atto_image_resizable:dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:start Fired before resizing.
         */
        this.publish('atto_image_resizable:resize:start', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:resize Fired during resizing.
         */
        this.publish('atto_image_resizable:resize:resize', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:resize:end Fired after resizing.
         */
        this.publish('atto_image_resizable:resize:end', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish('atto_image_resizable:init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
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

        ghostNode.setStyles({
            // Remove styling that affect's non-content widths (e.g. margin and top/left css properties).
            margin: '0px',
            top: '0px',
            left: '0px',

            // To fill the resize_overlay, set width/height to 100%.
            width: '100%',
            height: '100%'
        });

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

        return ghostNodeContainer;
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

            // Note: We can only acquire the size of this.node since it's already in the DOM tree thus BoundingClientRect
            //      exist. this._ghostNode on the other hand is not, thus getBoundingClientRect is 0 on all properties.
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
        this.fire('atto_image_resizable:resize:start', e);

        Y.log('resize start', 'debug', 'atto_image:resizable');
    },

    /**
     * Event handler for resizing.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResize: function(e) {
        this._resizableOverlay.align();

        var newWidth =
            Y.M.atto_image.utility.parseInt10(this._ghostNode.getComputedStyle("width")) -
            Y.M.atto_image.utility.getHorizontalNonContentWidth(this._ghostNode);
        var newHeight =
            Y.M.atto_image.utility.parseInt10(this._ghostNode.getComputedStyle("height")) -
            Y.M.atto_image.utility.getVerticalNonContentWidth(this._ghostNode);

        var sizeAttrs = {width: newWidth, height: newHeight};
        this.node.setAttrs(sizeAttrs);

        e.resizable = this;
        this.fire('atto_image_resizable:resize:resize', e);

        Y.log('resizing to {' + newWidth + 'px, ' + newHeight + 'px }', 'debug', 'atto_image:resizable');
    },

    /**
     * Event handler for resizing end.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResizeEnd: function(e) {
        this._resizableOverlay.align();

        e.resizable = this;
        this.fire('atto_image_resizable:resize:end', e);

        Y.log('resize end', 'debug', 'atto_image:resizable');
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
        this.fire('atto_image_resizable:click', e);
        Y.log('click', 'debug', 'atto_image:resizable');
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
        this.fire('atto_image_resizable:dblclick', e);
        Y.log('dblclick', 'debug', 'atto_image:resizable');
    }
}, {
    NAME: 'resizable'
});