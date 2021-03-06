<template>
  <transition name="asd__fade">
    <div
      :id="wrapperId"
      class="asd__wrapper"
      v-show="showDatepicker"
      ref="wrapper"
      :class="wrapperClasses"
      :style="showFullscreen ? undefined : wrapperStyles"
      v-click-outside="handleClickOutside"
    >
      <div class="asd__mobile-header asd__mobile-only" v-if="showFullscreen">
        <div class="asd__mobile-close" @click="closeDatepicker">
          <div class="asd__mobile-close-icon">X</div>
        </div>
        <h3>{{ mobileHeader }}</h3>
      </div>
      <div class="asd__datepicker-header">
        <div class="asd__change-month-button asd__change-month-button--previous">
          <button @click="previousMonth" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z" /></svg>
          </button>
        </div>
        <div class="asd__change-month-button asd__change-month-button--next">
          <button @click="nextMonth" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" /></svg>
          </button>
        </div>
      </div>

      <div class="asd__inner-wrapper" :style="innerStyles">
        <transition-group name="asd__list-complete" tag="div">
          <div
            v-for="(month, monthIndex) in months"
            :key="month.firstDateOfMonth"
            class="asd__month"
            ref="month"
            :class="{'asd__month--hidden': monthIndex === 0 || monthIndex > showMonths, 'animate-rtl': jumpDateIsBefore}"
            :style="monthWidthStyles"
          >
            <div class="asd__month-name">{{ month.monthName }} {{ month.year }}</div>

            <table class="asd__month-table" role="presentation">
              <thead>
                <tr class="asd__day-titles">
                  <th class="asd__day-title" v-for="(day, index) in daysShort" :key="`day-${index}`">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="asd__week" v-for="(week, index) in month.weeks" :key="index">
                  <td
                    class="asd__day"
                    v-for="({fullDate, dayNumber}, index) in week"
                    :key="index + '_' + dayNumber"
                    :data-date="fullDate"
                    :class="{
                      'asd__day--enabled': dayNumber !== 0,
                      'asd__day--empty': dayNumber === 0,
                      'asd__day--default': isDefault(fullDate) || (initial && !isDisabled(fullDate)),
                      'asd__day--disabled': isDisabled(fullDate),
                      'asd__day--selected': selectedDate1 === fullDate || selectedDate2 === fullDate,
                      'asd__day--selected-date-one': selectedDate1 === fullDate && isRangeMode,
                      'asd__day--selected-date-two': selectedDate2 === fullDate && isRangeMode,
                      'asd__day--in-range': isInRange(fullDate),
                      'asd__day--holiday': isHoliday(fullDate)
                    }"
                    :title="getHolidayName(fullDate)"
                    @mouseover="() => { setHoverDate(fullDate) }"
                  >
                    <button
                      class="asd__day-button"
                      type="button"
                      v-if="dayNumber"
                      :date="fullDate"
                      :disabled="isDisabled(fullDate)"
                      @click="onDayClick(fullDate)"
                    >{{ dayNumber }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition-group>
      </div>
      <div class="asd__action-buttons" v-if="mode !== 'single' && showActionButtons">
        <button @click="closeDatepickerCancel" type="button">{{ texts.cancel }}</button>
        <button @click="apply" :style="{color: colors.selected}" type="button">{{ texts.apply }}</button>
      </div>
    </div>
  </transition>
</template>

<script>
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import getDaysInMonth from 'date-fns/get_days_in_month'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isValid from 'date-fns/is_valid'
import { debounce, copyObject, findAncestor, randomString } from './../helpers'
import ClickOutside from '../directives/ClickOutside'

export default {
  name: 'AirbnbStyleDatepicker',
  directives: {
    ClickOutside
  },
  props: {
    triggerElementId: { type: String },
    dateOne: { type: [String, Date], default: format(new Date()) },
    dateTwo: { type: [String, Date] },
    selectDate1: { type: Boolean },
    minDate: { type: [String, Date] },
    endDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    monthsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String, default: 'Select date' },
    disabledDates: { type: Array, default: () => [] },
    showActionButtons: { type: Boolean, default: true },
    isTest: {
      type: Boolean,
      default: () => process.env.NODE_ENV === 'test'
    },
    trigger: { type: Boolean, default: false },
    holidays: { type: Array }
  },
  data() {
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
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
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
    }
  },
  computed: {
    innerStyles() {
      return {
        'margin-left': this.showFullscreen
          ? `-${this.width}%`
          : `-${this.width / this.showMonths}%`
      }
    },
    wrapperClasses() {
      return {
        'asd__wrapper--datepicker-open': this.showDatepicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline,
        'asd__wrapper--initial': this.initial,
        'asd__wrapper--single': this.isSingleMode
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline
          ? '0'
          : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left -
            this.triggerWrapperPosition.left +
            this.offsetX +
            'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right -
            this.triggerPosition.right +
            this.offsetX +
            'px'
          : '',
        width: this.width + '%',
        zIndex: this.inline ? '0' : '100'
      }
    },
    monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.width + '%' : this.width / this.showMonths + '%'
      }
    },
    showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    datesSelected() {
      return !!(
        (this.selectedDate1 && this.selectedDate1 !== '') ||
        (this.selectedDate2 && this.selectedDate2 !== '')
      )
    },
    allDatesSelected() {
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== ''
      )
    },
    hasMinDate() {
      return !!(this.minDate && this.minDate !== '')
    },
    isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode() {
      return this.mode === 'single'
    },
    datePropsCompound() {
      // used to watch for changes in props, and update GUI accordingly
      return this.dateOne + this.dateTwo
    },
    holidaysPropsCompound() {
      return this.holidays
    },
    isDateTwoBeforeDateOne() {
      if (!this.dateTwo) {
        return false
      }
      return isBefore(this.dateTwo, this.dateOne)
    },
    visibleMonths() {
      const firstMonthArray = this.months.filter((m, index) => index > 0)
      return [...Array(this.showMonths)].map(
        (_, index) => firstMonthArray[index].firstDateOfMonth
      )
    }
  },
  watch: {
    holidaysPropsCompound(newValue) {
      this.holidays = newValue
    },
    selectDate1(newValue) {
      this.isSelectingDate1 = newValue
      if (this.initial && !this.isSelectingDate1) {
        this.initial = false
      }
    },
    selectedDate1(newValue, oldValue) {
      let newDate =
        !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-one-selected', newDate)
    },
    selectedDate2(newValue, oldValue) {
      let newDate =
        !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-two-selected', newDate)
    },
    mode(newValue, oldValue) {
      this.setStartDates()
    },
    datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingDate = this.dateOne
        this.setStartDates()
        this.generateMonths()
      }
      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = ''
        this.$emit('date-two-selected', '')
      }
    },
    trigger(newValue, oldValue) {
      if (newValue) {
        setTimeout(() => {
          this.openDatepicker()
        }, 0)
      }
    }
  },
  created() {
    this.setupDatepicker()

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek()
    }

    this._handleWindowResizeEvent = debounce(() => {
      this.generateMonths()
      this.positionDatepicker()
      this.setStartDates()
    }, 200)
    this._handleWindowClickEvent = event => {
      if (event.target.id === this.triggerElementId) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleDatepicker()
      }
    }
    window.addEventListener('resize', this._handleWindowResizeEvent)
    window.addEventListener('click', this._handleWindowClickEvent)
  },
  mounted() {
    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId)

    this.setStartDates()
    this.generateMonths()

    if (this.startOpen || this.inline) {
      this.openDatepicker()
    }

    this.triggerElement.addEventListener('keyup', this.handleTriggerInput)
  },
  destroyed() {
    window.removeEventListener('resize', this._handleWindowResizeEvent)
    window.removeEventListener('click', this._handleWindowClickEvent)

    this.triggerElement.removeEventListener('keyup', this.handleTriggerInput)
  },
  methods: {
    handleClickOutside(event) {
      if (
        event.target.id === this.triggerElementId ||
        !this.showDatepicker ||
        this.inline
      ) {
        return
      }
      this.closeDatepicker()
    },
    handleTriggerInput(event) {
      const keys = {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37
      }
      if (
        event.keyCode === keys.arrowDown &&
        !event.shiftKey &&
        !this.showDatepicker
      ) {
        this.openDatepicker()
      } else if (
        event.keyCode === keys.arrowUp &&
        !event.shiftKey &&
        this.showDatepicker
      ) {
        this.closeDatepicker()
      } else if (
        event.keyCode === keys.arrowRight &&
        !event.shiftKey &&
        this.showDatepicker
      ) {
        this.nextMonth()
      } else if (
        event.keyCode === keys.arrowLeft &&
        !event.shiftKey &&
        this.showDatepicker
      ) {
        this.previousMonth()
      } else {
        if (this.mode === 'single') {
          this.setDateFromText(event.target.value)
        }
      }
    },
    setDateFromText(value) {
      if (value.length < 10) {
        return
      }
      // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
      const isFormatYearFirst = value.match(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
      )
      const isFormatDayFirst = value.match(
        /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/
      )

      if (!isFormatYearFirst && !isFormatDayFirst) {
        return
      }
      if (isFormatDayFirst) {
        //convert to YYYY-MM-DD
        value = `${value.substring(6, 10)}-${value.substring(
          3,
          5
        )}-${value.substring(0, 2)}`
      }

      const valueAsDateObject = new Date(value)
      if (!isValid(valueAsDateObject)) {
        return
      }
      const formattedDate = format(valueAsDateObject, this.dateFormat)
      if (
        this.isDateDisabled(formattedDate) ||
        this.isBeforeMinDate(formattedDate) ||
        this.isAfterEndDate(formattedDate)
      ) {
        return
      }
      this.startingDate = subMonths(formattedDate, 1)
      this.generateMonths()
      this.selectDate(formattedDate)
    },
    generateMonths() {
      this.months = []
      for (let i = 0; i < this.showMonths + 2; i++) {
        this.months.push(this.getMonth(this.startingDate))
        this.startingDate = this.addMonths(this.startingDate)
      }
    },
    setupDatepicker() {
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst)
      }
      if (this.$options.colors) {
        const colors = copyObject(this.$options.colors)
        this.colors.selected = colors.selected || this.colors.selected
        this.colors.inRange = colors.inRange || this.colors.inRange
        this.colors.selectedText =
          colors.selectedText || this.colors.selectedText
        this.colors.text = colors.text || this.colors.text
        this.colors.inRangeBorder =
          colors.inRangeBorder || this.colors.inRangeBorder
        this.colors.disabled = colors.disabled || this.colors.disabled
      }
      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames)
      }
      if (this.$options.days && this.$options.days.length === 7) {
        this.days = copyObject(this.$options.days)
      }
      if (this.$options.daysShort && this.$options.daysShort.length === 7) {
        this.daysShort = copyObject(this.$options.daysShort)
      }
      if (this.$options.texts) {
        const texts = copyObject(this.$options.texts)
        this.texts.apply = texts.apply || this.texts.apply
        this.texts.cancel = texts.cancel || this.texts.cancel
      }
      console.log(this.$options.visibleMonths);
      if (this.$options.visibleMonths) {
        this.showMonths = this.$options.visibleMonths
      }
    },
    setStartDates() {
      let startDate = this.dateOne || new Date()
      if (this.hasMinDate && isBefore(startDate, this.minDate)) {
        startDate = this.minDate
      }
      this.startingDate = this.subtractMonths(startDate)
      this.selectedDate1 = this.dateOne
      this.selectedDate2 = this.dateTwo
    },
    setSundayToFirstDayInWeek() {
      const lastDay = this.days.pop()
      this.days.unshift(lastDay)
      const lastDayShort = this.daysShort.pop()
      this.daysShort.unshift(lastDayShort)
    },
    getMonth(date) {
      const firstDateOfMonth = format(date, 'YYYY-MM-01')
      const year = format(date, 'YYYY')
      const monthNumber = parseInt(format(date, 'M'))
      const monthName = this.monthNames[monthNumber - 1]

      return {
        year,
        firstDateOfMonth,
        monthName,
        monthNumber,
        weeks: this.getWeeks(firstDateOfMonth)
      }
    },
    getWeeks(date) {
      const weekDayNotInMonth = { dayNumber: 0 }
      const daysInMonth = getDaysInMonth(date)
      const year = format(date, 'YYYY')
      const month = format(date, 'MM')
      let firstDayInWeek = parseInt(format(date, this.sundayFirst ? 'd' : 'E'))
      if (this.sundayFirst) {
        firstDayInWeek++
      }
      let weeks = []
      let week = []

      // add empty days to get first day in correct position
      for (let s = 1; s < firstDayInWeek; s++) {
        week.push(weekDayNotInMonth)
      }
      for (let d = 0; d < daysInMonth; d++) {
        let isLastDayInMonth = d >= daysInMonth - 1
        let dayNumber = d + 1
        let dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber
        week.push({
          dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull
        })

        if (week.length === 7) {
          weeks.push(week)
          week = []
        } else if (isLastDayInMonth) {
          for (let i = 0; i < 7 - week.length; i++) {
            week.push(weekDayNotInMonth)
          }
          weeks.push(week)
          week = []
        }
      }
      return weeks
    },
    selectDate(date) {
      if (
        this.isBeforeMinDate(date) ||
        this.isAfterEndDate(date) ||
        this.isDateDisabled(date)
      ) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date
        this.closeDatepicker()
        return
      }

      if ((this.selectedDate1 && this.selectedDate2) && this.isSelectingDate1) {
        if (this.selectedDate1 === date) {
          // if dates are equal, the watcher doesn't get called, so we emit here.
          this.$emit('date-one-selected', date)
        }

        this.selectedDate1 = ''
        this.selectedDate2 = ''
      }
      if (this.isSelectingDate1) {
        this.selectedDate1 = date
        this.isSelectingDate1 = false
      } else {
        this.selectedDate2 = date
        this.isSelectingDate1 = true
      }
    },
    setHoverDate(date) {
      this.hoverDate = date
    },
    isSelected(date) {
      if (!date) {
        return
      }
      return this.selectedDate1 === date || this.selectedDate2 === date
    },
    isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.selectedDate2)) ||
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.hoverDate) &&
          !this.allDatesSelected)
      )
    },
    isInitial() {
      return this.initial
    },
    isBeforeMinDate(date) {
      if (!this.minDate) {
        return false
      }
      return isBefore(date, this.minDate)
    },
    isBeforeSelectedDate1WhileSelectingDate2(date) {
      return this.isRangeMode &&
             isBefore(date, this.selectedDate1) &&
             (!this.selectedDate2 || !this.isSelectingDate1)
    },
    isAfterEndDate(date) {
      if (!this.endDate) {
        return false
      }
      return isAfter(date, this.endDate)
    },
    isDateDisabled(date) {
      const isDisabled = this.disabledDates.indexOf(date) > -1
      return isDisabled
    },
    isDisabled(date) {
      return (
        this.isDateDisabled(date) ||
        this.isBeforeMinDate(date) ||
        this.isBeforeSelectedDate1WhileSelectingDate2(date) ||
        this.isAfterEndDate(date)
      )
    },
    isDefault(date) {
      return (
        !this.isDisabled(date) &&
        this.dayNumber !== 0 &&
        !this.isSelected(date) &&
        !this.isInRange(date)
      )
    },
    isHoliday(date) {
      return this.holidays && (date in this.holidays)
    },
    getHolidayName(date) {
      return this.holidays && this.holidays[date]
    },
    previousMonth() {
      this.jumpDateIsBefore = false
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth)

      this.months.unshift(this.getMonth(this.startingDate))
      this.months.splice(this.months.length - 1, 1)
      this.$emit('previous-month', this.visibleMonths)
    },
    jumpToDate(date) {
      this.startingDate = subMonths(date, 1)
      let month = this.getMonth(date)
      let visibleMonths = this.visibleMonths
      let firstVisibleMonth = this.getMonth(visibleMonths[0])
      let difference = month.monthNumber - firstVisibleMonth.monthNumber
      let differenceRespectingYears = (month.year - firstVisibleMonth.year) * 12 + difference

      if (this.visibleMonths.indexOf(date) < 0) {
        this.jumpDateIsBefore = differenceRespectingYears < 0
        this.$nextTick(() => {
          this.generateMonths()
        })
      }
    },
    nextMonth() {
      this.jumpDateIsBefore = false
      this.startingDate = this.addMonths(
        this.months[this.months.length - 1].firstDateOfMonth
      )
      this.months.push(this.getMonth(this.startingDate))

      setTimeout(() => {
        this.months.splice(0, 1)
        this.$emit('next-month', this.visibleMonths)
      }, 100)
    },
    subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat)
    },
    addMonths(date) {
      return format(addMonths(date, 1), this.dateFormat)
    },
    toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker()
      } else {
        this.openDatepicker()
      }
    },
    openDatepicker() {
      this.positionDatepicker()
      this.setStartDates()
      this.triggerElement.classList.add('datepicker-open')
      this.showDatepicker = true
      this.initialDate1 = this.dateOne
      this.initialDate2 = this.dateTwo
      this.$emit('opened')
    },
    closeDatepickerCancel() {
      if (this.showDatepicker) {
        this.selectedDate1 = this.initialDate1
        this.selectedDate2 = this.initialDate2
        this.closeDatepicker()
      }
    },
    closeDatepicker() {
      if (this.inline) {
        return
      }
      this.showDatepicker = false
      this.triggerElement.classList.remove('datepicker-open')
      this.$emit('closed')
    },
    apply() {
      this.$emit('apply')
      this.closeDatepicker()
    },
    positionDatepicker() {
      const triggerWrapperElement = findAncestor(
        this.triggerElement,
        '.datepicker-trigger'
      )
      this.triggerPosition = this.triggerElement.getBoundingClientRect()
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect()
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 }
      }

      const viewportWidth =
        document.documentElement.clientWidth || window.innerWidth
      this.viewportWidth = viewportWidth + 'px'
      this.isMobile = viewportWidth < 768
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024
      this.showMonths = this.isMobile
        ? 1
        : this.isTablet && this.monthsToShow > 2 ? 2 : this.monthsToShow

      this.$nextTick(function() {
        const datepickerWrapper = document.getElementById(this.wrapperId)
        if (!this.triggerElement || !datepickerWrapper) {
          return
        }

        const rightPosition =
          this.triggerElement.getBoundingClientRect().left +
          datepickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewportWidth
      })
    },
    onDayClick(fullDate) {
      this.initial = false
      this.selectDate(fullDate)
    }
  }
}
</script>

