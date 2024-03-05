declare namespace Pay {
  type TimeType = 'today' | 'week' | 'month' | 'year';
  type RangePickerValue = RangePickerProps<moment.Moment>['value'];
}