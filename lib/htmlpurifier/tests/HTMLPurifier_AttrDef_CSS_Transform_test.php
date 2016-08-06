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

/**
 * Unit tests for HTMLPurifier_AttrDef_CSS_Transform class.
 *
 * @package    core_htmlpurifier
 * @category   phpunit
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/form/duration.php');
require_once($CFG->libdir.'/htmlpurifier/HTMLPurifier.safe-includes.php');
require_once($CFG->libdir.'/htmlpurifier/locallib.php');

/**
 * HTMLPurifier_AttrDef_CSS_Transform class test.
 *
 * Contains test cases for testing MoodleQuickForm_duration
 *
 * @package    core_htmlpurifier
 * @category   phpunit
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class HTMLPurifier_AttrDef_CSS_Transform_test extends basic_testcase {
    public function test_validate_translate_basic() {
        $htmlmarkup = "translate(6px, 8px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translate_wrong_param_count() {
        $htmlmarkup = "translate(6px, 8px, 7px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translate3d_basic() {
        $htmlmarkup = "translate3d(6px, 8px, 7px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translate3d_wrong_param_count() {
        $htmlmarkup = "translate3d(6px, 8px, 7px, 5px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translateXYZ_basic() {
        $htmlmarkup = "translateX(6px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translateXYZ_wrong_param_count() {
        $htmlmarkup = "translateX(6px, 7px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_translate_wrong_unit() {
        $htmlmarkup = "translate(6deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotate_basic() {
        $htmlmarkup = "rotate(6deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotate_wrong_param_count() {
        $htmlmarkup = "rotate(6deg, 8deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotate3d_basic() {
        $htmlmarkup = "rotate3d(1.0, 1.0, 1.0, 8deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotate3d_wrong_param_count() {
        $htmlmarkup = "rotate3d(1.0, 1.0, 1.0, 8deg, 8deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotatexyz_basic() {
        $htmlmarkup = "rotateX(6deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotatexyz_wrong_param_count() {
        $htmlmarkup = "rotateX(6deg, 7deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_rotate_wrong_unit() {
        $htmlmarkup = "rotate(6px)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scale_basic() {
        $htmlmarkup = "scale(0.5)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));

        $htmlmarkup = "scale(0.5, 0.2)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scale_wrong_param_count() {
        $htmlmarkup = "scale(0.6, 0.8, 0.9)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scale3d_basic() {
        $htmlmarkup = "scale3d(0.6, 0.8, 0.2)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scale3d_wrong_param_count() {
        $htmlmarkup = "scale3d(0.7, 0.8, 0.3, 0.2)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scaleXYZ_basic() {
        $htmlmarkup = "scaleX(0.1)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertEquals($htmlmarkup, $csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scaleXYZ_wrong_param_count() {
        $htmlmarkup = "scaleX(0.1, 0.2)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }

    public function test_validate_scale_wrong_unit() {
        $htmlmarkup = "scale(0.5deg)";
        $csstransformvalidation = new HTMLPurifier_AttrDef_CSS_Transform();
        $this->assertFalse($csstransformvalidation->validate($htmlmarkup, null, null));
    }
}