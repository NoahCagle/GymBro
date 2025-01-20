import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles';
import { getMaxDays, getMonthName, numberToDD, parseMonth, parseYear } from './DateFormatting';

const dateSquareSize = ((Dimensions.get("window").width * 0.8) / 7)
const emptyDate = null;

function CalendarView(props) {
    const selectedDate = props.selectedDate;
    const [month, setMonth] = useState(parseMonth(selectedDate));
    const [year, setYear] = useState(parseYear(selectedDate));
    const selectAction = props.selectAction;
    const dates = props.dates; // All dates from dataTracker, ie all dates with data recorded

    const dateHasData = (date) => {
        for (let i = 0; i < dates.length; i++) {
            if (date == dates[i].date) {
                return true;
                break;
            }
        }
        return false;
    }

    const generateRows = () => {
        let rows = [];
        const maxDays = getMaxDays(month, year);
        { // Generate first row
            let dates = [];
            let firstDate = new Date(year + '-' + month + '-01');
            let firstDay = firstDate.getDay();
            for (let i = 0; i < 7; i++) {
                if (i >= firstDay) {
                    let label = (i - firstDay) + 1;
                    dates.push({ label: label, date: new Date(year + '-' + month + '-' + numberToDD(label + 1)) });
                }
                else dates.push(emptyDate)
            }
            rows.push(dates);
        }

        // Generate last five rows

        for (let i = 1; i < 6; i++) {
            let dates = [];
            for (let j = 1; j < 8; j++) {
                let lastDate = rows[i - 1][6];
                if (lastDate != emptyDate) {
                    let nextDate = lastDate.label + j;
                    if (nextDate <= maxDays) {
                        let label = nextDate;
                        dates.push({ label: label, date: new Date(year + '-' + month + '-' + numberToDD(label + 1)) });
                    }
                    else dates.push(emptyDate);
                }
            }
            rows.push(dates);
        }

        return (
            <>
                {
                    rows.map((row, i) => {
                        return (<View key={i} style={styles.row}>
                            {
                                row.map((date, j) => {
                                    return (
                                        <CalendarDate key={j} obj={date} highlighted={date != emptyDate && dateHasData(date.date.toLocaleDateString())} selected={date != emptyDate && date.date.toLocaleDateString() == selectedDate} selectAction={() => {
                                            if (date != emptyDate) selectAction(date.date)
                                        }} />
                                    )
                                })
                            }
                        </View>)
                    })
                }
            </>
        )

    }

    return (
        <View style={globalStyles.formWrapper}>
            <View style={globalStyles.rowSpacingWrapper}>
                <TouchableOpacity onPress={() => {
                    if (month == 1) {
                        setMonth(12);
                        setYear(year - 1);
                    } else setMonth(month - 1);
                }}>
                    <Text style={globalStyles.screenTitleCentered}>{"◄"}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.screenTitleCentered}>{getMonthName(month)} {year}</Text>
                <TouchableOpacity onPress={() => {
                    if (month == 12) {
                        setMonth(1);
                        setYear(year + 1);
                    } else setMonth(month + 1);
                }}>
                    <Text style={globalStyles.screenTitleCentered}>{"►"}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Mon</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Tue</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Wed</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Thu</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Fri</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Sat</Text>
                </View>
                <View style={styles.dateSquare}>
                    <Text style={styles.squareContent}>Sun</Text>
                </View>
            </View>
            {
                generateRows()
            }
        </View>
    )
}

function CalendarDate(props) {
    const obj = props.obj;
    const selectAction = props.selectAction;
    const selected = props.selected;
    const highlighted = props.highlighted;

    return (
        <TouchableOpacity style={selected ? styles.selectedDateSquare : styles.dateSquare} onPress={() => { if (highlighted) selectAction() }}>
            <Text style={highlighted && !selected ? styles.highlightedSquareContent : styles.squareContent}>{obj != emptyDate ? obj.label : ""}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    row: {
        padding: 0,
        margin: 0,
        width: "100%",
        height: dateSquareSize,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    dateSquare: {
        width: dateSquareSize,
        height: dateSquareSize,
        padding: 0,
        margin: 0,
        borderWidth: 1,
        borderColor: globalStyleVariables.outlineColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedDateSquare: {
        width: dateSquareSize,
        height: dateSquareSize,
        backgroundColor: "orangered",
        padding: 0,
        margin: 0,
        borderWidth: 1,
        borderColor: globalStyleVariables.outlineColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    squareContent: {
        color: globalStyleVariables.textColor,
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
    },
    highlightedSquareContent: {
        color: "coral",
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
    }
})

export default CalendarView;