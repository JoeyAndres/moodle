<?php

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

namespace mod_label;

/**
 * Utility functions
 *
 * @package mod_label
 * @copyright  2016 Joey Andres
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

/**
 * @param stdClass $cm Course module instance.
 */
function hide_course_module($cm) {
    global $DB;

    if (!is_string($cm->availability) || strlen($cm->availability) == 0) {
        return;
    }

    $availability = json_decode($cm->availability);
    $availability->showc = array(false);
    $cm->availability = json_encode($availability);

    $DB->set_field('course_modules', 'availability', $cm->availability, array('id' => $cm->id));
}