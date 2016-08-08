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
 * Encapsulate the editable image.
 * This is aggregated by editable classes, e.g. Y.M.atto_image.resizable.
 *
 * @class Y.M.atto_image.EditableImg
 */
Y.M.atto_image.EditableImg = function() {
    Y.M.atto_image.EditableImg.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.EditableImg, Y.Base, {
    /**
     * The DOM element to be edited, more specifically, img.
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
     * Disabled by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * The DeleteMutationObserver for self.node
     *
     * @property _nodeDeletionMutationObserver
     * @type {null|Y.M.atto_image.DeleteMutationObserver}
     * @default null
     * @private
     */
    _nodeDeletionMutationObserver: null,

    /**
     * Represents .atto-image-wrapper that wraps the node.
     *
     * @property nodeWrapper
     * @type {null|Y.Node}
     * @default null
     */
    nodeWrapper: null,

    initializer: function(cfg) {
        this.node = cfg.node;

        this.nodeWrapper = this.node.ancestor('.atto-image-wrapper');
        this.nodeInnerWrapper = this.node.ancestor('.atto-image-inner-wrapper');
        if (!this.nodeWrapper) {
            this.node.wrap(Y.M.atto_image.imgInnerWrapperTemplate);
            this.nodeInnerWrapper = this.node.ancestor('.atto-image-inner-wrapper');
            this.nodeInnerWrapper.wrap(Y.M.atto_image.imgWrapperTemplate);
            this.nodeWrapper = this.nodeInnerWrapper.ancestor('.atto-image-wrapper');
        }

        this.enable();

        this._publishEvents();

        Y.log('initialized', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Create the EditableImg.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._setupImgWrapper();
        this._setupImgNode();

        this.startDeleteMutationObserver();

        this._enable = true;

        Y.log('enabled', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Destroys the EditableImg.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.stopDeleteMutationObserver();

        this._destroyImgNode();
        this._destroyImgWrapper();

        this._enable = false;

        Y.log('disabled', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Starts watching node deletion if not already. Note we don't watch nodeWrapper, since deleting
     * nodeWrapper, delete's everything.
     */
    startDeleteMutationObserver: function() {
        if (!this._nodeDeletionMutationObserver) {
            this._nodeDeletionMutationObserver = new Y.M.atto_image.DeleteMutationObserver({
                node: this.node,
                deletionCallback: this._onDelete.bind(this)
            });
            this._nodeDeletionMutationObserver.start();
        }
    },

    /**
     * Stops watching nodeWrapper (and its children) for deletion.
     */
    stopDeleteMutationObserver: function() {
        // Ensure to disable all MutationObservers first since we will be deleting those node.
        // We will be calling deletionCallback which we don't want. What if we just want to disable
        // the resizable and not call this.deleteNode().
        if (this._nodeDeletionMutationObserver) {
            this._nodeDeletionMutationObserver.stop();
            this._nodeDeletionMutationObserver = null;
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
     * The container of the ghost node.
     * @return {Y.Node} Return the nodeWrapper.
     */
    getImgWrapper: function() {
        return this.nodeWrapper;
    },

    /**
     * Sets the size of the img.
     * @param {{width: {Number}, height: {Number}}} size New size of the image.
     */
    setSize: function(size) {
        this.node.setAttrs({
            width: size.width,
            height: size.height
        });

        // Since nodeWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeInnerWrapper.setStyles({
            width: size.width,
            height: size.height
        });
    },

    setRotation: function(angle) {
        Y.M.atto_image.utility.rotateNode(this.nodeInnerWrapper, angle);
    },

    recalculateImgWrapper: function() {
        var nodeInnerWrapperRect = this.nodeInnerWrapper.getDOMNode().getBoundingClientRect();

        this.nodeWrapper.setStyles({
            width: nodeInnerWrapperRect.width,
            height: nodeInnerWrapperRect.height
        });

        this.nodeInnerWrapper.setStyles({
            left: (nodeInnerWrapperRect.width - this.node.getAttribute('width')) / 2,
            top: (nodeInnerWrapperRect.height - this.node.getAttribute('height')) / 2
        });
    },

    /**
     * Adds a control node that aids the editing of the imae. e.g. for Y.M.atto_image.resizable,
     * control node with the be the Y.M.atto_image.resizable._resizeOverlayNode.
     *
     * To make controls disappear during save/autosave or paste, atto_control class is attached to them.
     *
     * @param {Y.Node} controlNode The node that aids the editing of the image.
     */
    addControl: function(controlNode) {
        controlNode.addClass('atto_control');
        this.nodeInnerWrapper.appendChild(controlNode);
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
        this.publish(Y.M.atto_image.EditableImg.NAME + ':click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_resizable:dblclick Fired when at least one of the nodes inside resize div is double
         *                                      clicked.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_editable_img_ghost_node_container:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event atto_image_editable_img_ghost_node_container:delete Fired once the node (image) or any auxiliary
         *        resizing items is deleted.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':delete', {
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * Setup this.node for editing.
     * @private
     */
    _setupImgNode: function() {
        Y.log('_setupImgNode', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Destroys the stuff from @see this._setupImgNode
     * @private
     */
    _destroyImgNode: function() {
        this.node.detachAll();
        Y.log('_destroyImgNode', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Setup the nodeWrapper styles/attribute if not yet setup.
     * @private
     */
    _setupImgWrapper: function() {
        if (!this.nodeWrapper) {
            return;
        }

        var rotateAngle = Y.M.atto_image.utility.getRotateNode(this.nodeInnerWrapper);

        // Copy all styling from node to container.
        var nodeWrapperSize = {
            width: this.nodeWrapper.getStyle('width'),
            height: this.nodeWrapper.getStyle('height')
        };
        this.nodeWrapper.getDOMNode().style.cssText = this.node.getDOMNode().style.cssText;
        this.nodeWrapper.setStyles(nodeWrapperSize);

        Y.M.atto_image.utility.rotateNode(this.nodeInnerWrapper, rotateAngle);

        // Do this so we can delete the image.
        this.nodeWrapper.setAttribute('contenteditable', true);

        // Since nodeInnerWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeInnerWrapper.setStyles({
            width: this.node.getAttribute('width'),
            height: this.node.getAttribute('height')
        });

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
        this.nodeWrapper.setStyles({
            // (3) Quirks.
            display: nodeDisplayStyle,
            position: nodePositionStyle
        });

        // Setup event handlers.
        // Bubble up the click event from container to this resizable object.
        this.nodeWrapper.on("click", this._onClick, this);
        this.nodeWrapper.on("dblclick", this._onDblClick, this);

        // Bubble up the click event from container's children to this resizable object.
        // Note: For some reason resizing does not call click event, thus no worries when those handles are selected
        //       for dragging.
        this.nodeWrapper.get("children").each(function(child) {
            child.on('click', this._onClick, this);
        }, this);
        this.nodeWrapper.get("children").each(function(child) {
            child.on('dblclick', this._onDblClick, this);
        }, this);

        /**
         * Resize container contains many components. If we are dragging something, many things
         * to consider what we might be dragging around. A node that is dragged out of container also becomes
         * it's own node, thus when Y.M.atto_image.resizable.disable is called, those node are left lying
         * around. Solution is just disallow dragging.
         */
        this.nodeWrapper.before('dragstart', function(e) {
            Y.log('dragstart', 'debug', Y.M.atto_image.EditableImg.NAME);
            e.halt(true);
        }, this);

        Y.M.atto_image.utility.enableImageEditable(this.nodeWrapper);
    },

    /**
     * Does not really "destroy" this.nodeWrapper, but rather disassemble the setup that should only exist while
     * editing.
     * @private
     */
    _destroyImgWrapper: function() {
        if (!this.nodeWrapper) {
            return;
        }

        Y.M.atto_image.utility.disableImageEditable(this.nodeWrapper);

        this.nodeWrapper.detachAll();

        // Done editing the image at this point. To ensure user can't enter text, set this to contenteditable=false.
        this.nodeWrapper.setAttribute('contenteditable', false);

        this.nodeInnerWrapper.detachAll();
    },

    /**
     * Event handler for click event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        this.fire(Y.M.atto_image.EditableImg.NAME + ':click', e);
        Y.log('click', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Event handler for dblclick event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire(Y.M.atto_image.EditableImg.NAME + ':dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Event handler for delete event.
     *
     * @param {NodeList} nodes Node(s) that got deleted.
     * @private
     */
    _onDelete: function() {
        this.disable();

        // Delete everything.
        this.nodeWrapper.remove(true);

        this.fire(Y.M.atto_image.EditableImg.NAME + ':delete');
        Y.log('delete', 'debug', Y.M.atto_image.EditableImg.NAME);
    }
}, {
    NAME: 'atto_image_EditableImg',

    /**
     * Function to check if Y.M.atto_image.resizable is supported.
     *
     * @return {Boolean} true if Y.M.atto_image.resizable is supported, otherwise false.
     */
    isSupported: function() {
        var supported = Y.M.atto_image.DeleteMutationObserver.isSupported();
        Y.log(supported ? 'supported' : 'not supported', 'debug', Y.M.atto_image.EditableImg.NAME);
        return supported;
    }
});