<style lang="scss">
@import './../styles/transitions';

$default-width: 800px;
$tablet: 768px;
$color-gray: rgba(0, 0, 0, 0.2);
$border-normal: 1px solid $color-gray;
$border: 1px solid #e4e7e7;
$transition-time: 0.3s;

*,
*:after,
*:before {
  box-sizing: border-box;
}

.datepicker-trigger {
  position: relative;
  overflow: visible;
}

.asd {
  &__wrapper {
    border: $border-normal;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    background-color: white;
    max-width: $default-width;

    &--full-screen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: none;
      z-index: 100;
    }
  }
  &__inner-wrapper {
    transition: all $transition-time ease;
    position: relative;
    max-width: 100%;
  }
  &__datepicker-header {
    position: relative;
  }
  &__change-month-button {
    position: absolute;
    top: 12px;
    z-index: 10;
    background: white;

    &--previous {
      left: 0;
      padding-left: 15px;
    }
    &--next {
      right: 0;
      padding-right: 15px;
    }

    > button {
      background-color: white;
      border: $border;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;

      &:hover {
        border: 1px solid #c4c4c4;
      }

      > svg {
        height: 19px;
        width: 19px;
        fill: #82888a;
      }
    }
  }

  &__day-title {
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.8em;
    text-transform: lowercase;
  }

  &__month-table {
    border-collapse: collapse;
    border-spacing: 0;
    background: white;
    width: 100%;
    max-width: 100%;
  }

  &__month {
    transition: all $transition-time ease;
    display: inline-block;
    padding: 15px;

    &--hidden {
      height: 275px;
      visibility: hidden;
    }
  }
  &__month-name {
    font-size: 1.3em;
    text-align: center;
    margin: 0 0 30px;
    line-height: 1.4em;
    text-transform: lowercase;
    font-weight: bold;
  }

  &__day {
    $size: 38px;
    height: $size;
    padding: 0;
    overflow: hidden;
    width: calc(100% / 7);

    &--enabled {
      border: $border;
      &:hover {
        background-color: #e4e7e7;
      }
    }
    &--selected {
      background-color: rgb(0, 166, 153);
      border: 1px double rgb(0, 166, 153);
      color: #fff;
      &:hover {
          background-color: rgb(0, 166, 153);
      }
    }
    &--in-range {
      background-color: rgb(102, 226, 218);
      border: 1px double rgb(51, 218, 205);
      color: #fff;
      &:hover {
          background-color: rgb(102, 226, 218);
      }
    }
    &--disabled,
    &--empty {
      opacity: 0.5;

      button {
        cursor: default;
      }
    }
    &--empty {
      border: none;
      background-color: transparent;
    }
    &--disabled {
      &:hover {
        background-color: transparent;
      }
    }
  }
  &__day-button {
    background: transparent;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: center;
    user-select: none;
    font-size: 15px;
    font-weight: inherit;
    padding: 0;
  }

  &__action-buttons {
    min-height: 50px;
    padding-top: 10px;
    button {
      display: block;
      position: relative;
      background: transparent;
      border: none;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
      &:nth-child(1) {
        float: left;
        left: 15px;
      }
      &:nth-child(2) {
        float: right;
        right: 15px;
      }
    }
  }

  &__mobile-header {
    border-bottom: $border-normal;
    position: relative;
    padding: 15px 15px 15px 15px !important;
    text-align: center;
    height: 50px;
    h3 {
      font-size: 20px;
      margin: 0;
    }
  }
  &__mobile-only {
    display: none;
    @media (max-width: 600px) {
      display: block;
    }
  }
  &__mobile-close {
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;

    &__icon {
      position: relative;
      font-size: 1.6em;
      font-weight: bold;
      padding: 0;
    }
  }
}
</style>
