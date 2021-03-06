
'use strict';

/* global require, document, describe, before, beforeEach, after, afterEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');

var SiteNav = require('../js/site-nav').SiteNav;

describe('SiteNav', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
    '<nav class="site-nav js-site-nav">' +
      '<input class="nav-toggle__input" id="nav-toggle" type="checkbox">' +
      '<label for="nav-toggle" class="site-nav__button site-nav__button--left">' +
        'Menu</label>' +
      '<ul id="site-menu" class="site-nav__list">' +
        '<li class="site-nav__item site-nav__item--with-dropdown">' +
          '<a href="/" class="site-nav__link is-current js-nav-drop-link">' +
            'Campaign Finance Data</a>' +
          '<input class="nav-toggle__input js-toggle" id="dropdown-toggle-1" type="checkbox">' +
          '<label for="dropdown-toggle-1" class="site-nav__link nav-toggle__label">' +
            'Campaign Finance Data</label>' +
          '<ul class="site-nav__dropdown">' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" href="/">Search for candidates »</a>' +
            '</li>' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" href="/elections">' +
                  'Search by ZIP code »</a>' +
            '</li>' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" ' +
                'href="/candidates?cycle=2012&amp;cycle=2014&amp;cycle=2016">' +
                  'Browse candidates »</a>' +
            '</li>' +
          '</ul>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link is-disabled">Calendar</a>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link is-disabled">TBD</a>' +
        '</li>' +
      '</ul>' +
    '</nav>'
    );
    this.siteNav = new SiteNav('.js-site-nav');
  });

  describe('constructor()', function() {
    it('should set body to jqueryized selector', function() {
      expect(this.siteNav.$body).to.be.ok;
      expect(this.siteNav.$body.length).to.be.ok;
      expect(this.siteNav.$body.is(this.$fixture.find('nav'))).to.be.true;
    });
  });

  describe('assignAria()', function() {
    beforeEach(function() {
      this.$subLists = this.$fixture.find('#site-menu ul');
    });

    it('should assign an aria label of submenu to sub lists', function() {
      expect(this.$subLists.length).to.be.ok;
      expect(this.$subLists.first().attr('aria-label')).to.equal('submenu');
    });

    it('should assign aria hidden to sub lists', function() {
      expect(this.$subLists.first().attr('aria-hidden')).to.equal('true');
      expect(this.$subLists.last().attr('aria-hidden')).to.equal('true');
    });

    it('should assign aria-haspopup to all links to the sub lists', function() {
      var $link = this.$fixture.find('#site-menu .js-nav-drop-link');
      expect($link.length).to.be.ok;
      expect($link.first().attr('aria-haspopup')).to.equal('true');
    });

    it('should assign an aria label to the whole nav', function() {
      var $nav = this.$fixture.find('.js-site-nav');
      expect($nav.length).to.be.ok;
      expect($nav.attr('aria-label')).to.be.ok;
    });
  });

  describe('handleChange()', function() {
    it('should set the list aria hidden label to the opposite of checked',
        function() {
      var $toggle = this.$fixture.find('.js-toggle');
      var $list = this.$fixture.find('#site-menu ul');
      var testEv = {currentTarget: $toggle};

      this.siteNav.handleChange(testEv);
      expect($list.attr('aria-hidden')).to.not.equal($toggle.is(':checked'));
    });
  });

  describe('hover()', function() {

    beforeEach(function() {
      this.$withDropdown = this.$fixture.find('.site-nav__item--with-dropdown');
      this.$list = this.$fixture.find('#site-menu ul');
    });

    it('should show items on mouseenter', function() {
      this.siteNav.handleMouseEnter({currentTarget: this.$withDropdown.get(0)});
      expect(this.$list.attr('aria-hidden')).to.equal('false');
    });

    it('should hide items on mouseexit', function() {
      this.siteNav.handleMouseExit({currentTarget: this.$withDropdown.get(0)});
      expect(this.$list.attr('aria-hidden')).to.equal('true');
    });
  });
});
