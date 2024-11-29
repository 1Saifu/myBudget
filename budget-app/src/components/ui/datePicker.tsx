"use client"

import React from "react";
import { DateRange } from "react-date-range";
import { enUS } from "date-fns/locale"; 
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import './style/date.css'

type DateRangeType = {
    startDate: Date;
    endDate: Date;
    key: string;
};

interface DatePickerProps {
    dateRange: DateRangeType;
    onChange: (range: DateRangeType) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ dateRange, onChange }) => {
    return (
        <div className="date-range-picker"> 
            <DateRange
                ranges={[dateRange]}
                onChange={(ranges) => onChange(ranges.selection as DateRangeType)}
                direction="vertical"
                showDateDisplay={false}
                rangeColors={['#800080', '#800080']}                 
                locale={enUS} 
            />
        </div>
    );
};

export default DatePicker;