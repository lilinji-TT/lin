import cs from "classnames";
import { Dayjs } from "dayjs";
import { useContext } from "react";
import LocaleContext from "./LocaleContext";
import { CalendarProps } from "./index";
import allLocales from "./locale";

interface MonthCaldendarProps extends CalendarProps {
  curMonth: Dayjs;
  selectedHandler: (date: Dayjs) => void;
}

interface DateArray {
  date: Dayjs;
  currentMonth: boolean;
}
function getAllDays(date: Dayjs) {
  //   const daysInMonth = date.daysInMonth();
  const startDate = date.startOf("month");
  const day = startDate.day();

  // 初始化数组， 用于存储日期
  const daysInfo = new Array<DateArray>(6 * 7).fill({} as DateArray);

  // 前一个月的, 本月第一天之前的日期
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, "day"),
      currentMonth: false,
    };
  }

  // 当前月份的, 本月第一天之后的日期
  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, "day");
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
    };
  }

  return daysInfo;
}

function renderDays(
  days: DateArray[],
  dateRender: MonthCaldendarProps["dateRender"],
  dateInnerContent: MonthCaldendarProps["dateInnerContent"],
  value: Dayjs,
  selectedHandler: MonthCaldendarProps["selectedHandler"]
) {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      const item = days[i * 7 + j];
      row[j] = (
        <div
          className={
            "calendar-month-body-cell " +
            (item.currentMonth ? "calendar-month-body-cell-current" : "")
          }
          onClick={() => selectedHandler?.(item.date)}
        >
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div className="calendar-month-body-cell-date">
              <div
                className={cs(
                  "calendar-month-body-cell-date-value",
                  value.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD")
                    ? "calendar-month-body-cell-date-selected"
                    : ""
                )}
              >
                {item.date.date()}
              </div>
              <div className="calendar-month-body-cell-content">
                {dateInnerContent?.(item.date)}
              </div>
            </div>
          )}
        </div>
      );
    }

    rows.push(row);
  }

  return rows.map((row) => (
    <div className="calendar-month-body-row">{row}</div>
  ));
}

export default function MonthCalendar(props: MonthCaldendarProps) {
  const weekList = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const allDays = getAllDays(props.curMonth);
  const localeContext = useContext(LocaleContext);
  const CalendarLocale = allLocales[localeContext.locale];

  const { dateInnerContent, dateRender, selectedHandler, value } = props;

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {CalendarLocale.week[week]}
          </div>
        ))}
      </div>
      <div className="calendar-month-body">
        {renderDays(
          allDays,
          dateRender,
          dateInnerContent,
          value,
          selectedHandler
        )}
      </div>
    </div>
  );
}
