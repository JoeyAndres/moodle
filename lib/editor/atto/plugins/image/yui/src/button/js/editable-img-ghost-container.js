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
     * @param {{width: {Number}, height: {Number}}} size New size of the GhostNodeContainer.
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

        ghostNode.addClass('atto_image_ghost_img');

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
            position: nodePositionStyle
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
});