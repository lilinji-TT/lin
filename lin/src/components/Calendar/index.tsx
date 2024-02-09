import cs from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { CSSProperties, ReactNode, useState } from "react";
import CalendarHeader from "./Header";
import LocaleContext from "./LocaleContext";
import MonthCalendar from "./MonthCalendar";
import "./index.scss";
export interface CalendarProps {
  value: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  dateRender?: (date: Dayjs) => ReactNode;
  dateInnerContent?: (date: Dayjs) => ReactNode;
  locale?: string;
  onChange?: (date: Dayjs) => void;
}
export default function Calendar(props: CalendarProps) {
  const { className, style, value, locale, onChange } = props;
  const [curValue, setCurValue] = useState<Dayjs>(value);
  const [curMonth, setCurMonth] = useState<Dayjs>(value);
  const classNames = cs("calendar_container", className);

  const selectedHandler = (date: Dayjs) => {
    setCurValue(date);
    setCurMonth(date);
    onChange?.(date);
  };

  const prevMonthHandler = () => {
    setCurMonth(curMonth.subtract(1, "month"));
  };

  const nextMonthHandler = () => {
    setCurMonth(curMonth.add(1, "month"));
  };

  const todayHandler = () => {
    const date = dayjs(Date.now());
    selectedHandler(date);
  };
  return (
    <LocaleContext.Provider value={{ locale: locale || navigator.language }}>
      <div className={classNames} style={style}>
        <CalendarHeader
          curMonth={curMonth}
          todayHandler={todayHandler}
          prevMonthHandler={prevMonthHandler}
          nextMonthHanlder={nextMonthHandler}
        />
        <MonthCalendar
          {...props}
          value={curValue}
          curMonth={curMonth}
          selectedHandler={selectedHandler}
        />
      </div>
    </LocaleContext.Provider>
  );
}
