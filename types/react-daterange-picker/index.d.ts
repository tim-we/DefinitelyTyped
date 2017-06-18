// Type definitions for React Daterange Picker v1.1.0
// Project: https://github.com/onefinestay/react-daterange-picker
// Definitions by: UNCOVER TRUTH Inc. <https://github.com/uncovertruth/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// TypeScript Version: 2.3

import * as React from "react";
import * as moment from "moment-range";

export default class DateRangePicker extends React.Component<Props, {}> {}
export as namespace ReactDateRangePicker;

interface Props extends React.Props<{}> {
    bemBlock?: string;
    bemNamespace?: string;
    dateStates?: DateState[];
    defaultState?: string;
    disableNavigation?: boolean;
    // Use Number Literal Types after TypeScript 2.0 GA released.
    firstOfWeek?: number; // React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6])
    helpMessage?: string;
    initialFromValue?: boolean;
    initialDate?: Date;
    initialMonth?: number;
    initialYear?: number;
    initialRange?: {};
    maximumDate?: Date;
    minimumDate?: Date;
    numberOfCalendars?: number;
    onHighlightDate?(date: Date): void;
    onHighlightRange?(date: Date): void;
    onSelect?(value: Props): void;
    onSelectStart?(value: moment.Moment): void;
    paginationArrowComponent?: PaginationArrow;
    selectedLabel?: string;
    selectionType?: 'single' |'range';
    singleDateRange?: boolean;
    showLegend?: boolean;
    stateDefinitions?: StateDefinitions;
    value?: moment.Moment | moment.Range;
}

interface DateState {
    state: string;
    range: moment.Range;
}

interface StateDefinitions {
    [key: string]: StateDefinition;
}

interface StateDefinition {
    color: string;
    label: string;
    selectable?: boolean;
}

interface PaginationArrowProps extends React.Props<{}> {
    disabled?: boolean;
    onTrigger?(): void;
    direction?: 'next' | 'previous';
}

declare class PaginationArrow extends React.Component<PaginationArrowProps, {}> {
}

