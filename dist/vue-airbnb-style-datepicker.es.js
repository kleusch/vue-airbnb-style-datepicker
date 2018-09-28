import format from 'date-fns/format';
import subMonths from 'date-fns/sub_months';
import _addMonths from 'date-fns/add_months';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isValid from 'date-fns/is_valid';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/* eslint-disable */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
    var i = matches.length;

    while (--i >= 0 && matches.item(i) !== this) {}

    return i > -1;
  };
}

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {

      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
} // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex


if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function value(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


      var thisArg = arguments[1]; // 5. Let k be 0.

      var k = 0; // 6. Repeat, while k < len

      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];

        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        } // e. Increase k by 1.


        k++;
      } // 7. Return -1.


      return -1;
    }
  });
}

/* eslint-disable */
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
var copyObject = function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
};
var findAncestor = function findAncestor(element, selector) {
  if (!element) {
    return null;
  }

  if (typeof element.closest === 'function') {
    return element.closest(selector) || null;
  }

  while (element) {
    if (element.matches(selector)) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
};
var randomString = function randomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var AirbnbStyleDatepicker = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('transition', {
      attrs: {
        "name": "asd__fade"
      }
    }, [_c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.showDatepicker,
        expression: "showDatepicker"
      }, {
        name: "click-outside",
        rawName: "v-click-outside",
        value: _vm.handleClickOutside,
        expression: "handleClickOutside"
      }],
      ref: "wrapper",
      staticClass: "asd__wrapper",
      class: _vm.wrapperClasses,
      style: _vm.showFullscreen ? undefined : _vm.wrapperStyles,
      attrs: {
        "id": _vm.wrapperId
      }
    }, [_vm.showFullscreen ? _c('div', {
      staticClass: "asd__mobile-header asd__mobile-only"
    }, [_c('div', {
      staticClass: "asd__mobile-close",
      on: {
        "click": _vm.closeDatepicker
      }
    }, [_c('div', {
      staticClass: "asd__mobile-close-icon"
    }, [_vm._v("X")])]), _vm._v(" "), _c('h3', [_vm._v(_vm._s(_vm.mobileHeader))])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "asd__datepicker-header"
    }, [_c('div', {
      staticClass: "asd__change-month-button asd__change-month-button--previous"
    }, [_c('button', {
      attrs: {
        "type": "button"
      },
      on: {
        "click": _vm.previousMonth
      }
    }, [_c('svg', {
      attrs: {
        "viewBox": "0 0 1000 1000"
      }
    }, [_c('path', {
      attrs: {
        "d": "M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"
      }
    })])])]), _vm._v(" "), _c('div', {
      staticClass: "asd__change-month-button asd__change-month-button--next"
    }, [_c('button', {
      attrs: {
        "type": "button"
      },
      on: {
        "click": _vm.nextMonth
      }
    }, [_c('svg', {
      attrs: {
        "viewBox": "0 0 1000 1000"
      }
    }, [_c('path', {
      attrs: {
        "d": "M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"
      }
    })])])])]), _vm._v(" "), _c('div', {
      staticClass: "asd__inner-wrapper",
      style: _vm.innerStyles
    }, [_c('transition-group', {
      attrs: {
        "name": "asd__list-complete",
        "tag": "div"
      }
    }, _vm._l(_vm.months, function (month, monthIndex) {
      return _c('div', {
        key: month.firstDateOfMonth,
        ref: "month",
        refInFor: true,
        staticClass: "asd__month",
        class: {
          'asd__month--hidden': monthIndex === 0 || monthIndex > _vm.showMonths,
          'animate-rtl': _vm.jumpDateIsBefore
        },
        style: _vm.monthWidthStyles
      }, [_c('div', {
        staticClass: "asd__month-name"
      }, [_vm._v(_vm._s(month.monthName) + " " + _vm._s(month.year))]), _vm._v(" "), _c('table', {
        staticClass: "asd__month-table",
        attrs: {
          "role": "presentation"
        }
      }, [_c('thead', [_c('tr', {
        staticClass: "asd__day-titles"
      }, _vm._l(_vm.daysShort, function (day, index) {
        return _c('th', {
          key: "day-".concat(index),
          staticClass: "asd__day-title"
        }, [_vm._v(_vm._s(day))]);
      }))]), _vm._v(" "), _c('tbody', _vm._l(month.weeks, function (week, index) {
        return _c('tr', {
          key: index,
          staticClass: "asd__week"
        }, _vm._l(week, function (_ref, index) {
          var fullDate = _ref.fullDate,
              dayNumber = _ref.dayNumber;
          return _c('td', {
            key: index + '_' + dayNumber,
            staticClass: "asd__day",
            class: {
              'asd__day--enabled': dayNumber !== 0,
              'asd__day--empty': dayNumber === 0,
              'asd__day--default': _vm.isDefault(fullDate) || _vm.initial && !_vm.isDisabled(fullDate),
              'asd__day--disabled': _vm.isDisabled(fullDate),
              'asd__day--selected': _vm.selectedDate1 === fullDate || _vm.selectedDate2 === fullDate,
              'asd__day--selected-date-one': _vm.selectedDate1 === fullDate && _vm.isRangeMode,
              'asd__day--selected-date-two': _vm.selectedDate2 === fullDate && _vm.isRangeMode,
              'asd__day--in-range': _vm.isInRange(fullDate),
              'asd__day--holiday': _vm.isHoliday(fullDate)
            },
            attrs: {
              "data-date": fullDate,
              "title": _vm.getHolidayName(fullDate)
            },
            on: {
              "mouseover": function mouseover() {
                _vm.setHoverDate(fullDate);
              }
            }
          }, [dayNumber ? _c('button', {
            staticClass: "asd__day-button",
            attrs: {
              "type": "button",
              "date": fullDate,
              "disabled": _vm.isDisabled(fullDate)
            },
            on: {
              "click": function click($event) {
                _vm.onDayClick(fullDate);
              }
            }
          }, [_vm._v(_vm._s(dayNumber))]) : _vm._e()]);
        }));
      }))])]);
    }))], 1), _vm._v(" "), _vm.mode !== 'single' && _vm.showActionButtons ? _c('div', {
      staticClass: "asd__action-buttons"
    }, [_c('button', {
      attrs: {
        "type": "button"
      },
      on: {
        "click": _vm.closeDatepickerCancel
      }
    }, [_vm._v(_vm._s(_vm.texts.cancel))]), _vm._v(" "), _c('button', {
      style: {
        color: _vm.colors.selected
      },
      attrs: {
        "type": "button"
      },
      on: {
        "click": _vm.apply
      }
    }, [_vm._v(_vm._s(_vm.texts.apply))])]) : _vm._e()])]);
  },
  staticRenderFns: [],
  name: 'AirbnbStyleDatepicker',
  props: {
    triggerElementId: {
      type: String
    },
    dateOne: {
      type: [String, Date],
      default: format(new Date())
    },
    dateTwo: {
      type: [String, Date]
    },
    selectDate1: {
      type: Boolean
    },
    minDate: {
      type: [String, Date]
    },
    endDate: {
      type: [String, Date]
    },
    mode: {
      type: String,
      default: 'range'
    },
    offsetY: {
      type: Number,
      default: 0
    },
    offsetX: {
      type: Number,
      default: 0
    },
    monthsToShow: {
      type: Number,
      default: 2
    },
    startOpen: {
      type: Boolean
    },
    fullscreenMobile: {
      type: Boolean
    },
    inline: {
      type: Boolean
    },
    mobileHeader: {
      type: String,
      default: 'Select date'
    },
    disabledDates: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    showActionButtons: {
      type: Boolean,
      default: true
    },
    isTest: {
      type: Boolean,
      default: function _default() {
        return process.env.NODE_ENV === 'test';
      }
    },
    trigger: {
      type: Boolean,
      default: false
    },
    holidays: {
      type: Array
    }
  },
  data: function data() {
    return {
      wrapperId: 'airbnb-style-datepicker-wrapper-' + randomString(5),
      dateFormat: 'YYYY-MM-DD',
      showDatepicker: false,
      showMonths: 2,
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#33dacd',
        disabled: '#fff'
      },
      sundayFirst: false,
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      daysShort: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
      //daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      texts: {
        apply: 'Apply',
        cancel: 'Cancel'
      },
      startingDate: '',
      months: [],
      width: 100,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      initial: true,
      hoverDate: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: window.innerWidth + 'px',
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth <= 1024,
      triggerElement: undefined,
      jumpDateIsBefore: false
    };
  },
  computed: {
    innerStyles: function innerStyles() {
      return {
        'margin-left': this.showFullscreen ? "-".concat(this.width, "%") : "-".concat(this.width / this.showMonths, "%")
      };
    },
    wrapperClasses: function wrapperClasses() {
      return {
        'asd__wrapper--datepicker-open': this.showDatepicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline,
        'asd__wrapper--initial': this.initial,
        'asd__wrapper--single': this.isSingleMode
      };
    },
    wrapperStyles: function wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline ? '0' : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight ? this.triggerPosition.left - this.triggerWrapperPosition.left + this.offsetX + 'px' : '',
        right: this.alignRight ? this.triggerWrapperPosition.right - this.triggerPosition.right + this.offsetX + 'px' : '',
        width: this.width + '%',
        zIndex: this.inline ? '0' : '100'
      };
    },
    monthWidthStyles: function monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.width + '%' : this.width / this.showMonths + '%'
      };
    },
    showFullscreen: function showFullscreen() {
      return this.isMobile && this.fullscreenMobile;
    },
    datesSelected: function datesSelected() {
      return !!(this.selectedDate1 && this.selectedDate1 !== '' || this.selectedDate2 && this.selectedDate2 !== '');
    },
    allDatesSelected: function allDatesSelected() {
      return !!(this.selectedDate1 && this.selectedDate1 !== '' && this.selectedDate2 && this.selectedDate2 !== '');
    },
    hasMinDate: function hasMinDate() {
      return !!(this.minDate && this.minDate !== '');
    },
    isRangeMode: function isRangeMode() {
      return this.mode === 'range';
    },
    isSingleMode: function isSingleMode() {
      return this.mode === 'single';
    },
    datePropsCompound: function datePropsCompound() {
      // used to watch for changes in props, and update GUI accordingly
      return this.dateOne + this.dateTwo;
    },
    holidaysPropsCompound: function holidaysPropsCompound() {
      return this.holidays;
    },
    isDateTwoBeforeDateOne: function isDateTwoBeforeDateOne() {
      if (!this.dateTwo) {
        return false;
      }

      return isBefore(this.dateTwo, this.dateOne);
    },
    visibleMonths: function visibleMonths() {
      var firstMonthArray = this.months.filter(function (m, index) {
        return index > 0;
      });
      return _toConsumableArray(Array(this.showMonths)).map(function (_, index) {
        return firstMonthArray[index].firstDateOfMonth;
      });
    }
  },
  watch: {
    holidaysPropsCompound: function holidaysPropsCompound(newValue) {
      this.holidays = newValue;
    },
    selectDate1: function selectDate1(newValue) {
      this.isSelectingDate1 = newValue;

      if (this.initial && !this.isSelectingDate1) {
        this.initial = false;
      }
    },
    selectedDate1: function selectedDate1(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('date-one-selected', newDate);
    },
    selectedDate2: function selectedDate2(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('date-two-selected', newDate);
    },
    mode: function mode(newValue, oldValue) {
      this.setStartDates();
    },
    datePropsCompound: function datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingDate = this.dateOne;
        this.setStartDates();
        this.generateMonths();
      }

      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = '';
        this.$emit('date-two-selected', '');
      }
    },
    trigger: function trigger(newValue, oldValue) {
      if (newValue) {
        this.openDatepicker();
      }
    }
  },
  created: function created() {
    var _this = this;

    this.setupDatepicker();

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek();
    }

    this._handleWindowResizeEvent = debounce(function () {
      _this.generateMonths();

      _this.positionDatepicker();

      _this.setStartDates();
    }, 200);

    this._handleWindowClickEvent = function (event) {
      if (event.target.id === _this.triggerElementId) {
        event.stopPropagation();
        event.preventDefault();

        _this.toggleDatepicker();
      }
    };

    window.addEventListener('resize', this._handleWindowResizeEvent);
    window.addEventListener('click', this._handleWindowClickEvent);
  },
  mounted: function mounted() {
    this.triggerElement = this.isTest ? document.createElement('input') : document.getElementById(this.triggerElementId);
    this.setStartDates();
    this.generateMonths();

    if (this.startOpen || this.inline) {
      this.openDatepicker();
    }

    this.triggerElement.addEventListener('keyup', this.handleTriggerInput);
  },
  destroyed: function destroyed() {
    window.removeEventListener('resize', this._handleWindowResizeEvent);
    window.removeEventListener('click', this._handleWindowClickEvent);
    this.triggerElement.removeEventListener('keyup', this.handleTriggerInput);
  },
  methods: {
    handleClickOutside: function handleClickOutside(event) {
      if (event.target.id === this.triggerElementId || !this.showDatepicker || this.inline) {
        return;
      }

      this.closeDatepicker();
    },
    handleTriggerInput: function handleTriggerInput(event) {
      var keys = {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37
      };

      if (event.keyCode === keys.arrowDown && !event.shiftKey && !this.showDatepicker) {
        this.openDatepicker();
      } else if (event.keyCode === keys.arrowUp && !event.shiftKey && this.showDatepicker) {
        this.closeDatepicker();
      } else if (event.keyCode === keys.arrowRight && !event.shiftKey && this.showDatepicker) {
        this.nextMonth();
      } else if (event.keyCode === keys.arrowLeft && !event.shiftKey && this.showDatepicker) {
        this.previousMonth();
      } else {
        if (this.mode === 'single') {
          this.setDateFromText(event.target.value);
        }
      }
    },
    setDateFromText: function setDateFromText(value) {
      if (value.length < 10) {
        return;
      } // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'


      var isFormatYearFirst = value.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/);
      var isFormatDayFirst = value.match(/^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/);

      if (!isFormatYearFirst && !isFormatDayFirst) {
        return;
      }

      if (isFormatDayFirst) {
        //convert to YYYY-MM-DD
        value = "".concat(value.substring(6, 10), "-").concat(value.substring(3, 5), "-").concat(value.substring(0, 2));
      }

      var valueAsDateObject = new Date(value);

      if (!isValid(valueAsDateObject)) {
        return;
      }

      var formattedDate = format(valueAsDateObject, this.dateFormat);

      if (this.isDateDisabled(formattedDate) || this.isBeforeMinDate(formattedDate) || this.isAfterEndDate(formattedDate)) {
        return;
      }

      this.startingDate = subMonths(formattedDate, 1);
      this.generateMonths();
      this.selectDate(formattedDate);
    },
    generateMonths: function generateMonths() {
      this.months = [];

      for (var i = 0; i < this.showMonths + 2; i++) {
        this.months.push(this.getMonth(this.startingDate));
        this.startingDate = this.addMonths(this.startingDate);
      }
    },
    setupDatepicker: function setupDatepicker() {
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst);
      }

      if (this.$options.colors) {
        var colors = copyObject(this.$options.colors);
        this.colors.selected = colors.selected || this.colors.selected;
        this.colors.inRange = colors.inRange || this.colors.inRange;
        this.colors.selectedText = colors.selectedText || this.colors.selectedText;
        this.colors.text = colors.text || this.colors.text;
        this.colors.inRangeBorder = colors.inRangeBorder || this.colors.inRangeBorder;
        this.colors.disabled = colors.disabled || this.colors.disabled;
      }

      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames);
      }

      if (this.$options.days && this.$options.days.length === 7) {
        this.days = copyObject(this.$options.days);
      }

      if (this.$options.daysShort && this.$options.daysShort.length === 7) {
        this.daysShort = copyObject(this.$options.daysShort);
      }

      if (this.$options.texts) {
        var texts = copyObject(this.$options.texts);
        this.texts.apply = texts.apply || this.texts.apply;
        this.texts.cancel = texts.cancel || this.texts.cancel;
      }

      console.log(this.$options.visibleMonths);

      if (this.$options.visibleMonths) {
        this.showMonths = this.$options.visibleMonths;
      }
    },
    setStartDates: function setStartDates() {
      var startDate = this.dateOne || new Date();

      if (this.hasMinDate && isBefore(startDate, this.minDate)) {
        startDate = this.minDate;
      }

      this.startingDate = this.subtractMonths(startDate);
      this.selectedDate1 = this.dateOne;
      this.selectedDate2 = this.dateTwo;
    },
    setSundayToFirstDayInWeek: function setSundayToFirstDayInWeek() {
      var lastDay = this.days.pop();
      this.days.unshift(lastDay);
      var lastDayShort = this.daysShort.pop();
      this.daysShort.unshift(lastDayShort);
    },
    getMonth: function getMonth(date) {
      var firstDateOfMonth = format(date, 'YYYY-MM-01');
      var year = format(date, 'YYYY');
      var monthNumber = parseInt(format(date, 'M'));
      var monthName = this.monthNames[monthNumber - 1];
      return {
        year: year,
        firstDateOfMonth: firstDateOfMonth,
        monthName: monthName,
        monthNumber: monthNumber,
        weeks: this.getWeeks(firstDateOfMonth)
      };
    },
    getWeeks: function getWeeks(date) {
      var weekDayNotInMonth = {
        dayNumber: 0
      };
      var daysInMonth = getDaysInMonth(date);
      var year = format(date, 'YYYY');
      var month = format(date, 'MM');
      var firstDayInWeek = parseInt(format(date, this.sundayFirst ? 'd' : 'E'));

      if (this.sundayFirst) {
        firstDayInWeek++;
      }

      var weeks = [];
      var week = []; // add empty days to get first day in correct position

      for (var s = 1; s < firstDayInWeek; s++) {
        week.push(weekDayNotInMonth);
      }

      for (var d = 0; d < daysInMonth; d++) {
        var isLastDayInMonth = d >= daysInMonth - 1;
        var dayNumber = d + 1;
        var dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        week.push({
          dayNumber: dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull
        });

        if (week.length === 7) {
          weeks.push(week);
          week = [];
        } else if (isLastDayInMonth) {
          for (var i = 0; i < 7 - week.length; i++) {
            week.push(weekDayNotInMonth);
          }

          weeks.push(week);
          week = [];
        }
      }

      return weeks;
    },
    selectDate: function selectDate(date) {
      if (this.isBeforeMinDate(date) || this.isAfterEndDate(date) || this.isDateDisabled(date)) {
        return;
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date;
        this.closeDatepicker();
        return;
      }

      if (this.selectedDate1 && this.selectedDate2 && this.isSelectingDate1) {
        if (this.selectedDate1 === date) {
          // if dates are equal, the watcher doesn't get called, so we emit here.
          this.$emit('date-one-selected', date);
        }

        this.selectedDate1 = '';
        this.selectedDate2 = '';
      }

      if (this.isSelectingDate1) {
        this.selectedDate1 = date;
        this.isSelectingDate1 = false;
      } else {
        this.selectedDate2 = date;
        this.isSelectingDate1 = true;
      }
    },
    setHoverDate: function setHoverDate(date) {
      this.hoverDate = date;
    },
    isSelected: function isSelected(date) {
      if (!date) {
        return;
      }

      return this.selectedDate1 === date || this.selectedDate2 === date;
    },
    isInRange: function isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false;
      }

      return isAfter(date, this.selectedDate1) && isBefore(date, this.selectedDate2) || isAfter(date, this.selectedDate1) && isBefore(date, this.hoverDate) && !this.allDatesSelected;
    },
    isInitial: function isInitial() {
      return this.initial;
    },
    isBeforeMinDate: function isBeforeMinDate(date) {
      if (!this.minDate) {
        return false;
      }

      return isBefore(date, this.minDate);
    },
    isBeforeSelectedDate1WhileSelectingDate2: function isBeforeSelectedDate1WhileSelectingDate2(date) {
      return this.isRangeMode && isBefore(date, this.selectedDate1) && (!this.selectedDate2 || !this.isSelectingDate1);
    },
    isAfterEndDate: function isAfterEndDate(date) {
      if (!this.endDate) {
        return false;
      }

      return isAfter(date, this.endDate);
    },
    isDateDisabled: function isDateDisabled(date) {
      var isDisabled = this.disabledDates.indexOf(date) > -1;
      return isDisabled;
    },
    isDisabled: function isDisabled(date) {
      return this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isBeforeSelectedDate1WhileSelectingDate2(date) || this.isAfterEndDate(date);
    },
    isDefault: function isDefault(date) {
      return !this.isDisabled(date) && this.dayNumber !== 0 && !this.isSelected(date) && !this.isInRange(date);
    },
    isHoliday: function isHoliday(date) {
      return this.holidays && date in this.holidays;
    },
    getHolidayName: function getHolidayName(date) {
      return this.holidays && this.holidays[date];
    },
    previousMonth: function previousMonth() {
      this.jumpDateIsBefore = false;
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth);
      this.months.unshift(this.getMonth(this.startingDate));
      this.months.splice(this.months.length - 1, 1);
      this.$emit('previous-month', this.visibleMonths);
    },
    jumpToDate: function jumpToDate(date) {
      var _this2 = this;

      this.startingDate = subMonths(date, 1);
      var month = this.getMonth(date);
      var visibleMonths = this.visibleMonths;
      var firstVisibleMonth = this.getMonth(visibleMonths[0]);
      var difference = month.monthNumber - firstVisibleMonth.monthNumber;
      var differenceRespectingYears = (month.year - firstVisibleMonth.year) * 12 + difference;

      if (this.visibleMonths.indexOf(date) < 0) {
        this.jumpDateIsBefore = differenceRespectingYears < 0;
        this.$nextTick(function () {
          _this2.generateMonths();
        });
      }
    },
    nextMonth: function nextMonth() {
      var _this3 = this;

      this.jumpDateIsBefore = false;
      this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth);
      this.months.push(this.getMonth(this.startingDate));
      setTimeout(function () {
        _this3.months.splice(0, 1);

        _this3.$emit('next-month', _this3.visibleMonths);
      }, 100);
    },
    subtractMonths: function subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat);
    },
    addMonths: function addMonths(date) {
      return format(_addMonths(date, 1), this.dateFormat);
    },
    toggleDatepicker: function toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker();
      } else {
        this.openDatepicker();
      }
    },
    openDatepicker: function openDatepicker() {
      this.positionDatepicker();
      this.setStartDates();
      this.triggerElement.classList.add('datepicker-open');
      this.showDatepicker = true;
      this.initialDate1 = this.dateOne;
      this.initialDate2 = this.dateTwo;
      this.$emit('opened');
    },
    closeDatepickerCancel: function closeDatepickerCancel() {
      if (this.showDatepicker) {
        this.selectedDate1 = this.initialDate1;
        this.selectedDate2 = this.initialDate2;
        this.closeDatepicker();
      }
    },
    closeDatepicker: function closeDatepicker() {
      if (this.inline) {
        return;
      }

      this.showDatepicker = false;
      this.triggerElement.classList.remove('datepicker-open');
      this.$emit('closed');
    },
    apply: function apply() {
      this.$emit('apply');
      this.closeDatepicker();
    },
    positionDatepicker: function positionDatepicker() {
      var triggerWrapperElement = findAncestor(this.triggerElement, '.datepicker-trigger');
      this.triggerPosition = this.triggerElement.getBoundingClientRect();

      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect();
      } else {
        this.triggerWrapperPosition = {
          left: 0,
          right: 0
        };
      }

      var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      this.viewportWidth = viewportWidth + 'px';
      this.isMobile = viewportWidth < 768;
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024;
      this.showMonths = this.isMobile ? 1 : this.isTablet && this.monthsToShow > 2 ? 2 : this.monthsToShow;
      this.$nextTick(function () {
        var datepickerWrapper = document.getElementById(this.wrapperId);

        if (!this.triggerElement || !datepickerWrapper) {
          return;
        }

        var rightPosition = this.triggerElement.getBoundingClientRect().left + datepickerWrapper.getBoundingClientRect().width;
        this.alignRight = rightPosition > viewportWidth;
      });
    },
    onDayClick: function onDayClick(fullDate) {
      this.initial = false;
      this.selectDate(fullDate);
    }
  }
};

var ClickOutside = {
  bind: function bind(el, binding, vnode) {
    el.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };

    document.body.addEventListener('click', el.event);
    document.body.addEventListener('touchstart', el.event);
  },
  unbind: function unbind(el) {
    document.body.removeEventListener('click', el.event);
    document.body.removeEventListener('touchstart', el.event);
  }
};

var AirbnbStyleDatepickerPlugin = {
  install: function install(Vue, options) {
    Vue.directive('click-outside', ClickOutside);
    Vue.component(AirbnbStyleDatepicker.name, _objectSpread({}, options, AirbnbStyleDatepicker));
  }
}; // User has to install the component by themselves, to allow to pass options

if (typeof window !== 'undefined' && window.Vue) {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin;
}

export default AirbnbStyleDatepickerPlugin;
