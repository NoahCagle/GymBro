import { Text, View } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../../../../styles/styles';
import { Agenda } from 'react-native-calendars';
import AgendaItem from '../../../../../components/calendar/AgendaItem';
import { TouchableOpacity } from 'react-native';

function CalendarView(props) {
    const embedded = props.embedded;

    const returnBody = () => {
        return (
            <Agenda
                style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: globalStyleVariables.outlineColor,
                    backgroundColor: globalStyleVariables.bgColor,
                }}
                theme={{
                    backgroundColor: globalStyleVariables.formBgColor,
                    calendarBackground: globalStyleVariables.formBgColor,
                    dayTextColor: globalStyleVariables.textColor,
                    textDisabledColor: globalStyleVariables.outlineColor,
                    monthTextColor: globalStyleVariables.textColor,
                    agendaDayTextColor: globalStyleVariables.textColor,

                }}
                items={{
                    '2024-10-22': [{ name: 'item 1 - any js object', data: "" }],
                    '2024-10-23': [{ name: 'item 2 - any js object', data: "" }],
                    '2024-11-12': [{ name: 'item 3 - any js object', data: "" }],
                }}
                renderItem={(item, isFirst) => {
                    <View style={{flex: 1, backgroundColor: "#000000"}}></View>
                }}
            />
        )
    }

    return (
        <View style={globalStyles.container}>
            {returnBody()}
        </View>
    )
}

export default CalendarView;