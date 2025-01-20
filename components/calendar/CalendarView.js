import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles';
import { getMaxDays, getMonthName } from './DateFormatting';

const dateSquareSize = ((Dimensions.get("window").width * 0.8) / 7)

function CalendarView(props) {
    // const month = props.month;
    // const year = props.year;
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);

    const generateRows = () => {
        let rows = [];
        const maxDays = getMaxDays(month, year);
        { // Generate first row
            let dates = [];
            let firstDate = new Date(year + '-' + month + '-01');
            let firstDay = firstDate.getDay();
            for (let i = 0; i < 7; i++) {
                if (i < firstDay) dates.push(0);
                else dates.push((i - firstDay) + 1)
            }
            rows.push(dates);
        }

        // Generate last five rows

        for (let i = 1; i < 6; i++) {
            let dates = [];
            for (let j = 1; j < 8; j++) {
                let lastDate = rows[i - 1][6];
                let nextDate = lastDate + j;
                if (nextDate <= maxDays && lastDate != 0)
                    dates.push(rows[i - 1][6] + j);
                else dates.push(0);
            }
            rows.push(dates);
        }

        return (
            <>
                {
                    rows.map((row, i) => {
                        return (<View key={i} style={styles.row}>
                            {
                                row.map((day, j) => {
                                    return (
                                        <TouchableOpacity key={j} style={styles.dateSquare}>
                                            <Text style={styles.squareContent}>{day != 0 ? day : ""}</Text>
                                        </TouchableOpacity>
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
            <Text style={globalStyles.screenTitleCentered}>{getMonthName(month)} {year}</Text>
            <View style={globalStyles.rowSpacingWrapper}>
                <TouchableOpacity style={globalStyles.button} onPress={() => {
                    if (month == 1) {
                        setMonth(12);
                        setYear(year - 1);
                    } else setMonth(month - 1);
                }}>
                    <Text style={globalStyles.buttonTitle}>{"<"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={() => {
                    if (month == 12) {
                        setMonth(1);
                        setYear(year + 1);
                    } else setMonth(month + 1);
                }}>
                    <Text style={globalStyles.buttonTitle}>{">"}</Text>
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
    squareContent: {
        color: globalStyleVariables.textColor,
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
    }
})

export default CalendarView;