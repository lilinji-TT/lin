import cs from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { CSSProperties, ReactNode, useState } from "react";
import CalendarHeader from "./Header";
import LocaleContext from "./LocaleContext";
import MonthCalendar from "./MonthCalendar";
import "./index.scss";
export interface CalendarProps {
  value: Dayjs;
  defaultValue?: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  dateRender?: (date: Dayjs) => ReactNode;
  dateInnerContent?: (date: Dayjs) => ReactNode;
  locale?: string;
  onChange?: (date: Dayjs) => void;
}
export default function Calendar(props: CalendarProps) {
  const { className, style, value, locale, defaultValue, onChange } = props;
  const [curValue, setCurValue] = useState<Dayjs>(value);
  const [curMonth, setCurMonth] = useState<Dayjs>(value);
  const classNames = cs("calendar_container", className);

  const selectedHandler = (date: Dayjs) => {
    // 如果defalutValue存在而value不存在，那么我们就走非受控逻辑
    if (defaultValue) {
      setCurValue(date);
      setCurMonth(date);
    }

    // value存在就是受控逻辑
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
